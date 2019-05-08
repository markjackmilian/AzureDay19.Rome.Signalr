using System;
using Bridge.AspNetCore.SignalR.Client;

namespace AzureDay.Rome.Remote.Hubs.Impl
{
    public class GameHub : IGameHub
    {
        private HubConnection _connection;

        public GameHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("http://localhost:5000/play").Build();
        }

        public void Start()
        {
            this._connection.Start();
        }

        public void Stop()
        {
            this._connection.Stop();
        }

        public void Tap()
        {
            this._connection.Send("tap");
        }

        public void Register(string name, int team)
        {
            this._connection.Send("register",name,team);
        }
    }
}