using System;

namespace Bridge.Spaf.Hubs
{
    public interface IMoveItHub : IBaseHub
    {
        event EventHandler<int> OnLeftChanged;
        event EventHandler<int> OnTopChanged;

        void SendTop(int top);
        void SendLeft(int left);
        
    }
}