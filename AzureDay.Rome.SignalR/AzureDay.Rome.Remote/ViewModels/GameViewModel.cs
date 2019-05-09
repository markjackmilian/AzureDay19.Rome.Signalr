using System;
using System.Collections.Generic;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Remote.Models;
using Bridge.Html5;
using Bridge.Spaf;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class GameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        public override string ElementId() => SpafApp.GameId;

        public GameViewModel(IGameHub gameHub)
        {
            this._gameHub = gameHub;
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            if (e == GameState.InRun)
                this.SwitchToRunMode();
        }

        private void SwitchToRunMode()
        {
            Global.Alert("start the game!");
        }


        public override async void OnLoad(Dictionary<string, object> parameters)
        {
            this._gameHub.OnGameStateReceived += GameHubOnOnGameStateReceived;

            var gameMode = await this._gameHub.GetGameMode();
            base.OnLoad(parameters);
        }


        public override void OnLeave()
        {
            this._gameHub.OnGameStateReceived -= GameHubOnOnGameStateReceived;
            base.OnLeave();
        }

        public void Tap()
        {
            this._gameHub.Register("Marco",Guid.NewGuid());
        }
    }
}