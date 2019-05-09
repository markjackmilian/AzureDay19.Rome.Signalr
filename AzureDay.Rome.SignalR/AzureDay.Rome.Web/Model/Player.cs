using System;
using Remotion.Linq.Clauses.ResultOperators;

namespace AzureDay.Rome.Web.Model
{
    public class Player
    {
        public Player()
        {
            this.Id = Guid.NewGuid();
        }
        
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }

        public int ClickCount { get; set; }
    }
}