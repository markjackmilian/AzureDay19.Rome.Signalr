using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Remote.DataSources;
using AzureDay.Rome.Shared;

namespace AzureDay.Rome.Client.Repositories.Impl
{
    class TeamRepository : ITeamRepository
    {
        private readonly ITeamsDataSource _teamsDataSource;

        public TeamRepository(ITeamsDataSource teamsDataSource)
        {
            this._teamsDataSource = teamsDataSource;
        }    
        
        public Team GetTeamById(Guid id)
        {
            var teams = this.GetTeams();
            return teams.SingleOrDefault(sd => sd.Id.ToString().Equals(id.ToString(),StringComparison.InvariantCultureIgnoreCase));
        }

        public IEnumerable<Team> GetTeams()
        {
            return this._teamsDataSource.GetTeams();
        }
    }
}