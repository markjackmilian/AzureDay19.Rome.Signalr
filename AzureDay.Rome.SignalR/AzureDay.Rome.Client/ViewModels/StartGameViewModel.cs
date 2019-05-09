using System;
using System.Collections.Generic;
using System.Linq;
using Bridge.Html5;
using Bridge.Spaf.Hubs;
using Bridge.Spaf.Models;
using Bridge.Spaf.Repositories;
using Retyped;

namespace Bridge.Spaf.ViewModels
{
    public class StartGameViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        private readonly ITeamRepository _teamRepository;
        public override string ElementId() => SpafApp.StartGameId;
        
        public knockout.KnockoutObservableArray<Player> Players { get; set; }


        public StartGameViewModel(IGameHub gameHub, ITeamRepository teamRepository)
        {
            this._gameHub = gameHub;
            this._teamRepository = teamRepository;
            this._gameHub.OnGameStateReceived += this.GameHubOnOnGameStateReceived;
            this._gameHub.OnNewPlayerJoined += this.GameHubOnOnNewPlayerJoined;
            this._gameHub.OnPlayerLeaved += GameHubOnOnPlayerLeaved;

            this.Players = knockout.ko.observableArray.Self<Player>();
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
            Global.Alert(e.ToString());
        }

        public void StartGame()
        {
            this._gameHub.StartGame();
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