using System;

namespace Bridge.Spaf.Hubs
{
    public interface IBaseHub
    {
        void Start(Action onConnected = null);
        void Stop();
    }
}