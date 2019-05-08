using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureDay.Rome.Web.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
            
//            app.UseAzureSignalR(routes =>
            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chat");
                routes.MapHub<MoveItHub>("/moveIt");

            });
            
            
        }
    }
}