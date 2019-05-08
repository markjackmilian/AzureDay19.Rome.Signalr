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
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            Global.Alert(e.ToString());
        }


        public override void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);
            
            this._gameHub.Start();
        }
        
        public void OpenRegistration()
        {
            this._gameHub.OpenRegistration();
        }
    }
}