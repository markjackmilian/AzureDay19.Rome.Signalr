using System.Collections.Generic;
using System.Threading.Tasks;
using ASP.NETCoreWebApplication.Shared;

namespace ASP.NETCoreWebApplication.Client.Services
{
    public interface ICrudService
    {
        Task<IEnumerable<WeatherForecast>> GetForeCast();
    }

    class CrudService : ICrudService
    {
        public Task<IEnumerable<WeatherForecast>> GetForeCast()
        {
            throw new System.NotImplementedException();
        }
    }
}