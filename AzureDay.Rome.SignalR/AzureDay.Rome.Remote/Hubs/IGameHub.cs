using System;
using System.Threading.Tasks;
using AzureDay.Rome.Shared;

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
        /// Return after a register request
        /// </summary>
        event EventHandler<bool> OnRegisterResult;
        
        /// <summary>
        /// Receive the state of server game
        /// </summary>
        event EventHandler<GameState> OnGameStateReceived;
        
        /// <summary>
        /// When a team win
        /// </summary>
        event EventHandler OnYourTeamWins;
        
        /// <summary>
        /// raised when your team lost
        /// </summary>
        event EventHandler OnYourTeamLost;



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
        Task<bool> Register(string name, Guid team);
        

        #endregion
    }
}