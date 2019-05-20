using System;

namespace AzureDay.Rome.Client.Hubs
{
    public interface IBaseHub
    {
        void Start(Action onConnected = null);
        void Stop();
    }
}