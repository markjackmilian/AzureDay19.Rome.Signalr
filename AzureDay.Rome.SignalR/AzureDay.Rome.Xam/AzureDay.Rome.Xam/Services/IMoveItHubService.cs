using System;
using System.Threading.Tasks;

namespace AzureDay.Rome.Xam.Services
{
    public interface IMoveItHubService
    {
        /// <summary>
        /// Raised whe left value changed
        /// </summary>
        event EventHandler<int> OnLeftChanged;
        
        /// <summary>
        /// Raised when top value changed
        /// </summary>
        event EventHandler<int> OnTopChanged;

        /// <summary>
        /// Send Top new value
        /// </summary>
        /// <param name="top"></param>
        Task SendTop(int top);

        /// <summary>
        /// Send Left new value
        /// </summary>
        /// <param name="left"></param>
        Task SendLeft(int left);

        /// <summary>
        /// Connect to hub
        /// </summary>
        Task Connect();
        
        /// <summary>
        /// Stop connection to hub
        /// </summary>
        Task Stop();

    }
}