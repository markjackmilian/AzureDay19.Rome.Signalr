using System;
using System.Collections.Generic;
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
        public knockout.KnockoutObservable<bool> TooManyPlayers { get; set; }

        public RegisterViewModel(IGameHub gameHub, INavigator navigator)
        {
            this._gameHub = gameHub;
            this._navigator = navigator;
            this.Name = knockout.ko.observable.Self<string>();
            this.TooManyPlayers = knockout.ko.observable.Self<bool>();
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            try
            {
                this.TooManyPlayers.Self(false);
                base.OnLoad(parameters);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
           
        }

        public async void Register()
        {
            if (string.IsNullOrEmpty(this.Name.Self()))
            {
                Notification.Warning("Inserisci un nome");
                return;
            }
            
            
            var registered = await this._gameHub.Register(this.Name.Self(),Guid.Parse(SpafApp.TeamId));
            if (!registered)
            {
                this.TooManyPlayers.Self(true);
                Notification.Warning("Ci sono troppi giocatori connessi... dovevi essere piu veloce.");
                return;
            }
            this._navigator.Navigate(SpafApp.GameId);
        }

  

    }
}