using System;
using AzureDay.Rome.Client.Models;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;

namespace AzureDay.Rome.Client.Hubs.Impl
{
    class GameHub : IGameHub
    {
        private HubConnection _connection;
        
        public event EventHandler<GameState> OnGameStateReceived;
        public event EventHandler<Tuple<Player, Guid>> OnNewPlayerJoined;
        public event EventHandler<Tuple<Player, Guid>> OnPlayerLeaved;
        public event EventHandler<Tuple<int, Guid>> OnTapCountReceived;


        public GameHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("/play").Build();
            
            this._connection.On("gameStateMode",new Action<GameState>((gameState) =>
            {
                this.OnGameStateReceived?.Invoke(this,gameState);
            }));
            
            this._connection.On("newPlayerJoined",new Action<Player,Guid>((name,team) =>
            {
                this.OnNewPlayerJoined?.Invoke(this,Tuple.Create(name,team));
            }));
            
            this._connection.On("playerLeaved",new Action<Player,Guid>((name,team) =>
            {
                this.OnPlayerLeaved?.Invoke(this,Tuple.Create(name,team));
            }));
            
            this._connection.On("tapCount",new Action<int,Guid>((name,team) =>
            {
                this.OnTapCountReceived?.Invoke(this,Tuple.Create(name,team));
            }));
            
            
            
        }
        

        public void Start(Action onConnected = null)
        {
            this._connection.Start().Then(() => onConnected?.Invoke(), o => {})
                .Catch(o => Global.Alert(o.ToString()));
        }

        public void Stop()
        {
            this._connection.Stop();
        }



        public void StartGame()
        {
            this._connection.Invoke("startGame");
        }

        public void OpenRegistration()
        {
            this._connection.Invoke("openRegistration");
        }

        public void NotifyIAmTheAdmin()
        {
            this._connection.Invoke("setUpAdmin");
        }
    }
}