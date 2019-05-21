using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace AzureDay.Rome.Web.Model
{
    public class WebTeam 
    {
        private object _lock = new object();

        public WebTeam()
        {}
        
        public WebTeam(Guid guid)
        {
            this.Id = guid;
            this.Players = new ConcurrentBag<WebPlayer>();
        }
        
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ConcurrentBag<WebPlayer> Players { get; set; }

        public int TeamScore => this.Players.Sum(s => s.ClickCount)* this.Weight;

        public void AddTestClick()
        {
            lock (_lock)
            {
                this.TestScore++;
            }
        }

        public void ClearTestScore()
        {
            this.TestScore = 0;
        }
        
        public int TestScore { get; private set; }
        public int Weight { get; set; }


        public void RemovePlayerByConnectionId(string contextConnectionId)
        {
            var player = this.Players.SingleOrDefault(sd=>sd.ConnectionId == contextConnectionId);
            if (player == null)
                return;
            this.Players.Remove(player);
        }
    }
}