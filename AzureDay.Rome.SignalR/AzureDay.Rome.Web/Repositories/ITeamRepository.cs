using System;

namespace AzureDay.Rome.Web.Repositories
{
    public interface ITeamRepository
    {
        void ClearPlayers();
        void AddPlayer(string name, Guid team, string contextConnectionId);
        
    }
}