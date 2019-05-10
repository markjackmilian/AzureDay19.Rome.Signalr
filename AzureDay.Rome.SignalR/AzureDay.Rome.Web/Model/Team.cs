using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace AzureDay.Rome.Web.Model
{
    public class Team
    {
        public Team()
        {}
        
        public Team(Guid guid)
        {
            this.Id = guid;
            this.Players = new List<Player>();
        }
        
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<Player> Players { get; set; }

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