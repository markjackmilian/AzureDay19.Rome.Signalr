using System.Collections.Generic;
using AzureDay.Rome.Remote.ViewModels;
using Bridge.jQuery2;
using Bridge.Navigation;
using Bridge.Spaf.ViewModels;

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
                    HtmlLocation = ()=>"pages/waiting.html",
                    Key = SpafApp.WaitingId,
                    PageController = () => SpafApp.Container.Resolve<WaitingViewModel>()
                },
                new PageDescriptor
                {
                    CanBeDirectLoad = ()=>true,
                    HtmlLocation = ()=>"pages/register.html",
                    Key = SpafApp.RegiserId,
                    PageController = () => SpafApp.Container.Resolve<RegisterViewModel>()
                },
                new PageDescriptor
                {
                    CanBeDirectLoad = ()=>true,
                    HtmlLocation = ()=>"pages/game.html",
                    Key = SpafApp.GameId,
                    PageController = () => SpafApp.Container.Resolve<GameViewModel>()
                },
                new PageDescriptor
                {
                    CanBeDirectLoad = ()=>true,
                    HtmlLocation = ()=>"pages/gameResult.html",
                    Key = SpafApp.GameResultId,
                    PageController = () => SpafApp.Container.Resolve<GameResultViewModel>()
                },
              
            };
        }

        public override jQuery Body { get; } = jQuery.Select("#pageBody");
        public override string HomeId { get; } = SpafApp.WaitingId;
        public override bool DisableAutoSpafAnchorsOnNavigate { get; } = true;
    }
}
