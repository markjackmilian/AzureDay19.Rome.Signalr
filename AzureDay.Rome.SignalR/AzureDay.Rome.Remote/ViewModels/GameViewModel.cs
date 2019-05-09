using System;
using System.Collections.Generic;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Remote.Models;
using Bridge.Html5;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class GameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        public override string ElementId() => SpafApp.GameId;
        
        public knockout.KnockoutObservable<GameState> Game { get; set; }


        public GameViewModel(IGameHub gameHub)
        {
            this._gameHub = gameHub;
            this.Game = knockout.ko.observable.Self<GameState>();
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            this.Game.Self(e);
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

            await this._gameHub.GetGameMode();
            base.OnLoad(parameters);
        }


        public override void OnLeave()
        {
            this._gameHub.OnGameStateReceived -= GameHubOnOnGameStateReceived;
            base.OnLeave();
        }

        public void Tap()
        {
            this._gameHub.Tap();
        }
    }
}