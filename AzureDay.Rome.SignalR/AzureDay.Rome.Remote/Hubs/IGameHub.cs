namespace AzureDay.Rome.Remote.Hubs
{
    public interface IGameHub : IBaseHub
    {
        #region COMMAND

        /// <summary>
        /// Send tap
        /// </summary>
        void Tap();

        /// <summary>
        /// Register to game
        /// </summary>
        /// <param name="name"></param>
        /// <param name="team">team number</param>
        void Register(string name, int team);
        
        
        #endregion
    }
}