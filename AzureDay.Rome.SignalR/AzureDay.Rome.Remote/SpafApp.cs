using System;
using System.Linq;
using System.Reflection;
using AzureDay.Rome.Remote.Hubs;
using AzureDay.Rome.Remote.Hubs.Impl;
using Bridge;
using Bridge.Html5;
using Bridge.Ioc;
using Bridge.Messenger;
using Bridge.Navigation;
using Bridge.Spaf.Attributes;

namespace Bridge.Spaf
{
    public class SpafApp
    {
        public static Guid TeamId { get; set; }

        public static IIoc Container;

        public static void Main()
        {
            Container = new BridgeIoc();
            ContainerConfig(); // config container
            
            var hub = Container.Resolve<IGameHub>();
            hub.Start(() =>
            {
                Container.Resolve<INavigator>().InitNavigation(); // init navigation
            });

            hub.OnNewPlayerInYourTeamJoined += (sender, player) =>
            {
                Global.Alert($"La tua squadra ha un nuovo player: {player.Name}");
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
