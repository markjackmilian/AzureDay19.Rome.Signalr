using System.Collections.Generic;
using AzureDay.Rome.Remote.Hubs;
using Bridge.Html5;
using Bridge.Spaf;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class WaitingViewModel : LoadableViewModel
    {
        private readonly IGameHub _gameHub;
        public override string ElementId() => SpafApp.WaitingId;

        public WaitingViewModel(IGameHub gameHub)
        {
            this._gameHub = gameHub;
        }


        public override async void OnLoad(Dictionary<string, object> parameters)
        {
            base.OnLoad(parameters);

            var mode = await this._gameHub.GetGameMode();
            Global.Alert(mode.ToString());

        }
    }
}