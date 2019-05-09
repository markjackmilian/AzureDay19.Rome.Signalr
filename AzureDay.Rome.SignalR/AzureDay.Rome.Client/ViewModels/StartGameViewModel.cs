using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Client.Hubs;
using AzureDay.Rome.Client.Models;
using AzureDay.Rome.Client.Repositories;
using Bridge.Html5;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Client.ViewModels
{
    public class StartGameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private readonly ITeamRepository _teamRepository;
        public override string ElementId() => SpafApp.StartGameId;
        
        public knockout.KnockoutObservableArray<Player> Players { get; set; }
        public knockout.KnockoutObservable<GameState> GameState { get; set; }
        public knockout.KnockoutObservable<int> Team1Score { get; set; }
        public knockout.KnockoutObservable<string> Team1ScreenPosition { get; set; }
        public knockout.KnockoutObservable<int> Team2Score { get; set; }
        public knockout.KnockoutObservable<string> Team2ScreenPosition { get; set; }
        public knockout.KnockoutObservable<int> Team3Score { get; set; }
        public knockout.KnockoutObservable<string> Team3ScreenPosition { get; set; }
        public knockout.KnockoutObservable<int> Team4Score { get; set; }
        public knockout.KnockoutObservable<string> Team4ScreenPosition { get; set; }



        public StartGameViewModel(IGameHub gameHub, ITeamRepository teamRepository)
        {
            this._gameHub = gameHub;
            this._teamRepository = teamRepository;
            

            this.Players = knockout.ko.observableArray.Self<Player>();
            this.GameState = knockout.ko.observable.Self<GameState>();
            
            this.Team1Score = knockout.ko.observable.Self<int>();
            this.Team2Score = knockout.ko.observable.Self<int>();
            this.Team3Score = knockout.ko.observable.Self<int>();
            this.Team4Score = knockout.ko.observable.Self<int>();
            
            this.Team1ScreenPosition = knockout.ko.observable.Self<string>();
            this.Team2ScreenPosition = knockout.ko.observable.Self<string>();
            this.Team3ScreenPosition = knockout.ko.observable.Self<string>();
            this.Team4ScreenPosition = knockout.ko.observable.Self<string>();


            this.Team1Score.subscribe(value => this.Team1ScreenPosition.Self($"{value}px"));
            this.Team2Score.subscribe(value => this.Team2ScreenPosition.Self($"{value}px"));
            this.Team3Score.subscribe(value => this.Team3ScreenPosition.Self($"{value}px"));
            this.Team4Score.subscribe(value => this.Team4ScreenPosition.Self($"{value}px"));
        }

        private void GameHubOnOnPlayerLeaved(object sender, Tuple<Player, Guid> tuple)
        {
            var localPlayer = this.Players.Self().SingleOrDefault(sd => sd.Id == tuple.Item1.Id);
            if (localPlayer == null) return;

            this.Players.remove(localPlayer);
            var team = this._teamRepository.GetTeamById(tuple.Item2);
            
            Global.Alert($"Il giocatore {tuple.Item1.Name} della squadra {team?.Name} ci ha lasciato prematuramente.");
        }

        private void GameHubOnOnNewPlayerJoined(object sender, Tuple<Player, Guid> tuple)
        {
            this.Players.push(tuple.Item1);
            var team = this._teamRepository.GetTeamById(tuple.Item2);

            Global.Alert($"Nuovo giocatore {tuple.Item1.Name} della squadra {team?.Name}");
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            Console.WriteLine(e.ToString());
            this.GameState.Self(e);
        }
        
        private void GameHubOnOnTapCountReceived(object sender, Tuple<int, Guid> e)
        {
            var team = this._teamRepository.GetTeamById(e.Item2);
            var actions = new Dictionary<int, Action>()
            {
                {1, () => this.Team1Score.Self(e.Item1)},
                {2, () => this.Team2Score.Self(e.Item1)},
                {3, () => this.Team3Score.Self(e.Item1)},
                {4, () => this.Team4Score.Self(e.Item1)},
            };
            
            actions[team.Order].Invoke();
        }

        public void StartGame()
        {
            this._gameHub.StartGame();
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);
            
            this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined += this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved += this.GameHubOnOnPlayerLeaved;
            this._gameHub.OnTapCountReceived += this.GameHubOnOnTapCountReceived;
            
            this._gameHub.Start(()=> this._gameHub.NotifyIAmTheAdmin());
        }

      

        public override void OnLeave()
        {
            this._gameHub.OnGameStateReceived -= this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined -= this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved -= this.GameHubOnOnPlayerLeaved;
            base.OnLeave();
        }

        public void OpenRegistration()
        {
            this._gameHub.OpenRegistration();
        }
    }
}