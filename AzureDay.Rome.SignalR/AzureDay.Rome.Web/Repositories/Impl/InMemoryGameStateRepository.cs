using AzureDay.Rome.Web.Model;

namespace AzureDay.Rome.Web.Repositories.Impl
{
    class InMemoryGameStateRepository : IGameStateRepository
    {
        private Game _game = new Game();
        
        public void OpenRegisterMode()
        {
            this._game.State = GameState.Register;
        }

        public void StartGameMode()
        {
            this._game.State = GameState.InRun;
        }

        public void StopGame()
        {
            this._game.State = GameState.Closed;
        }

        public GameState GetCurrentState()
        {
            return this._game.State;
        }
    }
}