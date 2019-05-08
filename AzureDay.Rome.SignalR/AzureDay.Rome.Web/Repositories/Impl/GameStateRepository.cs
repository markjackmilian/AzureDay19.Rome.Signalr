using System.Linq;
using AzureDay.Rome.Web.Model;
using LiteDB;

namespace AzureDay.Rome.Web.Repositories.Impl
{
    class GameStateRepository : IGameStateRepository
    {
        private readonly LiteCollection<Game> _gameRepo;

        public GameStateRepository(ILiteDbWrapper liteDbWrapper)
        {
            this._gameRepo = liteDbWrapper.Database.GetCollection<Game>(typeof(Game).Name);
        }
        
        public void OpenRegisterMode()
        {
            this.ChangeGameState(GameState.Register);
        }

        public void StartGameMode()
        {
            this.ChangeGameState(GameState.InRun);
        }

        public void StopGame()
        {
            this.ChangeGameState(GameState.Closed);
        }

        public GameState GetCurrentState()
        {
            var game = this.GetGame();
            return game.State;
        }


        private void ChangeGameState(GameState state)
        {
            var game = this.GetGame();
            game.State = state;
            this._gameRepo.Update(game);
        }

        private Game GetGame()
        {
            return this._gameRepo.FindAll().First();
        }
    }
}