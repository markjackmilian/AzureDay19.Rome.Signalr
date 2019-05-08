using System;
using AzureDay.Rome.Remote.Hubs;
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

        public void Tap()
        {
            this._gameHub.Register("Marco",Guid.NewGuid());
        }
    }
}