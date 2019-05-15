using System;
using AzureDay.Rome.Shared;
using Remotion.Linq.Clauses.ResultOperators;

namespace AzureDay.Rome.Web.Model
{
    public class WebPlayer : Player
    {
        public WebPlayer()
        {
            this.Id = Guid.NewGuid();
        }
        
        public int ClickCount { get; set; }
    }
}