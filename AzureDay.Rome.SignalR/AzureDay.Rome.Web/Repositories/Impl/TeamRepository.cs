using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Web.Model;
using LiteDB;

namespace AzureDay.Rome.Web.Repositories
{
    class TeamRepository : ITeamRepository
    {
        private readonly LiteCollection<Team> _teamRepo;

        public TeamRepository(ILiteDbWrapper liteDbWrapper)
        {
            this._teamRepo = liteDbWrapper.Database.GetCollection<Team>(typeof(Team).Name);
        }
        
        public void ClearPlayers()
        {
            var teams = this._teamRepo.FindAll();
            foreach (var team in teams)
            {
                team.Players = new List<Player>();
                this._teamRepo.Update(team);
            }
        }

        public void AddPlayer(string name, Guid team, string contextConnectionId)
        {
            var dbTeam = this._teamRepo.FindOne(f => f.Id == team);
            dbTeam.Players.Add(new Player
            {
                Name = name,
                ConnectionId = contextConnectionId
            });
            this._teamRepo.Update(dbTeam);
        }

        public IEnumerable<Player> GetAllPlayers()
        {
            return this._teamRepo.FindAll().SelectMany(sm => sm.Players);
        }

        public IEnumerable<Team> GetAllTeams()
        {
            return this._teamRepo.FindAll();
        }
    }
}