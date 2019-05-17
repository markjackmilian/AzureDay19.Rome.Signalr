using System;
using System.Linq;
using System.Threading.Tasks;
using AzureDay.Rome.Shared;
using AzureDay.Rome.Web.Model;
using AzureDay.Rome.Web.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace AzureDay.Rome.Web.Hubs
{
    public class GameHub : Hub
    {
        /// <summary>
        /// How many tap do you need to win
        /// </summary>
        private const int FinishLine = 20;
        
        private readonly IGameStateRepository _gameStateRepository;
        private readonly ITeamRepository _teamRepository;

        public GameHub(IGameStateRepository gameStateRepository, ITeamRepository teamRepository)
        {
            this._gameStateRepository = gameStateRepository;
            this._teamRepository = teamRepository;
        }
        
        /// <summary>
        /// A connection register as a player
        /// </summary>
        /// <param name="name"></param>
        /// <param name="team"></param>
        public void Register(string name, string team)
        {
            var teamId = Guid.Parse(team);
            
            if (this._gameStateRepository.GetCurrentState() != GameState.Register) return; // wrong state

            var player = this._teamRepository.AddPlayer(name, teamId, this.Context.ConnectionId);
            this.Clients.Caller.SendAsync("registerDone");

            this.Groups.AddToGroupAsync(this.Context.ConnectionId, team.ToString());
            this.Clients.OthersInGroup(team.ToString()).SendAsync("newPlayerInThisGroup", player);
            
            if(!string.IsNullOrEmpty(AdminUser.Connection))
                this.Clients.Client(AdminUser.Connection).SendAsync("newPlayerJoined",player,team);
        }

        /// <summary>
        /// Open state for registering
        /// </summary>
        public void OpenRegistration()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Closed) return; // wrong state

            // clear groups
            var teams = this._teamRepository.GetAllTeams();
            foreach (var team in teams)
            {
                foreach (var teamPlayer in team.Players)
                {
                    this.Groups.RemoveFromGroupAsync(teamPlayer.ConnectionId,team.Id.ToString());
                }
            }
            
            // clear players
            this._teamRepository.ClearPlayers();
            
            // set registering mode
            this._gameStateRepository.OpenRegisterMode();
            
            // notify state
            this.Clients.All.SendAsync("gameStateMode",GameState.Register);
        }

        /// <summary>
        /// Received command to change gamestate to InRun
        /// </summary>
        public void StartGame()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Register) return; // wrong state

            this._gameStateRepository.StartGameMode();
            this.Clients.All.SendAsync("gameStateMode",GameState.InRun);
        }
        
        public void ReStart()
        {
            if (this._gameStateRepository.GetCurrentState() != GameState.Finished) return; // wrong state

            this._gameStateRepository.StopGame();
            this.Clients.All.SendAsync("gameStateMode",GameState.Closed);
        }


        /// <summary>
        /// Recover actual state
        /// </summary>
        public void GetStateMode()
        {
            var currentState = this._gameStateRepository.GetCurrentState();
            this.Clients.Caller.SendAsync("gameStateMode", currentState);
        }

        /// <summary>
        /// Set admin connection
        /// </summary>
        public void SetUpAdmin()
        {
            AdminUser.Connection = this.Context.ConnectionId;
            this.GetStateMode();
        }

        /// <summary>
        /// Receive a tap
        /// </summary>
        public void Tap()
        {
            if (this._gameStateRepository.GetCurrentState() == GameState.Finished) return; // already finisched
            
            var teamClick = this._teamRepository.AddCLickForPLayerWithConnection(this.Context.ConnectionId);
            var team = this._teamRepository.GetTeamByPlayerConnection(this.Context.ConnectionId);

            if (team == null) return;
            
            this.Clients.Client(AdminUser.Connection).SendAsync("tapCount", teamClick, team.Id);
            this.CheckWinner(team);
        }

        /// <summary>
        /// Evaluate game for the passed team
        /// </summary>
        /// <param name="checkTeam"></param>
        private void CheckWinner(WebTeam checkTeam)
        {
            if (checkTeam.TeamScore < FinishLine) return; // check max point
            
            this._gameStateRepository.FinishedGameMode();
            this.Clients.All.SendAsync("gameStateMode", GameState.Finished); // stop clients 

            var teams = this._teamRepository.GetAllTeams();
            foreach (var team in teams)
                this.Clients.Group(team.Id.ToString()).SendAsync(team.Id == checkTeam.Id ? "yourTeamWins" :"yourTeamLost");
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