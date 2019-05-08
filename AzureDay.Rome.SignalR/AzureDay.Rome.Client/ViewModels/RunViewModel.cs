using System;
using System.Collections.Generic;
using Bridge.Html5;
using Bridge.Spaf.Hubs;
using Bridge.Spaf.Models;

namespace Bridge.Spaf.ViewModels
{
    public class RunViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        public override string ElementId() => SpafApp.RunId;

        public RunViewModel(IGameHub gameHub)
        {
            this._gameHub = gameHub;
            this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined += this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved += GameHubOnOnPlayerLeaved;
        }

        private void GameHubOnOnPlayerLeaved(object sender, Tuple<string, Guid> e)
        {
            Global.Alert($"Il giocatore {e.Item1} della squadra {e.Item2} ci ha lasciato prematuramente.");
        }

        private void GameHubOnOnNewPlayerJoined(object sender, Tuple<string, Guid> e)
        {
            Global.Alert($"Nuovo giocatore {e.Item1} della squadra {e.Item2}");
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            Global.Alert(e.ToString());
        }


        public override void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);
            
            this._gameHub.Start(()=> this._gameHub.NotifyIAmTheAdmin());
        }

        public override void OnLeave()
        {
            this._gameHub.OnGameStateReceived -= this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined -= this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved -= GameHubOnOnPlayerLeaved;
            base.OnLeave();
        }

        public void OpenRegistration()
        {
            this._gameHub.OpenRegistration();
        }
    }
}