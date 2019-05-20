using System;
using System.Threading.Tasks;
using AzureDay.Rome.Remote.Classes;
using AzureDay.Rome.Shared;

namespace AzureDay.Rome.Remote.Hubs.Impl
{
    public class GameHub : BaseHub, IGameHub
    {
        protected override string HubUrl { get; } = Configuration.GameServer;

        public event EventHandler<Player> OnNewPlayerInYourTeamJoined;
        public event EventHandler<bool> OnRegisterResult;
        
        public event EventHandler<GameState> OnGameStateReceived;
        public event EventHandler OnYourTeamWins;
        public event EventHandler OnYourTeamLost;

        public GameHub()
        {
            this.Connection.On("registerResult",new Action<bool>((registered) =>
            {
                this.OnRegisterResult?.Invoke(this,registered);
            }));
            
            this.Connection.On("gameStateMode",new Action<GameState>((gameState) =>
            {
                this.OnGameStateReceived?.Invoke(this,gameState);
            }));
            
            
            this.Connection.On("newPlayerInThisGroup",new Action<Player>((player) =>
            {
                this.OnNewPlayerInYourTeamJoined?.Invoke(this,player);
            }));
            
            this.Connection.On("yourTeamWins",new Action(() =>
            {
                this.OnYourTeamWins?.Invoke(this,null);
            }));
            
            this.Connection.On("yourTeamLost",new Action(() =>
            {
                this.OnYourTeamLost?.Invoke(this,null);
            }));
        }

        public void Tap()
        {
            this.Connection.Send("tap");
        }

        public Task<bool> Register(string name, Guid team)
        {
            var waitForMe = new WaitForMe<IGameHub, bool>(this, hub => nameof(hub.OnRegisterResult));
            this.Connection.Send("register",name,team);
            return waitForMe.Task;
        }

        public Task<GameState> GetGameMode()
        {
            var waitForMe = new WaitForMe<IGameHub, GameState>(this, hub => nameof(hub.OnGameStateReceived));
            this.Connection.Send("getStateMode");
            return waitForMe.Task;
        }
    }
}