using System;
using System.Threading.Tasks;

namespace ASP.NETCoreWebApplication.Client.Hubs
{
    public interface IChatHub
    {
        event EventHandler<Tuple<string,string>> OnMessagereceived;
        Task Send(string message);

        Task Start();
        Task Stop();
    }
}