using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Client.Classes;
using AzureDay.Rome.Client.Hubs;
using AzureDay.Rome.Client.Repositories;
using AzureDay.Rome.Shared;
using Bridge;
using Bridge.Html5;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Client.ViewModels
{
    public class StartGameViewModel : LoadableViewModel
    {
        private const int FinishLineCount = 20;

        private const int FinishLineOffset = 170;
        private const int SpaceShipWidth = 178;
        
        private readonly IGameHub _gameHub;
        private readonly ITeamRepository _teamRepository;
        private int _tapCount;
        public override string ElementId() => SpafApp.StartGameId;

        public knockout.KnockoutObservable<GameState> State { get; set; }

        public knockout.KnockoutObservableArray<TeamViewModel> TeamViewModels { get; set; }

        public StartGameViewModel(IGameHub gameHub, ITeamRepository teamRepository)
        {
            this._gameHub = gameHub;
            this._teamRepository = teamRepository;
            
            var sbrazzi = this._teamRepository.GetTeams().Select(s => new TeamViewModel(s)).ToArray();

            this.TeamViewModels = knockout.ko.observableArray.Self<TeamViewModel>();
                
            this.TeamViewModels.push(sbrazzi);

            
            
            this.State = knockout.ko.observable.Self<GameState>();
        }

        private void GameHubOnOnPlayerLeaved(object sender, Tuple<Player, Guid> tuple)
        {
            var localPlayer = this.ALlPlayers.SingleOrDefault(sd => sd.Id == tuple.Item1.Id);
            if (localPlayer == null) return;

            var team = this._teamRepository.GetTeamById(tuple.Item2);
            
            Notification.Warning($"Il giocatore {tuple.Item1.Name} della squadra {team?.Name} ci ha lasciato prematuramente.");
        }

        private void GameHubOnOnNewPlayerJoined(object sender, Tuple<Player, Guid> tuple)
        {
            var team = this.GetTeamById(tuple.Item2);
            team.Players.push(tuple.Item1);
            
            Notification.Success($"Nuovo giocatore {tuple.Item1.Name} della squadra {team?.Name}");
        }

        private void GameHubOnOnGameStateReceived(object sender, GameState e)
        {
            this.State.Self(e);

            if (e != GameState.InRun) return;
            var width = Global.Document.GetElementById("gameDiv").OffsetWidth-FinishLineOffset-SpaceShipWidth;
            this._tapCount = width / FinishLineCount;
            Console.WriteLine($"Width: {width}");
            Console.WriteLine($"TapCount: {this._tapCount}");
        }


        private void GameHubOnOnTapCountReceived(object sender, Tuple<int, Guid> e)
        {
            var team = this.GetTeamById(e.Item2);
            team.Score.Self(e.Item1*this._tapCount);

            this.TeamViewModels.Self().ForEach(f => f.IsWinner.Self(false));
            this.TeamViewModels.Self().OrderByDescending(o => o.Score.Self()).First().IsWinner.Self(true);
        }

        public void StartGame()
        {
            this._gameHub.StartGame();
        }
        
        public void ReStartGame()
        {
            this._gameHub.ReStartGame();
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);

            this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined += this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved += this.GameHubOnOnPlayerLeaved;
            this._gameHub.OnTapCountReceived += this.GameHubOnOnTapCountReceived;

            this._gameHub.Start(() => this._gameHub.NotifyIAmTheAdmin());
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
        
        private TeamViewModel GetTeamById(Guid id) => this.TeamViewModels.Self().Single(s => s.Id.ToString().Equals(id.ToString()));

        private IEnumerable<Player> ALlPlayers => this.TeamViewModels.Self().SelectMany(sm=>sm.Players.Self());
    }

    public class TeamViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CssClass { get; set; }
        public knockout.KnockoutObservable<int> Score { get; set; }
        public knockout.KnockoutObservable<int> HowMany { get; set; }
        
        public knockout.KnockoutObservable<string> ScreenPosition { get; set; }
        public knockout.KnockoutObservableArray<Player> Players { get; set; }
        public knockout.KnockoutObservable<bool> IsWinner { get; set; }

        public TeamViewModel(Team team)
        {
            this.Id = team.Id;
            this.Name = team.Name;
            this.CssClass = this.Name.Replace(" ", "_");
            
            this.Score = knockout.ko.observable.Self<int>();
            this.HowMany = knockout.ko.observable.Self<int>();
            this.ScreenPosition = knockout.ko.observable.Self<string>();
            this.IsWinner = knockout.ko.observable.Self<bool>();
            this.Players = knockout.ko.observableArray.Self<Player>();

            this.Score.subscribe(value => this.ScreenPosition.Self($"{value}px"));
            this.Players.subscribe(value => this.HowMany.Self(this.Players.Self().Length));
        }
    }
}