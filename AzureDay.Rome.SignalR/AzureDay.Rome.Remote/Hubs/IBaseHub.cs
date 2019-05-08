using System;

namespace AzureDay.Rome.Remote.Hubs
{
    public interface IBaseHub
    {
        void Start(Action onStarted);
        void Stop();
    }
}