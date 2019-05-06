using Retyped;

namespace Bridge.Spaf.ViewModels
{
    public class MoveItViewModel : LoadableViewModel
    {
        public override string ElementId() => SpafApp.MoveItId;

        private int _top = 0;
        private int _left = 0;
        
        public knockout.KnockoutObservable<string> Top { get; set; }
        public knockout.KnockoutObservable<string> Left { get; set; }

        public MoveItViewModel()
        {
            this.Top = knockout.ko.observable.Self<string>($"{this._top}px");
            this.Left = knockout.ko.observable.Self<string>($"{this._left}px");
        }


        public void AddTen()
        {
            this._top+=10;
            this.Top.Self($"{this._top}px");
        }

        public void AddTenLeft()
        {
            this._left+=10;
            this.Left.Self($"{this._left}px");
        }
        
    }
}