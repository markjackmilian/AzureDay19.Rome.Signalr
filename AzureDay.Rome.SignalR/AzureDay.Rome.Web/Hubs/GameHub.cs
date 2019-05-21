using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureDay.Rome.Remote;
using AzureDay.Rome.Shared;
using AzureDay.Rome.Web.Model;
using AzureDay.Rome.Web.Repositories;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Internal;

namespace AzureDay.Rome.Web.Hubs
{
    public class GameHub : Hub
    {
        
        private readonly IGameStateRepository _gameStateRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly Random _rand;

        private IClientProxy AllPlayers =>
            this.Clients.Clients(this._teamRepository.GetAllPlayersConnections);

        public GameHub(IGameStateRepository gameStateRepository, ITeamRepository teamRepository)
        {
            this._gameStateRepository = gameStateRepository;
            this._teamRepository = teamRepository;
            this._rand = new Random();
        }
        
        /// <summary>
        /// A connection register as a player
        /// </summary>
        /// <param name="name"></param>
        /// <param name="team"></param>
        public async Task Register(string name, string team)
        {
            // check max numbers of players
            if (this._teamRepository.GetAllPlayers().Count() >= SharedConfiguration.MaxPlayers)
            {
                await this.Clients.Caller.SendAsync("registerResult",false);
                await this.Clients.Client(AdminUser.Connection).SendAsync("tooManyPlayers");

                return;
            }
            
            var teamId = Guid.Parse(team);
            
            if (this._gameStateRepository.GetCurrentState() != GameState.Register) return; // wrong state

            var player = this._teamRepository.AddPlayer(name, teamId, this.Context.ConnectionId);
            await this.Clients.Caller.SendAsync("registerResult",true);

            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, team.ToString());
            await this.Clients.OthersInGroup(team).SendAsync("newPlayerInThisGroup", player);
            
            if(!string.IsNullOrEmpty(AdminUser.Connection))
                await this.Clients.Client(AdminUser.Connection).SendAsync("newPlayerJoined",player,team);
        }

        /// <summary>
        /// Open state for registering
        /// </summary>
        public async Task OpenRegistration()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Closed) return; // wrong state

            // clear groups
            var teams = this._teamRepository.GetAllTeams();
            foreach (var team in teams)
            {
                team.ClearTestScore();
                team.Weight = 1;
                foreach (var teamPlayer in team.Players)
                {
                    await this.Groups.RemoveFromGroupAsync(teamPlayer.ConnectionId,team.Id.ToString());
                }
            }
            
            // clear players
            this._teamRepository.ClearPlayers();
            
            // set registering mode
            this._gameStateRepository.OpenRegisterMode();
            
            // notify state
            await this.Clients.All.SendAsync("gameStateMode",GameState.Register);
        }

        public async Task StopGame()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.InRun) return; // wrong state
            this._gameStateRepository.StopGame();
            await this.Clients.All.SendAsync("gameStateMode",GameState.Closed);
        }

        /// <summary>
        /// Received command to change gamestate to InRun
        /// </summary>
        public async Task StartGame()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Register) return; // wrong state

            this._gameStateRepository.StartGameMode();
            this._teamRepository.SetupWeights();
            
            // i notify only to all connections in game
            await this.Clients.Client(AdminUser.Connection).SendAsync("gameStateMode", GameState.InRun);
            await this.AllPlayers.SendAsync("gameStateMode",GameState.InRun);
        }
        
        public async Task ReStart()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Finished) return; // wrong state

            this._gameStateRepository.StopGame();
            await this.Clients.All.SendAsync("gameStateMode",GameState.Closed);
        }

        /// <summary>
        /// Recover actual state
        /// </summary>
        public async Task GetStateMode()
        {
            var currentState = this._gameStateRepository.GetCurrentState();
            await this.Clients.Caller.SendAsync("gameStateMode", currentState);
        }

        /// <summary>
        /// Set admin connection
        /// </summary>
        public async Task SetUpAdmin()
        {
            AdminUser.Connection = this.Context.ConnectionId;
            await this.GetStateMode();
        }

        /// <summary>
        /// Receive a tap
        /// </summary>
        public async Task Tap()
        {
            if (this._gameStateRepository.GetCurrentState() == GameState.Finished) return; // already finisched
            
            var teamClick = this._teamRepository.AddCLickForPLayerWithConnection(this.Context.ConnectionId);
            var team = this._teamRepository.GetTeamByPlayerConnection(this.Context.ConnectionId);

            if (team == null) return;
            
            await this.Clients.Client(AdminUser.Connection).SendAsync("tapCount", teamClick, team.Id);
            await this.CheckWinner(team);
        }

        public async Task AutoTap()
        {
            if (this._gameStateRepository.GetCurrentState() == GameState.Finished) return; // already finisched
            var allTeams = this._teamRepository.GetAllTeams();
            var webTeams = allTeams as WebTeam[] ?? allTeams.ToArray();
            var team = webTeams.ElementAt(this._rand.Next(webTeams.Count()));

            team.AddTestClick();

            
            await this.Clients.Client(AdminUser.Connection).SendAsync("tapCount", team.TestScore, team.Id);
            
            if (team.TestScore < SharedConfiguration.FinishLine) return; // check max point
            
            this._gameStateRepository.FinishedGameMode();
            await this.Clients.All.SendAsync("gameStateMode",GameState.Finished);
        }

        /// <summary>
        /// Evaluate game for the passed team
        /// </summary>
        /// <param name="checkTeam"></param>
        private async Task CheckWinner(WebTeam checkTeam)
        {
            if (checkTeam.TeamScore < SharedConfiguration.FinishLine) return; // check max point
            
            this._gameStateRepository.FinishedGameMode();
            await this.AllPlayers.SendAsync("gameStateMode",GameState.Finished);
            await this.Clients.Client(AdminUser.Connection).SendAsync("gameStateMode",GameState.Finished);


            var teams = this._teamRepository.GetAllTeams();
            foreach (var team in teams)
                await this.Clients.Group(team.Id.ToString()).SendAsync(team.Id == checkTeam.Id ? "yourTeamWins" :"yourTeamLost");
        }

        /// <summary>
        /// Override ondisconnected to clear list of players
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var team = this._teamRepository.GetTeamByPlayerConnection(this.Context.ConnectionId);
            if (team == null)
                return Task.CompletedTask; // connection not registered as a plyer

            var player = team.Players.SingleOrDefault(s => s.ConnectionId == this.Context.ConnectionId);
            team.RemovePlayerByConnectionId(this.Context.ConnectionId);
            this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, team.Id.ToString());
            this._teamRepository.UpdateTeam(team);
            
            if(!string.IsNullOrEmpty(AdminUser.Connection))
                this.Clients.Client(AdminUser.Connection).SendAsync("playerLeaved",player,team.Id);
            
            return base.OnDisconnectedAsync(exception);
        }
    }

}