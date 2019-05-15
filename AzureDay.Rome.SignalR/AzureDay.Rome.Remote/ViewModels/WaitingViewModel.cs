using System;
using System.Collections.Generic;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Shared;
using Bridge.Html5;
using Bridge.Navigation;
using Bridge.Spaf;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class WaitingViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private readonly INavigator _navigator;
        public override string ElementId() => SpafApp.WaitingId;

        public WaitingViewModel(IGameHub gameHub, INavigator navigator)
        {
            this._gameHub = gameHub;
            this._navigator = navigator;
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            if(e == GameState.Register)
                this._navigator.Navigate(SpafApp.RegiserId);
        }

        public override void OnLeave()
        {
            base.OnLeave();
            this._gameHub.OnGameStateReceived -= this.GameHubOnOnGameStateReceived;
        }

        public override async void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);

            try
            {
                SpafApp.TeamId = parameters.GetParameter<Guid>("teamId");
            }
            catch (Exception e)
            {
                Global.Alert("Errore, non trovo il team id!");
                throw;
            }
          

            var mode = await this._gameHub.GetGameMode();

            switch (mode)
            {
                case GameState.Closed:
                    this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
                    break;
                case GameState.Register:
                    this._navigator.Navigate(SpafApp.RegiserId);
                    break;
                case GameState.InRun:
                    Global.Alert("Dovevi essere piu veloce.. il gioco è già in corso.");
                    break;
                case GameState.Finished:
                    Global.Alert("Il gioco è concluso.. ");
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}