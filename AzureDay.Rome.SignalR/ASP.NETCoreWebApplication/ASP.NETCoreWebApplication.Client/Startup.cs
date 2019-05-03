using ASP.NETCoreWebApplication.Client.Hubs;
using ASP.NETCoreWebApplication.Client.Hubs.Impl;
using Microsoft.AspNetCore.Blazor.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace ASP.NETCoreWebApplication.Client
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IChatHub, ChatHub>();
        }

        public void Configure(IBlazorApplicationBuilder app)
        {
            app.AddComponent<App>("app");
        }
    }
}