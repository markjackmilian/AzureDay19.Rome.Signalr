using System;

namespace AzureDay.Rome.Client.Hubs
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