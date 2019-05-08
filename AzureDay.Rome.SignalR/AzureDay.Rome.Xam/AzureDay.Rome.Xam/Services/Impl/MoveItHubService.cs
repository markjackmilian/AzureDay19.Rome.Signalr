using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.Services.Impl
{
    class MoveItHubService : IMoveItHubService
    {
        private HubConnection _hubConnection;
        public event EventHandler<int> OnLeftChanged;
        public event EventHandler<int> OnTopChanged;
        
        public Task SendTop(int top)
        {
            return this._hubConnection.SendAsync("sendTop", top);
        }

        public Task SendLeft(int left)
        {
            return this._hubConnection.SendAsync("sendLeft", left);
        }

        public Task Connect()
        {
            var ip = "localhost";
            if (Device.RuntimePlatform == Device.Android)
                ip = "10.0.2.2";
            
            this._hubConnection = new HubConnectionBuilder()
                .WithUrl($"http://{ip}:5000/moveIt")
                .Build();

            this._hubConnection.On<int>("updateTop", (top) => { this.OnTopChanged?.Invoke(this,top); });
            this._hubConnection.On<int>("updateLeft", (left) => { this.OnLeftChanged?.Invoke(this,left); });
            
            return this._hubConnection.StartAsync();
        }

        public Task Stop()
        {
            return this._hubConnection.StopAsync();
        }
    }
}