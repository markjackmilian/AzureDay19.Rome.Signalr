/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("AzureDay.Rome.Client", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.Spaf.Hubs.IBaseHub", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Spaf.Classes.WaitForMe$2", function (T, TK) { return {
        fields: {
            _complete: null,
            _eventInfo: null,
            _obj: Bridge.getDefaultValue(T),
            _handler: null
        },
        props: {
            Task: {
                get: function () {
                    return this._complete.task;
                }
            }
        },
        ctors: {
            init: function () {
                this._complete = new System.Threading.Tasks.TaskCompletionSource();
            },
            $ctor1: function (obj, eventNAme) {
                this.$initialize();
                this.Subscribe(obj, eventNAme);
            },
            ctor: function (obj, eventname) {
                this.$initialize();
                this.Subscribe(obj, eventname(obj));
            }
        },
        methods: {
            Subscribe: function (obj, eventName) {
                this._obj = obj;
                this._eventInfo = Bridge.Reflection.getMembers(T, 2, 284, eventName);
                if (this._eventInfo == null) {
                    throw new System.NullReferenceException.$ctor1(System.String.format("Event with name {0} not found on object of type {1}", eventName, T));
                }
                var methodInfo = Bridge.Reflection.getMembers(Bridge.getType(this), 8, 36 | 256, "OnComplete");

                if (methodInfo == null) {
                    throw new System.ArgumentNullException.$ctor1("methodinfo");
                }

                this._handler = Bridge.Reflection.createDelegate(methodInfo, this);
                Bridge.Reflection.midel(this._eventInfo.ad, obj)(this._handler);
            },
            OnComplete: function (sender, handler) {
                Bridge.Reflection.midel(this._eventInfo.r, this._obj)(this._handler);
                this._complete.trySetResult(handler);
            }
        }
    }; });

    Bridge.define("Bridge.Spaf.CustomRoutesConfig", {
        inherits: [Bridge.Navigation.BridgeNavigatorConfigBase],
        fields: {
            Body: null,
            HomeId: null,
            DisableAutoSpafAnchorsOnNavigate: false
        },
        alias: [
            "CreateRoutes", "Bridge$Navigation$INavigatorConfigurator$CreateRoutes",
            "Body", "Bridge$Navigation$INavigatorConfigurator$Body",
            "HomeId", "Bridge$Navigation$INavigatorConfigurator$HomeId",
            "DisableAutoSpafAnchorsOnNavigate", "Bridge$Navigation$INavigatorConfigurator$DisableAutoSpafAnchorsOnNavigate"
        ],
        ctors: {
            init: function () {
                this.Body = $("#pageBody");
                this.HomeId = Bridge.Spaf.SpafApp.MoveItId;
                this.DisableAutoSpafAnchorsOnNavigate = true;
            }
        },
        methods: {
            CreateRoutes: function () {
                return function (_o1) {
                        var $t;
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return true;
                        }, $t.HtmlLocation = function () {
                            return "pages/chat.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.HomeId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Spaf.ViewModels.ChatViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return true;
                        }, $t.HtmlLocation = function () {
                            return "pages/moveIt.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.MoveItId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Spaf.ViewModels.MoveItViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return true;
                        }, $t.HtmlLocation = function () {
                            return "pages/run.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.RunId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Spaf.ViewModels.RunViewModel);
                        }, $t));
                        return _o1;
                    }(new (System.Collections.Generic.List$1(Bridge.Navigation.IPageDescriptor)).ctor());
            }
        }
    });

    Bridge.define("Bridge.Spaf.Models.GameState", {
        $kind: "enum",
        statics: {
            fields: {
                Closed: 0,
                Register: 1,
                InRun: 2,
                Finished: 3
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp", {
        main: function Main () {
            Bridge.Spaf.SpafApp.Container = new Bridge.Ioc.BridgeIoc();
            Bridge.Spaf.SpafApp.ContainerConfig();
            Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Navigation.INavigator).Bridge$Navigation$INavigator$InitNavigation();

        },
        statics: {
            fields: {
                Container: null
            },
            props: {
                HomeId: {
                    get: function () {
                        return "home";
                    }
                },
                MoveItId: {
                    get: function () {
                        return "moveIt";
                    }
                },
                RunId: {
                    get: function () {
                        return "run";
                    }
                }
            },
            methods: {
                ContainerConfig: function () {
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.INavigator, Bridge.Navigation.BridgeNavigatorWithRouting);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.IBrowserHistoryManager, Bridge.Navigation.QueryParameterNavigationHistory);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register$4(Bridge.Navigation.INavigatorConfigurator, Bridge.Spaf.CustomRoutesConfig);

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Messenger.IMessenger, Bridge.Messenger.Messenger);

                    Bridge.Spaf.SpafApp.RegisterAllViewModels();

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Spaf.Hubs.IChatHub, Bridge.Spaf.Hubs.Impl.ChatHub);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Spaf.Hubs.IMoveItHub, AzureDay.Rome.Client.Hubs.Impl.MoveItHub);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Spaf.Hubs.IGameHub, Bridge.Spaf.Hubs.GameHub);
                },
                /**
                 * Register all types that end with "viewmodel".
                 You can register a viewmode as Singlr Instance adding "SingleInstanceAttribute" to the class
                 *
                 * @static
                 * @private
                 * @this Bridge.Spaf.SpafApp
                 * @memberof Bridge.Spaf.SpafApp
                 * @return  {void}
                 */
                RegisterAllViewModels: function () {
                    var types = System.Linq.Enumerable.from(System.AppDomain.getAssemblies()).selectMany(function (s) {
                            return Bridge.Reflection.getAssemblyTypes(s);
                        }).where(function (w) {
                        return System.String.endsWith(Bridge.Reflection.getTypeName(w).toLowerCase(), "viewmodel");
                    }).toList(Function);

                    types.ForEach(function (f) {
                        var attributes = Bridge.Reflection.getAttributes(f, Bridge.Spaf.Attributes.SingleInstanceAttribute, true);

                        if (System.Linq.Enumerable.from(attributes).any()) {
                            Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance(f);
                        } else {
                            Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register(f);
                        }
                    });

                }
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp.Messages", {
        $kind: "nested class",
        statics: {
            fields: {
                Sender: null
            },
            ctors: {
                init: function () {
                    this.Sender = new Bridge.Spaf.SpafApp.Messages.GlobalSender();
                }
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp.Messages.GlobalSender", {
        $kind: "nested class"
    });

    Bridge.define("Bridge.Spaf.ViewModels.ChatViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _chatHub: null,
            Message: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            ctor: function (chatHub) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._chatHub = chatHub;
                this._chatHub.Bridge$Spaf$Hubs$IChatHub$addOnMessagereceived(Bridge.fn.cacheBind(this, this.ChatHubOnOnMessagereceived));
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.HomeId;
            },
            ChatHubOnOnMessagereceived: function (sender, e) {
                Bridge.global.alert(e.Item1);
            },
            OnLoad: function (parameters) {
                this._chatHub.Bridge$Spaf$Hubs$IBaseHub$Start();
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            },
            OnLeave: function () {
                this._chatHub.Bridge$Spaf$Hubs$IBaseHub$Stop();
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            Send: function () {
                Bridge.global.alert(this.Message());
            }
        }
    });

    Bridge.define("Bridge.Spaf.ViewModels.MoveItViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _moveItHub: null,
            _top: 0,
            _left: 0,
            Top: null,
            Left: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            init: function () {
                this._top = 0;
                this._left = 0;
            },
            ctor: function (moveItHub) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._moveItHub = moveItHub;
                this.Top = ko.observable(System.String.format("{0}px", [Bridge.box(this._top, System.Int32)]));
                this.Left = ko.observable(System.String.format("{0}px", [Bridge.box(this._left, System.Int32)]));

                this._moveItHub.Bridge$Spaf$Hubs$IMoveItHub$addOnLeftChanged(Bridge.fn.cacheBind(this, this.MoveItHubOnOnLeftChanged));
                this._moveItHub.Bridge$Spaf$Hubs$IMoveItHub$addOnTopChanged(Bridge.fn.cacheBind(this, this.MoveItHubOnOnTopChanged));
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.MoveItId;
            },
            MoveItHubOnOnTopChanged: function (sender, e) {
                this._top = e;
                this.Top(System.String.format("{0}px", [Bridge.box(e, System.Int32)]));
            },
            MoveItHubOnOnLeftChanged: function (sender, e) {
                this._left = e;
                this.Left(System.String.format("{0}px", [Bridge.box(e, System.Int32)]));
            },
            OnLoad: function (parameters) {
                this._moveItHub.Bridge$Spaf$Hubs$IBaseHub$Start();
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            },
            OnLeave: function () {
                this._moveItHub.Bridge$Spaf$Hubs$IBaseHub$Stop();
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            AddTen: function () {
                this._top = (this._top + 10) | 0;
                this._moveItHub.Bridge$Spaf$Hubs$IMoveItHub$SendTop(this._top);
                System.Console.WriteLine(System.String.format("Top: {0}", [Bridge.box(this._top, System.Int32)]));
            },
            AddTenLeft: function () {
                this._left = (this._left + 10) | 0;
                this._moveItHub.Bridge$Spaf$Hubs$IMoveItHub$SendLeft(this._left);
                System.Console.WriteLine(System.String.format("Left: {0}", [Bridge.box(this._left, System.Int32)]));

            }
        }
    });

    Bridge.define("Bridge.Spaf.ViewModels.RunViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null
        },
        alias: ["OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"],
        ctors: {
            ctor: function (gameHub) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._gameHub.Bridge$Spaf$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.RunId;
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                Bridge.global.alert(System.Enum.toString(Bridge.Spaf.Models.GameState, e));
            },
            OnLoad: function (parameters) {
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);

                this._gameHub.Bridge$Spaf$Hubs$IBaseHub$Start();
            },
            OpenRegistration: function () {
                this._gameHub.Bridge$Spaf$Hubs$IGameHub$OpenRegistration();
            }
        }
    });

    Bridge.define("Bridge.Spaf.Hubs.IMoveItHub", {
        inherits: [Bridge.Spaf.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("Bridge.Spaf.Hubs.IGameHub", {
        inherits: [Bridge.Spaf.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("Bridge.Spaf.Hubs.IChatHub", {
        inherits: [Bridge.Spaf.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.Hubs.Impl.MoveItHub", {
        inherits: [Bridge.Spaf.Hubs.IMoveItHub],
        fields: {
            _connection: null
        },
        events: {
            OnLeftChanged: null,
            OnTopChanged: null
        },
        alias: [
            "addOnLeftChanged", "Bridge$Spaf$Hubs$IMoveItHub$addOnLeftChanged",
            "removeOnLeftChanged", "Bridge$Spaf$Hubs$IMoveItHub$removeOnLeftChanged",
            "addOnTopChanged", "Bridge$Spaf$Hubs$IMoveItHub$addOnTopChanged",
            "removeOnTopChanged", "Bridge$Spaf$Hubs$IMoveItHub$removeOnTopChanged",
            "Start", "Bridge$Spaf$Hubs$IBaseHub$Start",
            "Stop", "Bridge$Spaf$Hubs$IBaseHub$Stop",
            "SendTop", "Bridge$Spaf$Hubs$IMoveItHub$SendTop",
            "SendLeft", "Bridge$Spaf$Hubs$IMoveItHub$SendLeft"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl("/moveIt").build();
                this._connection.on("updateTop", Bridge.fn.bind(this, function (top) {
                    !Bridge.staticEquals(this.OnTopChanged, null) ? this.OnTopChanged(this, top) : null;
                }));
                this._connection.on("updateLeft", Bridge.fn.bind(this, function (left) {
                    !Bridge.staticEquals(this.OnLeftChanged, null) ? this.OnLeftChanged(this, left) : null;
                }));
            }
        },
        methods: {
            Start: function () {
                this._connection.start();
            },
            Stop: function () {
                this._connection.stop();
            },
            SendTop: function (top) {
                this._connection.send("sendTop", top);
            },
            SendLeft: function (left) {
                this._connection.send("sendLeft", left);
            }
        }
    });

    Bridge.define("Bridge.Spaf.Hubs.GameHub", {
        inherits: [Bridge.Spaf.Hubs.IGameHub],
        fields: {
            _connection: null
        },
        events: {
            OnGameStateReceived: null
        },
        alias: [
            "addOnGameStateReceived", "Bridge$Spaf$Hubs$IGameHub$addOnGameStateReceived",
            "removeOnGameStateReceived", "Bridge$Spaf$Hubs$IGameHub$removeOnGameStateReceived",
            "Start", "Bridge$Spaf$Hubs$IBaseHub$Start",
            "Stop", "Bridge$Spaf$Hubs$IBaseHub$Stop",
            "OpenRegistration", "Bridge$Spaf$Hubs$IGameHub$OpenRegistration"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl("/play").build();

                this._connection.on("gameStateMode", Bridge.fn.bind(this, function (gameState) {
                    !Bridge.staticEquals(this.OnGameStateReceived, null) ? this.OnGameStateReceived(this, gameState) : null;
                }));
            }
        },
        methods: {
            Start: function () {
                this._connection.start().catch(function (o) {
                    Bridge.global.alert(Bridge.toString(o));
                });
            },
            Stop: function () {
                this._connection.stop();
            },
            OpenRegistration: function () {
                this._connection.invoke("openRegistration");
            }
        }
    });

    Bridge.define("Bridge.Spaf.Hubs.Impl.ChatHub", {
        inherits: [Bridge.Spaf.Hubs.IChatHub],
        fields: {
            _connection: null
        },
        events: {
            OnMessagereceived: null
        },
        alias: [
            "addOnMessagereceived", "Bridge$Spaf$Hubs$IChatHub$addOnMessagereceived",
            "removeOnMessagereceived", "Bridge$Spaf$Hubs$IChatHub$removeOnMessagereceived",
            "Send", "Bridge$Spaf$Hubs$IChatHub$Send",
            "Start", "Bridge$Spaf$Hubs$IBaseHub$Start",
            "Stop", "Bridge$Spaf$Hubs$IBaseHub$Stop"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
                this._connection.on("broadcastMessage", Bridge.fn.bind(this, function (name, message) {
                    !Bridge.staticEquals(this.OnMessagereceived, null) ? this.OnMessagereceived(this, { Item1: name, Item2: message }) : null;
                }));
            }
        },
        methods: {
            Send: function (message) {
                this._connection.invoke("Send", "Blazor Client", message);
            },
            Start: function () {
                this._connection.start();
            },
            Stop: function () {
                this._connection.stop();
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJDdXN0b21Sb3V0ZXNDb25maWcuY3MiLCJTcGFmQXBwLmNzIiwiVmlld01vZGVscy9DaGF0Vmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1J1blZpZXdNb2RlbC5jcyIsIkh1YnMvSW1wbC9Nb3ZlSXRIdWIuY3MiLCJIdWJzL0ltcGwvR2FtZUh1Yi5jcyIsIkh1YnMvSW1wbC9DaGF0SHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNWS0E7OEJBQTBFQTs7Ozs7O2dCQTNCM0dBLE9BQU9BLEFBQTBEQSxVQUFDQTs7d0JBQU9BLFFBQVFBLFVBQUlBLHlEQUUzREE7OzZDQUNIQTs7b0NBQ1RBLGdEQUNXQTttQ0FB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QUVyRUEsNkNBQXdCQSxRQUFLQSxBQUFxQ0EsdUJBQThCQSxNQUFLQSxTQUE0QkEsYUFBS0EsYUFBV0E7Ozs7OzRCQUt4SUE7Z0JBRWJBLGlEQUFpREE7OztnQkFLakRBOzs7Z0JBS0FBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWYuQ2xhc3Nlc1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBXYWl0Rm9yTWU8VCwgVEs+XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4gX2NvbXBsZXRlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPigpO1xyXG5cclxuICAgICAgICBwcml2YXRlIEV2ZW50SW5mbyBfZXZlbnRJbmZvO1xyXG4gICAgICAgIHByaXZhdGUgVCBfb2JqO1xyXG4gICAgICAgIHByaXZhdGUgRGVsZWdhdGUgX2hhbmRsZXI7XHJcbnB1YmxpYyBUYXNrPFRLPiBUYXNrXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZS5UYXNrO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgc3RyaW5nIGV2ZW50TkFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnROQW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIEZ1bmM8VCwgc3RyaW5nPiBldmVudG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50bmFtZS5JbnZva2Uob2JqKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgU3Vic2NyaWJlKFQgb2JqLCBzdHJpbmcgZXZlbnROYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8gPSB0eXBlb2YoVCkuR2V0RXZlbnQoZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SW5mbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE51bGxSZWZlcmVuY2VFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV2ZW50IHdpdGggbmFtZSB7MH0gbm90IGZvdW5kIG9uIG9iamVjdCBvZiB0eXBlIHsxfVwiLGV2ZW50TmFtZSx0eXBlb2YoVCkpKTtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZEluZm8gPSB0aGlzLkdldFR5cGUoKS5HZXRNZXRob2QoXCJPbkNvbXBsZXRlXCIsIEJpbmRpbmdGbGFncy5Ob25QdWJsaWMgfCBCaW5kaW5nRmxhZ3MuSW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGhvZEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJtZXRob2RpbmZvXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlciA9IERlbGVnYXRlLkNyZWF0ZURlbGVnYXRlKHR5cGVvZihUSyksIHRoaXMsIG1ldGhvZEluZm8pO1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uQWRkRXZlbnRIYW5kbGVyKG9iaiwgdGhpcy5faGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgT25Db21wbGV0ZShvYmplY3Qgc2VuZGVyLCBUSyBoYW5kbGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLlJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9vYmosIHRoaXMuX2hhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5UcnlTZXRSZXN1bHQoaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWYuVmlld01vZGVscztcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxJUGFnZURlc2NyaXB0b3I+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2NoYXQuaHRtbFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkhvbWVJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8Q2hhdFZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9tb3ZlSXQuaHRtbFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLk1vdmVJdElkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvcnVuLmh0bWxcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5SdW5JZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8UnVuVmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEhvbWVJZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cblxyXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5Nb3ZlSXRJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGw7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLklvYztcclxudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmLkF0dHJpYnV0ZXM7XHJcbnVzaW5nIEJyaWRnZS5TcGFmLkh1YnM7XHJcbnVzaW5nIEJyaWRnZS5TcGFmLkh1YnMuSW1wbDtcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3BhZkFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlc29sdmU8SU5hdmlnYXRvcj4oKS5Jbml0TmF2aWdhdGlvbigpOyAvLyBpbml0IG5hdmlnYXRpb25cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XHJcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxyXG5cclxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXHJcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElDaGF0SHViLCBDaGF0SHViPigpO1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTW92ZUl0SHViLCBNb3ZlSXRIdWI+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xyXG4gICAgICAgIH1cclxuI3JlZ2lvbiBQQUdFUyBJRFNcclxuLy8gc3RhdGljIHBhZ2VzIGlkXHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIEhvbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJob21lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBNb3ZlSXRJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJtb3ZlSXRcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFJ1bklkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInJ1blwiO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgI2VuZHJlZ2lvblxyXG5cclxuICAgICAgICAjcmVnaW9uIE1FU1NBR0VTXHJcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjbGFzcyBNZXNzYWdlc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XHJcblxyXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc3RyaW5nIExvZ2luRG9uZSA9PiBcIkxvZ2luRG9uZVwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cclxuICAgICAgICAvLy8gWW91IGNhbiByZWdpc3RlciBhIHZpZXdtb2RlIGFzIFNpbmdsciBJbnN0YW5jZSBhZGRpbmcgXCJTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZVwiIHRvIHRoZSBjbGFzc1xyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXHJcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZi5HZXRDdXN0b21BdHRyaWJ1dGVzKHR5cGVvZihTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZSksIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlKGYpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLlNwYWYuSHVicztcclxudXNpbmcgUmV0eXBlZDtcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZi5WaWV3TW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDaGF0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElDaGF0SHViIF9jaGF0SHViO1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkhvbWVJZDtcclxufSAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IE1lc3NhZ2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIENoYXRWaWV3TW9kZWwoSUNoYXRIdWIgY2hhdEh1YilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYXRIdWIgPSBjaGF0SHViO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLk9uTWVzc2FnZXJlY2VpdmVkICs9IHRoaXMuQ2hhdEh1Yk9uT25NZXNzYWdlcmVjZWl2ZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgQ2hhdEh1Yk9uT25NZXNzYWdlcmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8c3RyaW5nLCBzdHJpbmc+IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoZS5JdGVtMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYXRIdWIuU3RhcnQoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYXRIdWIuU3RvcCgpO1xyXG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KHRoaXMuTWVzc2FnZS5TZWxmKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQnJpZGdlLlNwYWYuSHVicztcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZi5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIE1vdmVJdFZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElNb3ZlSXRIdWIgX21vdmVJdEh1YjtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuTW92ZUl0SWQ7XHJcbn1cbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgaW50IF9sZWZ0ID0gMDtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBUb3AgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTGVmdCB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIE1vdmVJdFZpZXdNb2RlbChJTW92ZUl0SHViIG1vdmVJdEh1YilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViID0gbW92ZUl0SHViO1xuICAgICAgICAgICAgdGhpcy5Ub3AgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl90b3ApKTtcbiAgICAgICAgICAgIHRoaXMuTGVmdCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX2xlZnQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uTGVmdENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQ7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25Ub3BDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PblRvcENoYW5nZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PblRvcENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGU7XG4gICAgICAgICAgICB0aGlzLlRvcC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBlO1xuICAgICAgICAgICAgdGhpcy5MZWZ0LlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdGFydCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0b3AoKTtcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdG9wKz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kVG9wKHRoaXMuX3RvcCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVG9wOiB7MH1cIix0aGlzLl90b3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZFRlbkxlZnQoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0Kz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kTGVmdCh0aGlzLl9sZWZ0KTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJMZWZ0OiB7MH1cIix0aGlzLl9sZWZ0KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5TcGFmLkh1YnM7XG51c2luZyBCcmlkZ2UuU3BhZi5Nb2RlbHM7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZi5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFJ1blZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5SdW5JZDtcclxufVxuICAgICAgICBwdWJsaWMgUnVuVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoZS5Ub1N0cmluZygpKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9wZW5SZWdpc3RyYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5TcGFmLkh1YnM7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBNb3ZlSXRIdWIgOiBJTW92ZUl0SHViXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uVG9wQ2hhbmdlZDtcblxuICAgICAgICBwdWJsaWMgTW92ZUl0SHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL21vdmVJdFwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZVRvcFwiLG5ldyBBY3Rpb248aW50PigodG9wKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Ub3BDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9wQ2hhbmdlZC5JbnZva2UodGhpcyx0b3ApKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZUxlZnRcIixuZXcgQWN0aW9uPGludD4oKGxlZnQpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkxlZnRDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTGVmdENoYW5nZWQuSW52b2tlKHRoaXMsbGVmdCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZFRvcChpbnQgdG9wKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kVG9wXCIsIHRvcCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kTGVmdChpbnQgbGVmdClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZExlZnRcIiwgbGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5TcGFmLk1vZGVscztcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmLkh1YnNcbntcbiAgICBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8R2FtZVN0YXRlPiBPbkdhbWVTdGF0ZVJlY2VpdmVkO1xuXG5cbiAgICAgICAgcHVibGljIEdhbWVIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvcGxheVwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiZ2FtZVN0YXRlTW9kZVwiLG5ldyBBY3Rpb248R2FtZVN0YXRlPigoZ2FtZVN0YXRlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkLkludm9rZSh0aGlzLGdhbWVTdGF0ZSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpLkNhdGNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJvcGVuUmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XHJcbnVzaW5nIElQcm9taXNlID0gQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQuVGhyZWFkaW5nLklQcm9taXNlO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmLkh1YnMuSW1wbFxyXG57XHJcbiAgICBjbGFzcyBDaGF0SHViIDogSUNoYXRIdWJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XHJcblxyXG4gICAgICAgIHB1YmxpYyBDaGF0SHViKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9jaGF0XCIpLkJ1aWxkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJicm9hZGNhc3RNZXNzYWdlXCIsbmV3IEFjdGlvbjxzdHJpbmcsIHN0cmluZz4oKG5hbWUsIG1lc3NhZ2UpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25NZXNzYWdlcmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25NZXNzYWdlcmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPHN0cmluZyxzdHJpbmc+KG5hbWUsbWVzc2FnZSkpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPHN0cmluZyxzdHJpbmc+PiBPbk1lc3NhZ2VyZWNlaXZlZDtcclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kKHN0cmluZyBtZXNzYWdlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJTZW5kXCIsIFwiQmxhem9yIENsaWVudFwiLCBtZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KClcclxuICAgICAgICB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0KfQo=
