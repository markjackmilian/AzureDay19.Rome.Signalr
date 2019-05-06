using System.Collections.Generic;
using Bridge.Spaf.Hubs;
using Retyped;

namespace Bridge.Spaf.ViewModels
{
    public class MoveItViewModel : LoadableViewModel
    {
        private readonly IMoveItHub _moveItHub;
        public override string ElementId() => SpafApp.MoveItId;

        private int _top = 0;
        private int _left = 0;
        
        public knockout.KnockoutObservable<string> Top { get; set; }
        public knockout.KnockoutObservable<string> Left { get; set; }

        public MoveItViewModel(IMoveItHub moveItHub)
        {
            this._moveItHub = moveItHub;
            this.Top = knockout.ko.observable.Self<string>($"{this._top}px");
            this.Left = knockout.ko.observable.Self<string>($"{this._left}px");
            
            this._moveItHub.OnLeftChanged += this.MoveItHubOnOnLeftChanged;
            this._moveItHub.OnTopChanged += this.MoveItHubOnOnTopChanged;
        }

        private void MoveItHubOnOnTopChanged(object sender, int e)
        {
            this._top = e;
            this.Top.Self($"{e}px");
        }

        private void MoveItHubOnOnLeftChanged(object sender, int e)
        {
            this._left = e;
            this.Left.Self($"{e}px");
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            this._moveItHub.Start();
            base.OnLoad(parameters);
        }

        public override void OnLeave()
        {
            this._moveItHub.Stop();
            base.OnLeave();
        }

        public void AddTen()
        {
            this._top+=10;
            this._moveItHub.SendTop(this._top);
        }

        public void AddTenLeft()
        {
            this._left+=10;
            this._moveItHub.SendLeft(this._left);
        }

        
    }
}