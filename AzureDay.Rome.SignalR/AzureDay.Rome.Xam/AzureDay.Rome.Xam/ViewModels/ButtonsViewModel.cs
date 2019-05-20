using System;
using System.Threading.Tasks;
using System.Windows.Input;
using AzureDay.Rome.Xam.Services;
using AzureDay.Rome.Xam.Services.Impl;
using Microsoft.AspNetCore.SignalR.Client;
using Xam.Zero.ViewModels;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.ViewModels
{
    public class ButtonsViewModel: ZeroBaseModel
    {
        private readonly IMoveItHubService _moveItHubService;

        public int Top { get; set; }
        public int Left { get; set; }

        public ICommand AddTopCommand { get; set; }
        public ICommand AddLeftCommand { get; set; }
        public ICommand ResetCommand { get; set; }
        
        public ButtonsViewModel(IMoveItHubService moveItHubService)
        {
            this._moveItHubService = moveItHubService;
            this.AddTopCommand = new Command(() => this.Top += 10);
            this.AddLeftCommand = new Command(() => this.Left += 10);
            this.ResetCommand = new Command(() =>
            {
                this.Left = 0;
                this.Top = 0;
            });


            this._moveItHubService.Connect();

            this._moveItHubService.OnTopChanged += (sender, i) => { this.Top = i; };
            this._moveItHubService.OnLeftChanged += (sender, i) => { this.Left = i; };
           
        }

        public async void OnTopChanged()
        {
            await this._moveItHubService.SendTop(this.Top);
        }
        
        public async void OnLeftChanged()
        {
            await this._moveItHubService.SendLeft(this.Left);
        }

       

     
    }
}