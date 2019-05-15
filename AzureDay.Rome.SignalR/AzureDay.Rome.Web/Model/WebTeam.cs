using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Shared;
using Microsoft.AspNetCore.Identity;

namespace AzureDay.Rome.Web.Model
{
    public class WebTeam 
    {
        public WebTeam()
        {}
        
        public WebTeam(Guid guid)
        {
            this.Id = guid;
            this.Players = new List<WebPlayer>();
        }
        
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<WebPlayer> Players { get; set; }

        public int TeamScore => this.Players.Sum(s => s.ClickCount);

        public void RemovePlayerByConnectionId(string contextConnectionId)
        {
            var player = this.Players.SingleOrDefault(sd=>sd.ConnectionId == contextConnectionId);
            if (player == null)
                return;
            this.Players.Remove(player);
        }
    }
}