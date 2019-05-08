using System;

namespace AzureDay.Rome.Web.Model
{
    public class Game
    {
        public Game()
        {
            this.Id = Guid.NewGuid();
            this.State = GameState.Closed;
        }
        
        public Guid Id { get; set; }
        public GameState State { get; set; }
    }
}