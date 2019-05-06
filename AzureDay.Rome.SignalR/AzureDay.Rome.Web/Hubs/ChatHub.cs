using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace AzureDay.Rome.Web.Hubs
{
    public class ChatHub : Hub
    {
        public void BroadcastMessage(string name, string message)
        {
            this.Clients.All.SendAsync("broadcastMessage", name, message);
        }

        public void Echo(string name, string message)
        {
            this.Clients.Client(this.Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
        }
        
        
        public override Task OnConnectedAsync()
        {
            this.Clients.All.SendAsync("broadcastMessage", "system", $"{this.Context.ConnectionId} joined the conversation");
            return base.OnConnectedAsync();
        }
    }
}