using System;
using AzureDay.Rome.Shared;
using Remotion.Linq.Clauses.ResultOperators;

namespace AzureDay.Rome.Web.Model
{
    public class WebPlayer : Player
    {
        private readonly object _lock = new object();

        public WebPlayer()
        {
            this.Id = Guid.NewGuid();
        }

        public void AddClick()
        {
            lock (this._lock)
            {
                this.ClickCount++;
            }
        }
        
        public int ClickCount { get; private set; }
    }
}