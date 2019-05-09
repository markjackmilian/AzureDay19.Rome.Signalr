using System;
using System.Threading.Tasks;
using AzureDay.Rome.Remote.Classes;
using AzureDay.Rome.Remote.Models;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;

namespace AzureDay.Rome.Remote.Hubs.Impl
{
    public class GameHub : IGameHub
    {
        private readonly HubConnection _connection;

        public event EventHandler<Player> OnNewPlayerInYourTeamJoined;
        public event EventHandler OnGameStart;
        public event EventHandler<GameResult> OnGameEnd;
        public event EventHandler<int> OnGameProgressUpdate;
        public event EventHandler OnRegisterDone;
        
        public event EventHandler<GameState> OnGameStateReceived;

        public GameHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl(Configuration.GameServer).Build();
            
            this._connection.On("gameStarted",new Action(() =>
            {
                this.OnGameStart?.Invoke(this,null);
            }));
            
            this._connection.On("gameEnded",new Action<GameResult>((gameResult) =>
            {
                this.OnGameEnd?.Invoke(this,gameResult);
            }));
            
            this._connection.On("gameProgress",new Action<int>((position) =>
            {
                this.OnGameProgressUpdate?.Invoke(this,position);
            }));
            
            this._connection.On("registerDone",new Action(() =>
            {
                this.OnRegisterDone?.Invoke(this,null);
            }));
            
            this._connection.On("gameStateMode",new Action<GameState>((gameState) =>
            {
                this.OnGameStateReceived?.Invoke(this,gameState);
            }));
            
            
            this._connection.On("newPlayerInThisGroup",new Action<Player>((player) =>
            {
                this.OnNewPlayerInYourTeamJoined?.Invoke(this,player);
            }));
            
            
        }

        public void Start(Action onStarted)
        {
            this._connection.Start().Then(() =>onStarted?.Invoke(),o => Global.Alert(o.ToString()));
        }

        public void Stop()
        {
            this._connection.Stop();
        }

        public void Tap()
        {
            this._connection.Send("tap");
        }

        public Task Register(string name, Guid team)
        {
            var waitForMe = new WaitForMe<IGameHub, GameState>(this, hub => nameof(hub.OnRegisterDone));
            this._connection.Send("register",name,team);
            return waitForMe.Task;
        }

        public Task<GameState> GetGameMode()
        {
            var waitForMe = new WaitForMe<IGameHub, GameState>(this, hub => nameof(hub.OnGameStateReceived));
            this._connection.Send("getStateMode");
            return waitForMe.Task;
        }
    }
}