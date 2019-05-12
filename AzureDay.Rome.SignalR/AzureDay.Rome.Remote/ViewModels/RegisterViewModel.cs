using System;
using AzureDay.Rome.Remote.Classes;
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
                Notification.Warning("Inserisci un nome");
                return;
            }
            
            await this._gameHub.Register(this.Name.Self(),SpafApp.TeamId);
            this._navigator.Navigate(SpafApp.GameId);
        }

    }
}