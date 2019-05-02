using System;
using System.Threading.Tasks;
using Blazor.Extensions;

namespace ASP.NETCoreWebApplication.Client.Hubs.Impl
{
    class ChatHub : IChatHub
    {
        private readonly HubConnection _connection;

        public ChatHub()
        {
            this._connection = new HubConnectionBuilder().WithUrl("chathub").Build();
            this._connection.On<string, string>("broadcastMessage", this.OnBroadcastMessage);
        }

        private Task OnBroadcastMessage(string name, string message)
        {
            this.OnMessagereceived?.Invoke(this,Tuple.Create(name,message));
            return Task.CompletedTask;
        }

        public event EventHandler<Tuple<string,string>> OnMessagereceived;
        public Task Send(string message)
        {
            return this._connection.InvokeAsync("Send", "Blazor Client", message);
        }

        public Task Start()
        {            
            return this._connection.StartAsync();
        }

        public Task Stop()
        {
            return this._connection.StopAsync();
        }
    }
}