using System;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;

namespace AzureDay.Rome.Remote.Hubs.Impl
{
    public abstract class BaseHub : IBaseHub
    {
        protected abstract string HubUrl { get; }

        public event EventHandler OnConnectionLost;
        public HubConnection Connection { get; }

        protected BaseHub()
        {
            this.Connection =  new HubConnectionBuilder().WithUrl(Configuration.GameServer).Build();
            this.Connection.OnClose(error => this.OnConnectionLost?.Invoke(this,null));
        }
        public virtual void Start(Action onStarted)
        {
            this.Connection.Start()
                .Then(() =>onStarted?.Invoke(),o => Global.Alert(o.ToString()));
        }

        public virtual void Stop()
        {
            this.Connection.Stop();
        }
    }
}