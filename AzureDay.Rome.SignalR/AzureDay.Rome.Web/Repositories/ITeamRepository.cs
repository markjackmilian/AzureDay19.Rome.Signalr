using System;
using System.Collections;
using System.Collections.Generic;
using AzureDay.Rome.Web.Model;

namespace AzureDay.Rome.Web.Repositories
{
    public interface ITeamRepository
    {
        void ClearPlayers();
        WebPlayer AddPlayer(string name, Guid team, string contextConnectionId);

        IEnumerable<WebPlayer> GetAllPlayers();
        IEnumerable<WebTeam> GetAllTeams();

        WebTeam GetTeamByPlayerConnection(string contextConnectionId);
        void UpdateTeam(WebTeam webTeam);

        int AddCLickForPLayerWithConnection(string connection);
    }
}