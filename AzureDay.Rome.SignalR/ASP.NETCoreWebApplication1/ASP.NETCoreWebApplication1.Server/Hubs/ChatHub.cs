using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ASP.NETCoreWebApplication1.Server.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            this.Clients.All.SendAsync("broadcastMessage", "system", $"{this.Context.ConnectionId} joined the conversation");
            return base.OnConnectedAsync();
        }
        public void Send(string name, string message)
        {
            this.Clients.All.SendAsync("broadcastMessage", name, message);
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            this.Clients.All.SendAsync("broadcastMessage", "system", $"{this.Context.ConnectionId} left the conversation");
            return base.OnDisconnectedAsync(exception);
        }
    }
}