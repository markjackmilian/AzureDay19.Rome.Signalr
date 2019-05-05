using System;
using System.Threading.Tasks;
using IPromise = Bridge.AspNetCore.SignalR.Client.Threading.IPromise;

namespace Bridge.Spaf.Hubs
{
    public interface IChatHub
    {
        event EventHandler<Tuple<string,string>> OnMessagereceived;
        void Send(string message);

        void Start();
        void Stop();
    }
}