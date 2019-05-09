using System;
using System.Collections.Generic;
using Bridge.Spaf.Hubs;

namespace Bridge.Spaf.Repositories
{
    public interface ITeamRepository
    {
        /// <summary>
        /// Get team
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Team GetTeamById(Guid id);

        /// <summary>
        /// Get teams
        /// </summary>
        /// <returns></returns>
        IEnumerable<Team> GetTeams();
    }
}