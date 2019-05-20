using System;
using System.Reflection;
using System.Threading.Tasks;

namespace AzureDay.Rome.Remote.Classes
{
    internal class WaitForMe<T, TK>
    {
        private readonly TaskCompletionSource<TK> _complete = new TaskCompletionSource<TK>();

        private EventInfo _eventInfo;
        private T _obj;
        private Delegate _handler;


        public Task<TK> Task => this._complete.Task;

        public WaitForMe(T obj, string eventNAme)
        {
            this.Subscribe(obj, eventNAme);
        }

        public WaitForMe(T obj, Func<T, string> eventname)
        {
            this.Subscribe(obj, eventname.Invoke(obj));
        }

        private void Subscribe(T obj, string eventName)
        {
            this._obj = obj;
            this._eventInfo = typeof(T).GetEvent(eventName);
            if (this._eventInfo == null)
                throw new NullReferenceException($"Event with name {eventName} not found on object of type {typeof(T)}");
            var methodInfo = this.GetType().GetMethod(nameof(this.OnComplete), BindingFlags.NonPublic | BindingFlags.Instance);

            if (methodInfo == null)
                throw new ArgumentNullException("methodinfo");

            this._handler = Delegate.CreateDelegate(typeof(TK), this, methodInfo);
            this._eventInfo.AddEventHandler(obj, this._handler);
        }

        private void OnComplete(object sender, TK handler)
        {
            this._eventInfo.RemoveEventHandler(this._obj, this._handler);
            this._complete.TrySetResult(handler);
        }
    }
}