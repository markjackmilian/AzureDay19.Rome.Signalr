using System;

namespace AzureDay.Rome.Client.Hubs
{
    public interface IMoveItHub : IBaseHub
    {
        event EventHandler<int> OnLeftChanged;
        event EventHandler<int> OnTopChanged;

        void SendTop(int top);
        void SendLeft(int left);
        
    }
}