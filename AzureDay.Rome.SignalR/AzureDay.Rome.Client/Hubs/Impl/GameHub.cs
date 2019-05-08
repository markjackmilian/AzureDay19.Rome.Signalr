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


        public GameHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("/play").Build();
            
            this._connection.On("gameStateMode",new Action<GameState>((gameState) =>
            {
                this.OnGameStateReceived?.Invoke(this,gameState);
            }));
        }
        
        public void Start()
        {
            this._connection.Start().Catch(o => Global.Alert(o.ToString()));
        }

        public void Stop()
        {
            this._connection.Stop();
        }


        public void OpenRegistration()
        {
            this._connection.Invoke("openRegistration");
        }
    }
}