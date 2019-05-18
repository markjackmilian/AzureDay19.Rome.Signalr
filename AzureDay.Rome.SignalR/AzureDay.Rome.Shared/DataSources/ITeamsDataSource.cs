using System.Collections.Generic;
using AzureDay.Rome.Shared;

namespace AzureDay.Rome.Remote.DataSources
{
    public interface ITeamsDataSource
    {
        IEnumerable<Team> GetTeams();
    }
}