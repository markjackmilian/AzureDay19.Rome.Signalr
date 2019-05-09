using System;
using System.Collections;
using System.Collections.Generic;
using AzureDay.Rome.Web.Model;

namespace AzureDay.Rome.Web.Repositories
{
    public interface ITeamRepository
    {
        void ClearPlayers();
        Player AddPlayer(string name, Guid team, string contextConnectionId);

        IEnumerable<Player> GetAllPlayers();
        IEnumerable<Team> GetAllTeams();

        Team GetTeamByPlayerConnection(string contextConnectionId);
        void UpdateTeam(Team team);
    }
}