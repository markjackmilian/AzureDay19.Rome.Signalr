using System;
using System.Threading.Tasks;
using IPromise = Bridge.AspNetCore.SignalR.Client.Threading.IPromise;

namespace Bridge.Spaf.Hubs
{
    public interface IChatHub : IBaseHub
    {
        /// <summary>
        /// Raised when a message is received
        /// </summary>
        event EventHandler<Tuple<string, string>> OnMessagereceived;
        
        
        
        
        /// <summary>
        /// Send broadcast message
        /// </summary>
        /// <param name="message"></param>
        void Send(string message);
    }
}