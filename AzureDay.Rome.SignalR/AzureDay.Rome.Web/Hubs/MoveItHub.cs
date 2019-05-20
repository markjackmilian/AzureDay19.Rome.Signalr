using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;

namespace AzureDay.Rome.Web.Hubs
{
    public class MoveItHub : Hub
    {
        public void SendTop(int top)
        {
            this.Clients.All.SendAsync("updateTop", top);
        }
        
        public void SendLeft(int left)
        {
            this.Clients.All.SendAsync("updateLeft", left);
        }
        
        public override Task OnConnectedAsync()
        {
            var connectionInfo =  this.Context;
            return base.OnConnectedAsync();
        }
    }
}