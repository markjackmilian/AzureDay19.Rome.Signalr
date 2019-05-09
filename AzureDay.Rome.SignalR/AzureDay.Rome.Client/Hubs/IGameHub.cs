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
        /// Raised when new player join the game
        /// </summary>
        event EventHandler<Tuple<Player,Guid>> OnNewPlayerJoined;
        
        /// <summary>
        /// Raised when a player leave
        /// </summary>
        event EventHandler<Tuple<Player,Guid>> OnPlayerLeaved;



        /// <summary>
        /// Send change state
        /// </summary>
        /// <param name="state"></param>
        void StartGame();
        
        /// <summary>
        /// Set the game as open for registration
        /// </summary>
        void OpenRegistration();

        /// <summary>
        /// Notify my connection
        /// </summary>
        void NotifyIAmTheAdmin();
    }
}