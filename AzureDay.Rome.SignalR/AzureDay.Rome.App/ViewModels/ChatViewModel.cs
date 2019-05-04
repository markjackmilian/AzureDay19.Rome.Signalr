using System;
using System.Collections.Generic;
using Bridge.AspNetCore.SignalR.Client;
using Bridge.Html5;
using Retyped;

namespace Bridge.Spaf.ViewModels
{
    public class ChatViewModel : LoadableViewModel
    {
        public override string ElementId() => SpafApp.HomeId;
        
        public knockout.KnockoutObservable<string> Message { get; set; }


        public override void OnLoad(Dictionary<string, object> parameters)
        {
            Console.WriteLine("Ciao!");

//            this.Message = knockout.ko.observable.Self<string>();
//            
//            var hubConnection = new HubConnection("/test");
//            
//            
//
//            // Setup on data received event handler
//            hubConnection.On("Send", new Action<string>((data) =>
//            {
//                // Log the received data to the console
//                Console.WriteLine(data);
//            }));
//
//            // Setup on connection close handler
//            hubConnection.OnClose((error) => 
//            {
//                // Log the error
//                Console.WriteLine(error.Message);
//            });
//
//            // Start the connection
//            hubConnection.Start().Then(
//                onfulfilled: () =>
//                {
//                    // Send a message
//                    hubConnection.Invoke("send", "Hello");
//                }, 
//                onrejected: null);
//
//            // Stop the connection
//            hubConnection.Stop();
//            
            
            base.OnLoad(parameters);
        }

        public void Send()
        {
            Global.Alert(this.Message.Self());
        }
    }
}