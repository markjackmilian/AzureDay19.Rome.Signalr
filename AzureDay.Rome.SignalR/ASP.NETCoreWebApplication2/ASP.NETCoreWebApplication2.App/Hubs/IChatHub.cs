using System;
using System.Threading.Tasks;

namespace ASP.NETCoreWebApplication1.App.Hubs
{
    public interface IChatHub
    {
        event EventHandler<Tuple<string,string>> OnMessagereceived;
        Task Send(string message);

        Task Start();
        Task Stop();
    }
}