using System;
using System.Collections.Generic;
using System.Linq;
using AzureDay.Rome.Web.Model;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace AzureDay.Rome.Web.Repositories.Impl
{
    class InMemoryTeamRepository : ITeamRepository
    {
        private List<WebTeam> _teams = new List<WebTeam>();

        public InMemoryTeamRepository()
        {
            this.CreateTeams();
        }

        private void CreateTeams()
        {
            var team1 = new WebTeam(Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"))
            {
                Name = "Team 1"
            };
            this._teams.Add(team1);

            var team2 = new WebTeam(Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"))
            {
                Name = "Team 2"
            };
            this._teams.Add(team2);

            var team3 = new WebTeam(Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"))
            {
                Name = "Team 3"
            };
            this._teams.Add(team3);

            var team4 = new WebTeam(Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"))
            {
                Name = "Team 4"
            };
            this._teams.Add(team4);
            
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