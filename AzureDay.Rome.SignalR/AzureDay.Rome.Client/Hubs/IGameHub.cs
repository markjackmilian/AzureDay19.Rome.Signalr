using System;
using Bridge.Spaf.Models;

namespace Bridge.Spaf.Hubs
{
    public interface IGameHub : IBaseHub
    {
        /// <summary>
        /// Receive the state of server game
        /// </summary>
        event EventHandler<GameState> OnGameStateReceived;
        
        /// <summary>
        /// Set the game as open for registration
        /// </summary>
        void OpenRegistration();
    }
}