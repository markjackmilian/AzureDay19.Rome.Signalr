using System;
using AzureDay.Rome.Remote.Hubs;
using Bridge.Html5;
using Bridge.Navigation;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class RegisterViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private readonly INavigator _navigator;
        public override string ElementId() => SpafApp.RegiserId;
        
        public knockout.KnockoutObservable<string> Name { get; set; }

        public RegisterViewModel(IGameHub gameHub, INavigator navigator)
        {
            this._gameHub = gameHub;
            this._navigator = navigator;
            this.Name = knockout.ko.observable.Self<string>();
        }

        public async void Register()
        {
            if (string.IsNullOrEmpty(this.Name.Self()))
            {
                Global.Alert("Inserisci un nome");
                return;
            }
            
            await this._gameHub.Register(this.Name.Self(),Guid.Parse("0d2c37f7-49fe-48d9-a1d3-1a90e7948bcc"));
            this._navigator.Navigate(SpafApp.GameId);
        }

    }
}