using System;
using System.Collections.Generic;
using AzureDay.Rome.Remote.Classes;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Remote.Models;
using AzureDay.Rome.Shared;
using Bridge.Html5;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class GameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private Guid _teamId;
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
            Notification.Success("Il gioco è iniziato!");
        }


        public override async void OnLoad(Dictionary<string, object> parameters)
        {
            this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
            this._gameHub.OnYourTeamWins += this.GameHubOnOnNotifyWinner;
            this._gameHub.OnYourTeamLost += GameHubOnOnYourTeamLost;

            this._teamId = SpafApp.TeamId;

            await this._gameHub.GetGameMode();
            base.OnLoad(parameters);
        }

        private void GameHubOnOnYourTeamLost(object sender, EventArgs e)
        {
            Global.Alert("Hai perso!");
        }

        private void GameHubOnOnNotifyWinner(object sender, EventArgs e)
        {
            Global.Alert("Hai vinto!");
        }


        public override void OnLeave()
        {
            this._gameHub.OnGameStateReceived -= this.GameHubOnOnGameStateReceived;
            this._gameHub.OnYourTeamWins -= this.GameHubOnOnNotifyWinner;
            this._gameHub.OnYourTeamLost -= GameHubOnOnYourTeamLost;


            base.OnLeave();
        }

        public void Tap()
        {
            this._gameHub.Tap();
        }
    }
}