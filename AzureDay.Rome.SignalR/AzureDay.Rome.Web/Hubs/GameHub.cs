using System;
using AzureDay.Rome.Web.Model;
using AzureDay.Rome.Web.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace AzureDay.Rome.Web.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameStateRepository _gameStateRepository;
        private readonly ITeamRepository _teamRepository;

        public GameHub(IGameStateRepository gameStateRepository, ITeamRepository teamRepository)
        {
            this._gameStateRepository = gameStateRepository;
            this._teamRepository = teamRepository;
        }
        
        public void Register(string name, Guid team)
        {
            this._teamRepository.AddPlayer(name, team, this.Context.ConnectionId);
            this.Clients.Caller.SendAsync("registerDone");

            this.Groups.AddToGroupAsync(this.Context.ConnectionId, team.ToString());
            this.Clients.Group(team.ToString()).SendAsync("newPlayerInThisGroup", name);
            this.Clients.Client(AdminUser.Connection).SendAsync("newPlayerJoined",name,team);
        }

        public void OpenRegistration()
        {
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
        }
        
    }

    public class AdminUser
    {
        public static string Connection { get; set; }
    }
}