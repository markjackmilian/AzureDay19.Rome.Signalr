using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Remote.DataSources;
using AzureDay.Rome.Web.Model;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace AzureDay.Rome.Web.Repositories.Impl
{
    class InMemoryTeamRepository : ITeamRepository
    {
        private readonly ITeamsDataSource _teamsDataSource;
        private List<WebTeam> _teams = new List<WebTeam>();

        public InMemoryTeamRepository(ITeamsDataSource teamsDataSource)
        {
            this._teamsDataSource = teamsDataSource;
            this.CreateTeams();
        }

        private void CreateTeams()
        {
            var webTeams = this._teamsDataSource.GetTeams().Select(s => new WebTeam(s.Id)
            {
                Name = s.Name
            });
            this._teams.AddRange(webTeams);
        }

        public void ClearPlayers()
        {
            this._teams.ForEach(f => f.Players = new List<WebPlayer>());
        }

        public WebPlayer AddPlayer(string name, Guid teamId, string contextConnectionId)
        {
            var player = new WebPlayer
            {
                Name = name,
                ConnectionId = contextConnectionId
            };
            var team = this._teams.Single(s => s.Id == teamId);
            team.Players.Add(player);

            return player;
        }

        public IEnumerable<WebPlayer> GetAllPlayers()
        {
            return this._teams.SelectMany(sm => sm.Players);
        }

        public IEnumerable<WebTeam> GetAllTeams()
        {
            return this._teams;
        }

        public WebTeam GetTeamByPlayerConnection(string contextConnectionId)
        {
            return this._teams.SingleOrDefault(sd =>
                sd.Players.Select(s => s.ConnectionId).Contains(contextConnectionId));
        }

        public void UpdateTeam(WebTeam webTeam)
        {
            var dbTeam = this._teams.Single(s => s.Id == webTeam.Id);
            dbTeam.Name = webTeam.Name;
            dbTeam.Players = webTeam.Players;
        }

        public int AddCLickForPLayerWithConnection(string connection)
        {
            var team = this.GetTeamByPlayerConnection(connection);
            var player = team.Players.SingleOrDefault(s => s.ConnectionId == connection);
            if(player != null) 
                player.ClickCount++;
            
            return team.Players.Sum(s => s.ClickCount);
        }

        public IReadOnlyList<string> GetAllPlayersConnections => this._teams.SelectMany(s => s.Players).Select(s => s.ConnectionId).ToArray();
    }
}