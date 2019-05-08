using System;
using Bridge.AspNetCore.SignalR.Client;
using IPromise = Bridge.AspNetCore.SignalR.Client.Threading.IPromise;

namespace Bridge.Spaf.Hubs.Impl
{
    class ChatHub : IChatHub
    {
        private readonly HubConnection _connection;

        public ChatHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("/chat").Build();
            this._connection.On("broadcastMessage",new Action<string, string>((name, message) =>
            {
                this.OnMessagereceived?.Invoke(this,Tuple.Create(name,message));
            }));
        }

        public event EventHandler<Tuple<string,string>> OnMessagereceived;
        public void Send(string message)
        {
            this._connection.Invoke("Send", "Blazor Client", message);
        }

        public void Start()
        {            
            this._connection.Start();
        }

        public void Stop()
        {
            this._connection.Stop();
        }
    }
}