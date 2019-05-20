using System;
using AzureDay.Rome.Shared;

namespace AzureDay.Rome.Client.Hubs
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
        /// Raised when tap count arrived
        /// </summary>
        event EventHandler<Tuple<int,Guid>> OnTapCountReceived;

        /// <summary>
        /// Raised when someone could not registered
        /// </summary>
        event EventHandler OnTooManyPlayers;
        

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

        /// <summary>
        /// Send restart game signal
        /// </summary>
        void ReStartGame();

        /// <summary>
        /// Force stop game
        /// </summary>
        void StopGame();
    }
}