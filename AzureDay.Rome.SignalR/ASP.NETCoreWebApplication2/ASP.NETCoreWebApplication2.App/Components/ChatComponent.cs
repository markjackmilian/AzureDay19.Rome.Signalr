using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ASP.NETCoreWebApplication1.App.Hubs;
using Microsoft.AspNetCore.Blazor.Components;

namespace ASP.NETCoreWebApplication2.App.Components
{
    public class ChatComponent : BlazorComponent, IDisposable
    {
        //[Inject] protected IChatHub ChatHub { get; set; }
        
        public List<string> Messages { get; set; }

        public string Message { get; set; }

        public ChatComponent()
        {
            this.Messages = new List<string>();
            
        }

        public async void SendMessage()
        {
//            await this.ChatHub.Send(this.Message);
            this.Message = string.Empty;
            this.StateHasChanged();
        }
        

        protected override async Task OnInitAsync()
        {
//            this.ChatHub.OnMessagereceived += this.OnChatHubOnOnMessagereceived;
            
//            await this.ChatHub.Start();
            await base.OnInitAsync();
        }
       
        public async void Dispose()
        {
            Console.WriteLine("Disposato");
//            await this.ChatHub.Stop();
//            this.ChatHub.OnMessagereceived -= this.OnChatHubOnOnMessagereceived;

        }
        
        private void OnChatHubOnOnMessagereceived(object sender, Tuple<string, string> tuple)
        {
            this.Messages.Add(tuple.Item2);
            this.StateHasChanged();
        }
    }
}