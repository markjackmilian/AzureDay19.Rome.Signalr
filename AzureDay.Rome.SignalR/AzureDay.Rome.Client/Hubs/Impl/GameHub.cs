using System;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;
using Bridge.Spaf.Models;

namespace Bridge.Spaf.Hubs
{
    class GameHub : IGameHub
    {
        private HubConnection _connection;
        
        public event EventHandler<GameState> OnGameStateReceived;
        public event EventHandler<Tuple<string, Guid>> OnNewPlayerJoined;


        public GameHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("/play").Build();
            
            this._connection.On("gameStateMode",new Action<GameState>((gameState) =>
            {
                this.OnGameStateReceived?.Invoke(this,gameState);
            }));
            
            this._connection.On("newPlayerJoined",new Action<string,Guid>((name,team) =>
            {
                this.OnNewPlayerJoined?.Invoke(this,Tuple.Create(name,team));
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