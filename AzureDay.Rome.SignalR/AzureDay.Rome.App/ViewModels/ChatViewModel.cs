using System;
using System.Collections.Generic;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;
using Bridge.Spaf.Hubs;
using Retyped;

namespace Bridge.Spaf.ViewModels
{
    public class ChatViewModel : LoadableViewModel
    {
        private readonly IChatHub _chatHub;
        public override string ElementId() => SpafApp.HomeId;
        
        public knockout.KnockoutObservable<string> Message { get; set; }


        public ChatViewModel(IChatHub chatHub)
        {
            this._chatHub = chatHub;
            this._chatHub.OnMessagereceived += ChatHubOnOnMessagereceived;
        }

        private void ChatHubOnOnMessagereceived(object sender, Tuple<string, string> e)
        {
            Global.Alert(e.Item1);
        }

        public override void OnLoad(Dictionary<string, object> parameters)
        {
            this._chatHub.Start();
            base.OnLoad(parameters);
        }

        public override void OnLeave()
        {
            this._chatHub.Stop();
            base.OnLeave();
        }

        public void Send()
        {
            Global.Alert(this.Message.Self());
        }
    }
}