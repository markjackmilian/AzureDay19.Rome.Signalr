using System;
using AzureDay.Rome.Web.Model;
using LiteDB;
using Microsoft.AspNetCore.Identity;

namespace AzureDay.Rome.Web
{
    public interface ILiteDbWrapper
    {
        LiteDatabase Database { get; }
    }

    public class LiteDbWrapper : IDisposable, ILiteDbWrapper
    {
        public LiteDatabase Database { get; }

        public LiteDbWrapper()
        {
            this.Database = new LiteDatabase("filename=../LiteDb/game.db; mode=Exclusive");
        }

        public void EnsureDb()
        {
            // game
            var gameRepo = this.Database.GetCollection<Game>(typeof(Game).Name);
            if (gameRepo.Count() != 0)
                return;

            gameRepo.Insert(new Game());

            // teams
            this.CreateTeams();
        }

        private void CreateTeams()
        {
            var teamRepo = this.Database.GetCollection<Team>(typeof(Team).Name);

            var team1 = new Team(Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"))
            {
                Name = "Team 1"
            };
            teamRepo.Insert(team1);
            
            var team2 = new Team(Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"))
            {
                Name = "Team 2"
            };
            teamRepo.Insert(team2);
            
            var team3 = new Team(Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"))
            {
                Name = "Team 3"
            };
            teamRepo.Insert(team3);
            
            var team4 = new Team(Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"))
            {
                Name = "Team 4"
            };
            teamRepo.Insert(team4);
        }

      

        public void Dispose()
        {
            this.Database?.Dispose();
        }
    }
}