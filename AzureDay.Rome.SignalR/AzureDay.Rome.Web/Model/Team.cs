using System;
using System.Collections.Generic;
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
    }
}