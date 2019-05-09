using System;
using Bridge.AspNetCore.SignalR.Client;

namespace AzureDay.Rome.Client.Hubs.Impl
{
    class MoveItHub : IMoveItHub
    {
        private readonly HubConnection _connection;
        
        public event EventHandler<int> OnLeftChanged;
        public event EventHandler<int> OnTopChanged;

        public MoveItHub()
        {
            this._connection =  new HubConnectionBuilder().WithUrl("/moveIt").Build();
            this._connection.On("updateTop",new Action<int>((top) =>
            {
                this.OnTopChanged?.Invoke(this,top);
            }));
            this._connection.On("updateLeft",new Action<int>((left) =>
            {
                this.OnLeftChanged?.Invoke(this,left);
            }));
        }
        
        public void Start(Action onConnected = null)
        {
            this._connection.Start();
        }

        public void Stop()
        {
            this._connection.Stop();
        }

        public void SendTop(int top)
        {
            this._connection.Send("sendTop", top);
        }

        public void SendLeft(int left)
        {
            this._connection.Send("sendLeft", left);
        }
    }

    
}