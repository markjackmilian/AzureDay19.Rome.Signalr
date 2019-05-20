using System;
using AzureDay.Rome.Shared;
using Retyped;

namespace AzureDay.Rome.Client.ViewModels.Models
{
    public class TeamViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CssClass { get; set; }
        public knockout.KnockoutObservable<double> Score { get; set; }
        public knockout.KnockoutObservable<int> HowMany { get; set; }
        
        public knockout.KnockoutObservable<string> ScreenPosition { get; set; }
        public knockout.KnockoutObservableArray<Player> Players { get; set; }
        public knockout.KnockoutObservable<bool> IsWinner { get; set; }

        public TeamViewModel(Team team)
        {
            this.Id = team.Id;
            this.Name = team.Name;
            this.CssClass = this.Name.Replace(" ", "_");
            
            this.Score = knockout.ko.observable.Self<double>();
            this.HowMany = knockout.ko.observable.Self<int>();
            this.ScreenPosition = knockout.ko.observable.Self<string>();
            this.IsWinner = knockout.ko.observable.Self<bool>();
            this.Players = knockout.ko.observableArray.Self<Player>();

            this.Score.subscribe(value => this.ScreenPosition.Self($"{value}px"));
            this.Players.subscribe(value => this.HowMany.Self(this.Players.Self().Length));
        }
    }
}