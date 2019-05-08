using AzureDay.Rome.Remote.Hubs;

namespace Bridge.Spaf.ViewModels
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
            this._gameHub.Register("Marco",1);
        }
    }
}