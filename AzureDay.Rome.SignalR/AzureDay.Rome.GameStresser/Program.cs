using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AzureDay.Rome.Shared;
using Microsoft.AspNetCore.SignalR.Client;

namespace AzureDay.Rome.GameStresser
{
    class Program
    {
        static CancellationTokenSource cancellation = new CancellationTokenSource();

        static async Task Main(string[] args)
        {
            Console.WriteLine("Start stresser");
//            var ip = "localhost";
//            var ip = "";
            
            

            var hubConnection = new HubConnectionBuilder()
//                .WithUrl($"http://{ip}:5000/play")
                .WithUrl($"https://ad-rome-admin.azurewebsites.net/play")
                .Build();

            hubConnection.On<GameState>("gameStateMode", (state) =>
            {
                if (state == GameState.Finished)
                    cancellation.Cancel();
            });

            await hubConnection.StartAsync();

            var tasks = new List<Task>();
            for (int i = 0; i < 60; i++)
            {
                var task = Stress(cancellation.Token, async () =>
                {
                    await hubConnection.SendAsync("autoTap");
                    Console.WriteLine("Tapped");
                });
                
                tasks.Add(task);
            }

            await Task.WhenAll(tasks);
        }
        
        public static async Task Stress(CancellationToken token, Func<Task> taskTuRun)
        {
            while (!token.IsCancellationRequested)
            {
                await taskTuRun.Invoke();
                // ReSharper disable once MethodSupportsCancellation
                await Task.Delay(250);
            }
        }
        
        
    }


  
}