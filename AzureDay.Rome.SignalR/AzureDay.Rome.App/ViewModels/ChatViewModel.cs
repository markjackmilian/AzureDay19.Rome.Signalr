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

//            this.Message = knockout.ko.observable.Self<string>();
//            
//            var hubConnection = new HubConnectionBuilder().WithUrl("/chat").Build();
//
//            // Setup on data received event handler
//            hubConnection.On("Send", new Action<string>((data) =>
//            {
//                // Log the received data to the console
//                Console.WriteLine(data);
//            }));
            
            
//            connection.start()
//                .then(function () {
//                onConnected(connection);
//            })
//            .catch(function (error) {
//                console.error(error.message);
//            });

            // Setup on connection close handler
//            hubConnection.OnClose((error) => 
//            {
//                // Log the error
//                Console.WriteLine(error.Message);
//            });

//            // Start the connection
//            hubConnection.Start().Then(() =>
//            {
//                Console.WriteLine("yeahhhh");
//            }, o =>
//                {
//                    Console.WriteLine("rejected");
//                }
////                onfulfilled: () =>
////                {
////                    // Send a message
////                    hubConnection.Invoke("send", "Hello");
////                }, 
////                onrejected: null
//                    
//                    ).Catch(o =>
//            {
//                Console.WriteLine("noooo");
//                Console.WriteLine(o);
//            });

            // Stop the connection
            //hubConnection.Stop();
            
            
            base.OnLoad(parameters);
        }

        public void Send()
        {
            Global.Alert(this.Message.Self());
        }
    }
}