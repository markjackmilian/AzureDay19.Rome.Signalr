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


        public StartGameViewModel(IGameHub gameHub, ITeamRepository teamRepository)
        {
            this._gameHub = gameHub;
            this._teamRepository = teamRepository;
            

            this.Players = knockout.ko.observableArray.Self<Player>();
            this.GameState = knockout.ko.observable.Self<GameState>();
            this.Team1Score = knockout.ko.observable.Self<int>();
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
            this.Team1Score.Self(e.Item1);
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
            this._gameHub.OnTapCountReceived += GameHubOnOnTapCountReceived;
            
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