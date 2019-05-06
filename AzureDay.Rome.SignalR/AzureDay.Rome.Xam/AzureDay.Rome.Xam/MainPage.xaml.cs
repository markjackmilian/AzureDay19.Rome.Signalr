using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam
{
    public partial class MainPage : ContentPage
    {
        private HubConnection hubConnection;

        private int _top = 0;
        private int _left = 0;

        public MainPage()
        {
            InitializeComponent();
            
            // localhost for UWP/iOS or special IP for Android
            var ip = "localhost";
            if (Device.RuntimePlatform == Device.Android)
                ip = "10.0.2.2";
            
            this.hubConnection = new HubConnectionBuilder()
                .WithUrl($"http://{ip}:5000/moveIt")
                .Build();
            
            this.hubConnection.StartAsync();
        }
        
        
        async Task Connect()
        {
            try
            {                
                await this.hubConnection.StartAsync();
            }
            catch (Exception ex)
            {
                // Something has gone wrong
            }
        }

        private async void AddTopButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                this._top+=10;
                await this.hubConnection.SendAsync("sendTop", this._top);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
           
        }
        
        private async void AddLeftButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                this._left+=10;
                await this.hubConnection.SendAsync("sendLeft", this._left);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
           
        }
        
        private async void ResetButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                this._left = 0;
                this._top = 0;
                await this.hubConnection.SendAsync("sendLeft", this._left);
                await this.hubConnection.SendAsync("sendTop", this._left);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                throw;
            }
           
        }

       
    }
}