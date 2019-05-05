Bridge.assembly("AzureDay.Rome.App", function ($asm, globals) {
    "use strict";


    var $m = Bridge.setMetadata,
        $n = ["System.Collections.Generic","System","Bridge.Spaf","Bridge.Ioc","Bridge.Spaf.Hubs","System.Threading.Tasks","System.Reflection"];
    $m("Bridge.Spaf.CustomRoutesConfig", function () { return {"att":1048576,"a":4,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"CreateRoutes","t":8,"sn":"CreateRoutes","rt":$n[0].IList$1(Bridge.Navigation.IPageDescriptor)},{"ov":true,"a":2,"n":"Body","t":16,"rt":$,"g":{"ov":true,"a":2,"n":"get_Body","t":8,"rt":$,"fg":"Body"},"fn":"Body"},{"ov":true,"a":2,"n":"DisableAutoSpafAnchorsOnNavigate","t":16,"rt":$n[1].Boolean,"g":{"ov":true,"a":2,"n":"get_DisableAutoSpafAnchorsOnNavigate","t":8,"rt":$n[1].Boolean,"fg":"DisableAutoSpafAnchorsOnNavigate","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"DisableAutoSpafAnchorsOnNavigate"},{"ov":true,"a":2,"n":"HomeId","t":16,"rt":$n[1].String,"g":{"ov":true,"a":2,"n":"get_HomeId","t":8,"rt":$n[1].String,"fg":"HomeId"},"fn":"HomeId"},{"a":1,"n":"__Property__Initializer__Body","t":4,"rt":$,"sn":"__Property__Initializer__Body"},{"a":1,"n":"__Property__Initializer__DisableAutoSpafAnchorsOnNavigate","t":4,"rt":$n[1].Boolean,"sn":"__Property__Initializer__DisableAutoSpafAnchorsOnNavigate","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"__Property__Initializer__HomeId","t":4,"rt":$n[1].String,"sn":"__Property__Initializer__HomeId"}]}; }, $n);
    $m("Bridge.Spaf.SpafApp", function () { return {"nested":[$n[2].SpafApp.Messages],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ContainerConfig","is":true,"t":8,"sn":"ContainerConfig","rt":$n[1].Void},{"a":2,"n":"Main","is":true,"t":8,"sn":"Main","rt":$n[1].Void},{"a":1,"n":"RegisterAllViewModels","is":true,"t":8,"sn":"RegisterAllViewModels","rt":$n[1].Void},{"a":2,"n":"HomeId","is":true,"t":16,"rt":$n[1].String,"g":{"a":2,"n":"get_HomeId","t":8,"rt":$n[1].String,"fg":"HomeId","is":true},"fn":"HomeId"},{"a":2,"n":"Container","is":true,"t":4,"rt":$n[3].IIoc,"sn":"Container"}]}; }, $n);
    $m("Bridge.Spaf.SpafApp.Messages", function () { return {"td":$n[2].SpafApp,"nested":[$n[2].SpafApp.Messages.GlobalSender],"att":1048962,"a":2,"s":true,"m":[{"a":2,"n":"LoginDone","is":true,"t":16,"rt":$n[1].String,"g":{"a":2,"n":"get_LoginDone","t":8,"rt":$n[1].String,"fg":"LoginDone","is":true},"fn":"LoginDone"},{"a":2,"n":"Sender","is":true,"t":4,"rt":$n[2].SpafApp.Messages.GlobalSender,"sn":"Sender"}]}; }, $n);
    $m("Bridge.Spaf.SpafApp.Messages.GlobalSender", function () { return {"td":$n[2].SpafApp.Messages,"att":1048578,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"}]}; }, $n);
    $m("Bridge.Spaf.ViewModels.ChatViewModel", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[4].IChatHub],"pi":[{"n":"chatHub","pt":$n[4].IChatHub,"ps":0}],"sn":"ctor"},{"a":1,"n":"ChatHubOnOnMessagereceived","t":8,"pi":[{"n":"sender","pt":$n[1].Object,"ps":0},{"n":"e","pt":$n[1].Object,"ps":1}],"sn":"ChatHubOnOnMessagereceived","rt":$n[1].Void,"p":[$n[1].Object,$n[1].Object]},{"ov":true,"a":2,"n":"ElementId","t":8,"sn":"ElementId","rt":$n[1].String},{"ov":true,"a":2,"n":"OnLoad","t":8,"pi":[{"n":"parameters","pt":$n[0].Dictionary$2(System.String,System.Object),"ps":0}],"sn":"OnLoad","rt":$n[1].Void,"p":[$n[0].Dictionary$2(System.String,System.Object)]},{"a":2,"n":"Send","t":8,"sn":"Send","rt":$n[1].Void},{"a":2,"n":"Message","t":16,"rt":Bridge.virtualc("KnockoutObservable"),"g":{"a":2,"n":"get_Message","t":8,"rt":Bridge.virtualc("KnockoutObservable"),"fg":"Message"},"s":{"a":2,"n":"set_Message","t":8,"p":[Bridge.virtualc("KnockoutObservable")],"rt":$n[1].Void,"fs":"Message"},"fn":"Message"},{"a":1,"n":"_chatHub","t":4,"rt":$n[4].IChatHub,"sn":"_chatHub","ro":true}]}; }, $n);
    $m("Bridge.Spaf.Hubs.IChatHub", function () { return {"att":161,"a":2,"m":[{"ab":true,"a":2,"n":"Send","t":8,"pi":[{"n":"message","pt":$n[1].String,"ps":0}],"sn":"Bridge$Spaf$Hubs$IChatHub$Send","rt":$n[1].Void,"p":[$n[1].String]},{"ab":true,"a":2,"n":"Start","t":8,"sn":"Bridge$Spaf$Hubs$IChatHub$Start","rt":$n[1].Void},{"ab":true,"a":2,"n":"Stop","t":8,"sn":"Bridge$Spaf$Hubs$IChatHub$Stop","rt":$n[1].Void},{"ab":true,"a":2,"n":"OnMessagereceived","t":2,"ad":{"ab":true,"a":2,"n":"add_OnMessagereceived","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"Bridge$Spaf$Hubs$IChatHub$addOnMessagereceived","rt":$n[1].Void,"p":[Function]},"r":{"ab":true,"a":2,"n":"remove_OnMessagereceived","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"Bridge$Spaf$Hubs$IChatHub$removeOnMessagereceived","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    $m("Bridge.Spaf.Hubs.Impl.ChatHub", function () { return {"att":1048576,"a":4,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Send","t":8,"pi":[{"n":"message","pt":$n[1].String,"ps":0}],"sn":"Send","rt":$n[1].Void,"p":[$n[1].String]},{"a":2,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"Stop","t":8,"sn":"Stop","rt":$n[1].Void},{"a":1,"n":"_connection","t":4,"rt":signalR.HubConnection,"sn":"_connection","ro":true},{"a":2,"n":"OnMessagereceived","t":2,"ad":{"a":2,"n":"add_OnMessagereceived","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnMessagereceived","rt":$n[1].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnMessagereceived","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnMessagereceived","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    $m("Bridge.Spaf.Classes.WaitForMe$2", function (T, TK) { return {"att":1048576,"a":4,"m":[{"a":2,"n":".ctor","t":1,"p":[T,Function],"pi":[{"n":"obj","pt":T,"ps":0},{"n":"eventname","pt":Function,"ps":1}],"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[T,$n[1].String],"pi":[{"n":"obj","pt":T,"ps":0},{"n":"eventNAme","pt":$n[1].String,"ps":1}],"sn":"$ctor1"},{"a":1,"n":"OnComplete","t":8,"pi":[{"n":"sender","pt":$n[1].Object,"ps":0},{"n":"handler","pt":TK,"ps":1}],"sn":"OnComplete","rt":$n[1].Void,"p":[$n[1].Object,TK]},{"a":1,"n":"Subscribe","t":8,"pi":[{"n":"obj","pt":T,"ps":0},{"n":"eventName","pt":$n[1].String,"ps":1}],"sn":"Subscribe","rt":$n[1].Void,"p":[T,$n[1].String]},{"a":2,"n":"Task","t":16,"rt":$n[5].Task$1(TK),"g":{"a":2,"n":"get_Task","t":8,"rt":$n[5].Task$1(TK),"fg":"Task"},"fn":"Task"},{"a":1,"n":"_complete","t":4,"rt":$n[5].TaskCompletionSource,"sn":"_complete","ro":true},{"a":1,"n":"_eventInfo","t":4,"rt":$n[6].EventInfo,"sn":"_eventInfo"},{"a":1,"n":"_handler","t":4,"rt":Function,"sn":"_handler"},{"a":1,"n":"_obj","t":4,"rt":T,"sn":"_obj"}]}; }, $n);
});
