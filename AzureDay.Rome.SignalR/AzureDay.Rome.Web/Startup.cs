using AzureDay.Rome.Web.Hubs;
using AzureDay.Rome.Web.Repositories;
using AzureDay.Rome.Web.Repositories.Impl;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace AzureDay.Rome.Web
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddMvc();
            
//            services.AddSignalR().AddAzureSignalR("Endpoint=https://ad19rome.service.signalr.net;AccessKey=Bg10eic8ZTchRNePpKh9VSHI4uZFczpt5pHCq+QTdXg=;Version=1.0;");
            services.AddSignalR();


            services.AddSingleton<IGameStateRepository, InMemoryGameStateRepository>();
            services.AddSingleton<ITeamRepository, InMemoryTeamRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            
            app.UseMvc();
            app.UseFileServer();

            app.UseCors();
            
            app.UseCors(builder =>
            {
                builder.WithOrigins("http://localhost:5005")
                    .AllowAnyHeader()
                    .WithMethods("GET", "POST")
                    .AllowCredentials();
            });
            
//            app.UseAzureSignalR(routes =>
            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chat");
                routes.MapHub<MoveItHub>("/moveIt");
                routes.MapHub<GameHub>("/play");
            });
            
        }
    }
}