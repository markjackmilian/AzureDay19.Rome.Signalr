using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Microsoft.AspNetCore.SignalR.Client;
using Xam.Zero.ViewModels;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.ViewModels
{
    public class ButtonsViewModel: ZeroBaseModel
    {
        private HubConnection hubConnection;

        public int Top { get; set; }
        public int Left { get; set; }

        public ICommand AddTopCommand { get; set; }
        public ICommand AddLeftCommand { get; set; }
        public ICommand ResetCommand { get; set; }
        
        public ButtonsViewModel()
        {
            this.AddTopCommand = new Command(async () => await this.InnerAddTop());
            this.AddLeftCommand = new Command(async () => await this.InnerAddLeft());
            this.ResetCommand = new Command(async () => await this.InnerReset());
            
            
            var ip = "localhost";
            if (Device.RuntimePlatform == Device.Android)
                ip = "10.0.2.2";
            
            this.hubConnection = new HubConnectionBuilder()
                .WithUrl($"http://{ip}:5000/moveIt")
                .Build();

            this.hubConnection.On<int>("updateTop", (top) => { this.Top = top; });
            this.hubConnection.On<int>("updateLeft", (left) => { this.Left = left; });
            
            this.hubConnection.StartAsync().ConfigureAwait(false);
        }

        private async Task InnerReset()
        {
            try
            {
                this.Left = 0;
                this.Top = 0;
                await this.hubConnection.SendAsync("sendLeft", this.Left);
                await this.hubConnection.SendAsync("sendTop", this.Top);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
        }

        private async Task InnerAddLeft()
        {
            try
            {
                this.Left+=10;
                await this.hubConnection.SendAsync("sendLeft", this.Left);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
        }

        private async Task InnerAddTop()
        {
            try
            {
                this.Top+=10;
                await this.hubConnection.SendAsync("sendTop", this.Top);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
        }
    }
}