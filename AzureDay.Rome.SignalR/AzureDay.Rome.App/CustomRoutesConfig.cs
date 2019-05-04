using System.Collections.Generic;
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
                    HtmlLocation = ()=>"pages/chat.html", // yout html location
                    Key = SpafApp.HomeId,
                    PageController = () => SpafApp.Container.Resolve<ChatViewModel>()
                },
              
            };
        }

        public override jQuery Body { get; } = jQuery.Select("#pageBody");
        public override string HomeId { get; } = SpafApp.HomeId;
        public override bool DisableAutoSpafAnchorsOnNavigate { get; } = true;

    }
}
