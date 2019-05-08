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
            // todo manage groups
        }

        public void OpenRegistration()
        {
            this._teamRepository.ClearPlayers();
            this._gameStateRepository.OpenRegisterMode();
            this.Clients.All.SendAsync("gameStateMode",GameState.Register);
        }

        public void GetStateMode()
        {
            var currentState = this._gameStateRepository.GetCurrentState();
            this.Clients.Caller.SendAsync("gameStateMode", currentState);
        }

        public void SetUpAdmin()
        {
        }
        
    }
}