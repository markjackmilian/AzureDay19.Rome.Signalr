using AzureDay.Rome.Web.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace AzureDay.Rome.Web.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameStateRepository _gameStateRepository;

        public GameHub(IGameStateRepository gameStateRepository)
        {
            this._gameStateRepository = gameStateRepository;
        }
        
        public void Register(string name, string team)
        {
            
        }

        public void GetStateMode()
        {
            var currentState = this._gameStateRepository.GetCurrentState();
            this.Clients.Caller.SendAsync("gameStateMode", currentState);
        }
        
    }
}