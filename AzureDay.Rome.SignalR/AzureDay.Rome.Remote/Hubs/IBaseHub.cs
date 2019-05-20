using System;
using Bridge.AspNetCore.SignalR.Client;

namespace AzureDay.Rome.Remote.Hubs
{
    public interface IBaseHub
    {
        /// <summary>
        /// Raised when connection is lost
        /// </summary>
        event EventHandler OnConnectionLost;
        
        /// <summary>
        /// Hub
        /// </summary>
        HubConnection Connection { get; }

        void Start(Action onStarted);
        void Stop();
    }
}