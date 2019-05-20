using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using AzureDay.Rome.Remote.Classes;
using AzureDay.Rome.Remote.DataSources;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Remote.Hubs.Impl;
using AzureDay.Rome.Remote.ViewModels;
using AzureDay.Rome.Shared;
using Bridge;
using Bridge.Html5;
using Bridge.Ioc;
using Bridge.Messenger;
using Bridge.Navigation;
using Bridge.Spaf.Attributes;
using System.Threading.Tasks;

namespace Bridge.Spaf
{
    public class SpafApp
    {
        public static string TeamId { get; set; }

        public static IIoc Container;
        

        public static void Main()
        {
            Container = new BridgeIoc();
            ContainerConfig(); // config container

            var navigator = Container.Resolve<INavigator>();
            var hub = Container.Resolve<IGameHub>();
            hub.Start(() =>
            {
                navigator.InitNavigation(); // init navigation
            });

            hub.OnNewPlayerInYourTeamJoined += (sender, player) =>
            {
                Notification.Success($"La tua squadra ha un nuovo player: {player.Name}");
            };

            hub.OnGameStateReceived += (sender, state) =>
            {
                if (state == GameState.Closed && navigator.LastNavigateController.GetType() != typeof(WaitingViewModel))
                {
                    if (string.IsNullOrEmpty(TeamId))
                    {
                        Global.Alert("Non hai un team id... strano..");
                        return;
                    }
                    
                    navigator.Navigate(SpafApp.WaitingId, new Dictionary<string, object>()
                    {
                        {"teamId",SpafApp.TeamId}
                    });
                }
            };

            hub.OnConnectionLost += async (sender, args) =>
            {
                Global.Alert("Disconnessione.. ricarico la pagina.");
                navigator.Navigate(SpafApp.WaitingId, new Dictionary<string, object>()
                {
                    {"teamId",SpafApp.TeamId}
                });
                await Task.Delay(200);
                Global.Location.Reload();
            };

        }

        private static void ContainerConfig()
        {
            // navigator
            Container.RegisterSingleInstance<INavigator, BridgeNavigatorWithRouting>();
            Container.RegisterSingleInstance<IBrowserHistoryManager, QueryParameterNavigationHistory>();
//            Container.RegisterSingleInstance<IBrowserHistoryManager, ComplexObjectNavigationHistory>(); // if you don't need query parameters
            Container.Register<INavigatorConfigurator, CustomRoutesConfig>(); 

            // messenger
            Container.RegisterSingleInstance<IMessenger, Messenger.Messenger>();

            // viewmodels
            RegisterAllViewModels();

            // register custom resource, services..
            Container.RegisterSingleInstance<IGameHub, GameHub>();
            
            Container.RegisterSingleInstance<ITeamsDataSource, TeamsDataSource>();


        }

        #region PAGES IDS
        // static pages id


        public static string WaitingId => "waiting";
        public static string GameId => "game";
        public static string GameResultId => "gameResult";
        public static string RegiserId => "register";

        #endregion

        #region MESSAGES
        // messenger helper for global messages and messages ids

        public static class Messages
        {
            public class GlobalSender { };

            public static GlobalSender Sender = new GlobalSender();

            //public static string LoginDone => "LoginDone";

        }


        #endregion

        /// <summary>
        /// Register all types that end with "viewmodel".
        /// You can register a viewmode as Singlr Instance adding "SingleInstanceAttribute" to the class
        /// </summary>
        private static void RegisterAllViewModels()
        {
            var types = AppDomain.CurrentDomain.GetAssemblies().SelectMany(s => s.GetTypes())
                .Where(w => w.Name.ToLower().EndsWith("viewmodel")).ToList();

            types.ForEach(f =>
            {
                var attributes = f.GetCustomAttributes(typeof(SingleInstanceAttribute), true);

                if (attributes.Any())
                    Container.RegisterSingleInstance(f);
                else
                    Container.Register(f);
            });

        }
    }
}
