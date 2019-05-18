using System;
using System.Collections.Generic;
using AzureDay.Rome.Shared;

namespace AzureDay.Rome.Remote.DataSources
{
    class TeamsDataSource : ITeamsDataSource
    {
        public IEnumerable<Team> GetTeams()
        {
            var team1 = new Team
            {
                Id = Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"),
                Name = "Team 1",
            };
            yield return team1;

            var team2 = new Team
            {
                Id = Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"),
                Name = "Team 2",
            };
            yield return team2;

            var team3 = new Team
            {
                Id = Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"),
                Name = "Team 3",
            };
            yield return team3;

            var team4 = new Team
            {
                Id = Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"),
                Name = "Team 4",
            };
            yield return team4;
        }
    }
}