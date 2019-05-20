using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Remote.Classes;
using AzureDay.Rome.Remote.DataSources;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Shared;
using Bridge.Html5;
using Bridge.Navigation;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class GameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private readonly INavigator _navigator;
        private readonly ITeamsDataSource _teamsDataSource;
        private Guid _teamId;
        public override string ElementId() => SpafApp.GameId;
        
        public knockout.KnockoutObservable<GameState> Game { get; set; }

        public string TeamName { get; private set; }


        public GameViewModel(IGameHub gameHub, INavigator navigator, ITeamsDataSource teamsDataSource)
        {
            this._gameHub = gameHub;
            this._navigator = navigator;
            this._teamsDataSource = teamsDataSource;
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

            this._teamId = Guid.Parse(SpafApp.TeamId);
            var team = this._teamsDataSource.GetTeams().Single(s => s.Id == this._teamId);
            this.TeamName = team.Name;

            await this._gameHub.GetGameMode();
            base.OnLoad(parameters);
        }


        private void GameHubOnOnYourTeamLost(object sender, EventArgs e)
        {
            this._navigator.Navigate(SpafApp.GameResultId, new Dictionary<string, object>()
            {
                {"result",0}
            });
        }

        private void GameHubOnOnNotifyWinner(object sender, EventArgs e)
        {
            this._navigator.Navigate(SpafApp.GameResultId, new Dictionary<string, object>()
            {
                {"result",1}
            });
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