using System.Collections.Generic;
using System.Threading.Tasks;
using ASP.NETCoreWebApplication.Client.Hubs.Impl;
using Microsoft.AspNetCore.Blazor.Components;

namespace ASP.NETCoreWebApplication.Client.Components
{
    public class ChatComponent : BlazorComponent
    {
        private ChatHub _service;

        public ChatComponent()
        {
            this._service = new ChatHub();
            this.Messages = new List<string>();
            this._service.OnMessagereceived += (sender, tuple) =>
            {
                this.Messages.Add(tuple.Item2);
                this.StateHasChanged();
            };
        }
        
        public List<string> Messages { get; set; }

        public string Message { get; set; }


        public async void SendMessage()
        {
            await this._service.Send(this.Message);
//            this.Messages.Add(this.Message);
            this.Message = string.Empty;
            this.StateHasChanged();
        }


        protected override async Task OnInitAsync()
        {
            await this._service.Start();
            await base.OnInitAsync();
        }
        
        
    }
}