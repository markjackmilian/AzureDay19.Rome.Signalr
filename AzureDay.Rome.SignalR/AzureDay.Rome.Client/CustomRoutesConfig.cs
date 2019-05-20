using System.Collections.Generic;
using AzureDay.Rome.Client.ViewModels;
using Bridge.jQuery2;
using Bridge.Navigation;

namespace Bridge.Spaf
{
    class CustomRoutesConfig : BridgeNavigatorConfigBase
    {
        public override IList<IPageDescriptor> CreateRoutes()
        {
            return new List<IPageDescriptor>
            {
               
                new PageDescriptor
                {
                    CanBeDirectLoad = ()=>true,
                    HtmlLocation = ()=>"pages/moveIt.html", 
                    Key = SpafApp.MoveItId,
                    PageController = () => SpafApp.Container.Resolve<MoveItViewModel>()
                },
                new PageDescriptor
                {
                    CanBeDirectLoad = ()=>true,
                    HtmlLocation = ()=>"pages/startGame.html", 
                    Key = SpafApp.StartGameId,
                    PageController = () => SpafApp.Container.Resolve<StartGameViewModel>()
                },
              
            };
        }

        public override jQuery Body { get; } = jQuery.Select("#pageBody");
        public override string HomeId { get; } = SpafApp.MoveItId;
        public override bool DisableAutoSpafAnchorsOnNavigate { get; } = true;

    }
}
