using System;
using System.Threading.Tasks;
using AzureDay.Rome.Remote.Hubs.Impl;
using AzureDay.Rome.Remote.Models;

namespace AzureDay.Rome.Remote.Hubs
{
    public interface IGameHub : IBaseHub
    {
        #region EVENTS FROM SERVER
        
        
            
        /// <summary>
        /// Raised when a new player joined your team
        /// </summary>
        event EventHandler<Player> OnNewPlayerInYourTeamJoined;


        /// <summary>
        /// Raised when game start
        /// </summary>
        event EventHandler OnGameStart;
        
        /// <summary>
        /// Raised when game end
        /// </summary>
        event EventHandler<GameResult> OnGameEnd;
        
        /// <summary>
        /// Raised when game is in progress
        /// </summary>
        event EventHandler<int> OnGameProgressUpdate;

        /// <summary>
        /// Return after a register request
        /// </summary>
        event EventHandler OnRegisterDone;
        
        /// <summary>
        /// Receive the state of server game
        /// </summary>
        event EventHandler<GameState> OnGameStateReceived;

        #endregion
        
        
        #region COMMAND

        /// <summary>
        /// Send tap
        /// </summary>
        void Tap();
        
        #endregion

        #region AWAITABLE

        /// <summary>
        /// Check if the game mode is Register
        /// </summary>
        /// <returns></returns>
        Task<GameState> GetGameMode();

        /// <summary>
        /// Register to game
        /// </summary>
        /// <param name="name"></param>
        /// <param name="team">team number</param>
        Task Register(string name, Guid team);
        

        #endregion
    }
}