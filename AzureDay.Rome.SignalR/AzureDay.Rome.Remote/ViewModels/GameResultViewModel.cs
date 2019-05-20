using System.Collections.Generic;
using AzureDay.Rome.Remote.Classes;
using Bridge.Navigation;
using Bridge.Spaf;
using Retyped;

namespace AzureDay.Rome.Remote.ViewModels
{
    public class GameResultViewModel : LoadableViewModel
    {
        public override string ElementId() => SpafApp.GameResultId;
        
        public knockout.KnockoutObservable<bool> Winner { get; set; }


        public GameResultViewModel()
        {
            this.Winner = knockout.ko.observable.Self<bool>(false);
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            var isWinner = parameters.GetParameter<int>("result");
            this.Winner.Self(isWinner == 1);
            
            if(isWinner == 1)
                Notification.Success("Hai Vinto!");
            else
                Notification.Error("Oh no... hai perso!");

            
            base.OnLoad(parameters);
        }
    }
}