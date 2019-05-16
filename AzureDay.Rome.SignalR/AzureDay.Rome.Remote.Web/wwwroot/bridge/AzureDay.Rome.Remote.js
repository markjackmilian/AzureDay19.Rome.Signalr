/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("AzureDay.Rome.Remote", function ($asm, globals) {
    "use strict";

    Bridge.define("AzureDay.Rome.Remote.Classes.WaitForMe$2", function (T, TK) { return {
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

    Bridge.define("AzureDay.Rome.Remote.Configuration", {
        statics: {
            fields: {
                GameServer: null
            },
            ctors: {
                init: function () {
                    this.GameServer = "http://localhost:5000/play";
                }
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.IBaseHub", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameResultViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.GameResultId;
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _teamId: null,
            Game: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            init: function () {
                this._teamId = new System.Guid();
            },
            ctor: function (gameHub) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this.Game = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.GameId;
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                this.Game(e);
                if (e === AzureDay.Rome.Shared.GameState.InRun) {
                    this.SwitchToRunMode();
                }
            },
            SwitchToRunMode: function () {
                $.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Il gioco è iniziato!" });
            },
            OnLoad: function (parameters) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamWins(Bridge.fn.cacheBind(this, this.GameHubOnOnNotifyWinner));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamLost(Bridge.fn.cacheBind(this, this.GameHubOnOnYourTeamLost));

                                    this._teamId = Bridge.Spaf.SpafApp.TeamId;

                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode();
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $taskResult1 = $task1.getAwaitedResult();
                                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            },
            GameHubOnOnYourTeamLost: function (sender, e) {
                Bridge.global.alert("Hai perso!");
            },
            GameHubOnOnNotifyWinner: function (sender, e) {
                Bridge.global.alert("Hai vinto!");
            },
            OnLeave: function () {
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamWins(Bridge.fn.cacheBind(this, this.GameHubOnOnNotifyWinner));
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamLost(Bridge.fn.cacheBind(this, this.GameHubOnOnYourTeamLost));


                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            Tap: function () {
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$Tap();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.RegisterViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _navigator: null,
            Name: null
        },
        ctors: {
            ctor: function (gameHub, navigator) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
                this.Name = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.RegiserId;
            },
            Register: function () {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    if (System.String.isNullOrEmpty(this.Name())) {
                                        $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Inserisci un nome" });
                                        return;
                                    }

                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$Register(this.Name(), Bridge.Spaf.SpafApp.TeamId);
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.GameId, void 0);
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.WaitingViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _navigator: null
        },
        alias: [
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave",
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"
        ],
        ctors: {
            ctor: function (gameHub, navigator) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.WaitingId;
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                if (e === AzureDay.Rome.Shared.GameState.Register) {
                    this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.RegiserId, void 0);
                }
            },
            OnLeave: function () {
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
            },
            OnLoad: function (parameters) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    e, 
                    mode, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);

                                    try {
                                        Bridge.Spaf.SpafApp.TeamId = Bridge.Navigation.NavigationUtility.GetParameter(System.Guid, parameters, "teamId");
                                    }
                                    catch (e) {
                                        e = System.Exception.create(e);
                                        Bridge.global.alert("Errore, non trovo il team id!");
                                        throw e;
                                    }


                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode();
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $taskResult1 = $task1.getAwaitedResult();
                                    mode = $taskResult1;

                                    switch (mode) {
                                        case AzureDay.Rome.Shared.GameState.Closed: 
                                            this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                                            break;
                                        case AzureDay.Rome.Shared.GameState.Register: 
                                            this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.RegiserId, void 0);
                                            break;
                                        case AzureDay.Rome.Shared.GameState.InRun: 
                                            Bridge.global.alert("Dovevi essere piu veloce.. il gioco è già in corso.");
                                            break;
                                        case AzureDay.Rome.Shared.GameState.Finished: 
                                            Bridge.global.alert("Il gioco è concluso.. ");
                                            break;
                                        default: 
                                            throw new System.ArgumentOutOfRangeException.ctor();
                                    }
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Shared.GameState", {
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

    Bridge.define("AzureDay.Rome.Shared.player", {
        fields: {
            id: null,
            name: null,
            connectionid: null
        },
        ctors: {
            init: function () {
                this.id = new System.Guid();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Shared.team", {
        fields: {
            id: null,
            name: null,
            players: null
        },
        ctors: {
            init: function () {
                this.id = new System.Guid();
            }
        }
    });

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
                this.HomeId = Bridge.Spaf.SpafApp.WaitingId;
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
                            return "pages/waiting.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.WaitingId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.WaitingViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/register.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.RegiserId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.RegisterViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/game.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.GameId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.GameViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/gameResult.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.GameResultId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.GameResultViewModel);
                        }, $t));
                        return _o1;
                    }(new (System.Collections.Generic.List$1(Bridge.Navigation.IPageDescriptor)).ctor());
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp", {
        main: function Main () {
            Bridge.Spaf.SpafApp.Container = new Bridge.Ioc.BridgeIoc();
            Bridge.Spaf.SpafApp.ContainerConfig();

            var hub = Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.Hubs.IGameHub);
            hub.AzureDay$Rome$Remote$Hubs$IBaseHub$Start(function () {
                Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Navigation.INavigator).Bridge$Navigation$INavigator$InitNavigation();
            });

            hub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined(function (sender, player) {
                Bridge.global.alert(System.String.format("La tua squadra ha un nuovo player: {0}", [player.name]));
            });

        },
        statics: {
            fields: {
                TeamId: null,
                Container: null
            },
            props: {
                WaitingId: {
                    get: function () {
                        return "waiting";
                    }
                },
                GameId: {
                    get: function () {
                        return "game";
                    }
                },
                GameResultId: {
                    get: function () {
                        return "gameResult";
                    }
                },
                RegiserId: {
                    get: function () {
                        return "register";
                    }
                }
            },
            ctors: {
                init: function () {
                    this.TeamId = new System.Guid();
                }
            },
            methods: {
                ContainerConfig: function () {
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.INavigator, Bridge.Navigation.BridgeNavigatorWithRouting);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.IBrowserHistoryManager, Bridge.Navigation.QueryParameterNavigationHistory);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register$4(Bridge.Navigation.INavigatorConfigurator, Bridge.Spaf.CustomRoutesConfig);

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Messenger.IMessenger, Bridge.Messenger.Messenger);

                    Bridge.Spaf.SpafApp.RegisterAllViewModels();

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Remote.Hubs.IGameHub, AzureDay.Rome.Remote.Hubs.Impl.GameHub);


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

    Bridge.define("AzureDay.Rome.Remote.Hubs.IGameHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.Impl.GameHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.IGameHub],
        fields: {
            _connection: null
        },
        events: {
            OnNewPlayerInYourTeamJoined: null,
            OnRegisterDone: null,
            OnGameStateReceived: null,
            OnYourTeamWins: null,
            OnYourTeamLost: null
        },
        alias: [
            "addOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined",
            "removeOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnNewPlayerInYourTeamJoined",
            "addOnRegisterDone", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnRegisterDone",
            "removeOnRegisterDone", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnRegisterDone",
            "addOnGameStateReceived", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived",
            "removeOnGameStateReceived", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived",
            "addOnYourTeamWins", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamWins",
            "removeOnYourTeamWins", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamWins",
            "addOnYourTeamLost", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamLost",
            "removeOnYourTeamLost", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamLost",
            "Start", "AzureDay$Rome$Remote$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Remote$Hubs$IBaseHub$Stop",
            "Tap", "AzureDay$Rome$Remote$Hubs$IGameHub$Tap",
            "Register", "AzureDay$Rome$Remote$Hubs$IGameHub$Register",
            "GetGameMode", "AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl(AzureDay.Rome.Remote.Configuration.GameServer).build();

                this._connection.on("registerDone", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnRegisterDone, null) ? this.OnRegisterDone(this, null) : null;
                }));

                this._connection.on("gameStateMode", Bridge.fn.bind(this, function (gameState) {
                    !Bridge.staticEquals(this.OnGameStateReceived, null) ? this.OnGameStateReceived(this, gameState) : null;
                }));


                this._connection.on("newPlayerInThisGroup", Bridge.fn.bind(this, function (player) {
                    !Bridge.staticEquals(this.OnNewPlayerInYourTeamJoined, null) ? this.OnNewPlayerInYourTeamJoined(this, player) : null;
                }));

                this._connection.on("yourTeamWins", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamWins, null) ? this.OnYourTeamWins(this, null) : null;
                }));

                this._connection.on("yourTeamLost", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamLost, null) ? this.OnYourTeamLost(this, null) : null;
                }));

            }
        },
        methods: {
            Start: function (onStarted) {
                this._connection.start().then(function () {
                    !Bridge.staticEquals(onStarted, null) ? onStarted() : null;
                }, function (o) {
                    Bridge.global.alert(Bridge.toString(o));
                });
            },
            Stop: function () {
                this._connection.stop();
            },
            Tap: function () {
                this._connection.send("tap");
            },
            Register: function (name, team) {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,AzureDay.Rome.Shared.GameState)).ctor(this, function (hub) {
                    return "OnRegisterDone";
                });
                this._connection.send("register", name, team);
                return waitForMe.Task;
            },
            GetGameMode: function () {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,AzureDay.Rome.Shared.GameState)).ctor(this, function (hub) {
                    return "OnGameStateReceived";
                });
                this._connection.send("getStateMode");
                return waitForMe.Task;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLlJlbW90ZS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0dhbWVSZXN1bHRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL0dhbWVWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1JlZ2lzdGVyVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9XYWl0aW5nVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBaUJRQSxPQUFPQTs7Ozs7O2lDQVQrQ0EsSUFBSUE7OzhCQVl6Q0EsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0E7OzRCQUdQQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQSxVQUFpQkE7Ozs7aUNBR2xCQSxLQUFPQTtnQkFFMUJBLFlBQVlBO2dCQUNaQSxrQkFBa0JBLDZCQUFPQSxXQUFZQTtnQkFDckNBLElBQUlBLG1CQUFtQkE7b0JBQ25CQSxNQUFNQSxJQUFJQSxxQ0FBdUJBLDRFQUFvRUEsV0FBVUEsQUFBT0E7O2dCQUMxSEEsaUJBQWlCQSxzREFBdUNBOztnQkFFeERBLElBQUlBLGNBQWNBO29CQUNkQSxNQUFNQSxJQUFJQTs7O2dCQUVkQSxnQkFBZ0JBLGlDQUEwQ0EsWUFBTkE7Z0JBQ3BEQSw0Q0FBZ0NBLEtBQUtBOztrQ0FHakJBLFFBQWVBO2dCQUVuQ0EsMkNBQW1DQSxXQUFXQTtnQkFDOUNBLDRCQUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3hDcENBLE9BQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNja0JBOzs7Z0JBRWpCQSxnQkFBZ0JBO2dCQUNoQkEsWUFBWUE7Ozs7O2dCQVJwQkEsT0FBT0E7O29EQVd1Q0EsUUFBZUE7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Q3ZFeENBLG1CQUFvQkEsSUFBSUEsdUNBQStCQTs7Z0JBRXZEQSxvQ0FBbUNBLEFBQVdBO29CQUUxQ0EsMENBQXFCQSxRQUFLQSxBQUFxQ0Esb0JBQTJCQSxNQUFLQSxRQUFPQTs7O2dCQUcxR0EscUNBQW9DQSxBQUFzQkEsK0JBQUNBO29CQUV2REEsK0NBQTBCQSxRQUFLQSxBQUFxQ0EseUJBQWdDQSxNQUFLQSxhQUFZQTs7OztnQkFJekhBLDRDQUEyQ0EsQUFBbUJBLCtCQUFDQTtvQkFFM0RBLHVEQUFrQ0EsUUFBS0EsQUFBcUNBLGlDQUF3Q0EsTUFBS0EsVUFBU0E7OztnQkFHdElBLG9DQUFtQ0EsQUFBV0E7b0JBRTFDQSwwQ0FBcUJBLFFBQUtBLEFBQXFDQSxvQkFBMkJBLE1BQUtBLFFBQU9BOzs7Z0JBRzFHQSxvQ0FBbUNBLEFBQVdBO29CQUUxQ0EsMENBQXFCQSxRQUFLQSxBQUFxQ0Esb0JBQTJCQSxNQUFLQSxRQUFPQTs7Ozs7OzZCQUs1RkE7Z0JBRWRBLDhCQUE4QkEsQUFBd0JBO29CQUFLQSxnQ0FBV0EsUUFBS0EsQUFBcUNBLGNBQW9CQTttQkFBTUEsQUFBZ0NBO29CQUFLQSxvQkFBYUE7Ozs7Z0JBSzVMQTs7O2dCQU1BQTs7Z0NBR2lCQSxNQUFhQTtnQkFFOUJBLGdCQUFnQkEsS0FBSUEsa0hBQStCQSxNQUFNQTs7O2dCQUN6REEsa0NBQWlDQSxNQUFLQTtnQkFDdENBLE9BQU9BOzs7Z0JBS1BBLGdCQUFnQkEsS0FBSUEsa0hBQStCQSxNQUFNQTs7O2dCQUN6REE7Z0JBQ0FBLE9BQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXNcbntcbiAgICBpbnRlcm5hbCBjbGFzcyBXYWl0Rm9yTWU8VCwgVEs+XG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPiBfY29tcGxldGUgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcbiAgICAgICAgcHJpdmF0ZSBUIF9vYmo7XG4gICAgICAgIHByaXZhdGUgRGVsZWdhdGUgX2hhbmRsZXI7XG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBzdHJpbmcgZXZlbnROQW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50bmFtZS5JbnZva2Uob2JqKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgU3Vic2NyaWJlKFQgb2JqLCBzdHJpbmcgZXZlbnROYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9vYmogPSBvYmo7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8gPSB0eXBlb2YoVCkuR2V0RXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTnVsbFJlZmVyZW5jZUV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiRXZlbnQgd2l0aCBuYW1lIHswfSBub3QgZm91bmQgb24gb2JqZWN0IG9mIHR5cGUgezF9XCIsZXZlbnROYW1lLHR5cGVvZihUKSkpO1xuICAgICAgICAgICAgdmFyIG1ldGhvZEluZm8gPSB0aGlzLkdldFR5cGUoKS5HZXRNZXRob2QoXCJPbkNvbXBsZXRlXCIsIEJpbmRpbmdGbGFncy5Ob25QdWJsaWMgfCBCaW5kaW5nRmxhZ3MuSW5zdGFuY2UpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kSW5mbyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJtZXRob2RpbmZvXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVyID0gRGVsZWdhdGUuQ3JlYXRlRGVsZWdhdGUodHlwZW9mKFRLKSwgdGhpcywgbWV0aG9kSW5mbyk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uQWRkRXZlbnRIYW5kbGVyKG9iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgT25Db21wbGV0ZShvYmplY3Qgc2VuZGVyLCBUSyBoYW5kbGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uUmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX29iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5UcnlTZXRSZXN1bHQoaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgQnJpZGdlLlNwYWY7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIEdhbWVSZXN1bHRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuR2FtZVJlc3VsdElkO1xyXG59XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuQ2xhc3NlcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5TcGFmO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgR2FtZVZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xuICAgICAgICBwcml2YXRlIEd1aWQgX3RlYW1JZDtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuR2FtZUlkO1xyXG59ICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxHYW1lU3RhdGU+IEdhbWUgeyBnZXQ7IHNldDsgfVxuXG5cbiAgICAgICAgcHVibGljIEdhbWVWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLkdhbWUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8R2FtZVN0YXRlPigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuR2FtZS5TZWxmKGUpO1xuICAgICAgICAgICAgaWYgKGUgPT0gR2FtZVN0YXRlLkluUnVuKVxuICAgICAgICAgICAgICAgIHRoaXMuU3dpdGNoVG9SdW5Nb2RlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgU3dpdGNoVG9SdW5Nb2RlKClcbiAgICAgICAge1xuICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3MoXCJJbCBnaW9jbyDDqCBpbml6aWF0byFcIik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBhc3luYyB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtV2lucyArPSB0aGlzLkdhbWVIdWJPbk9uTm90aWZ5V2lubmVyO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtTG9zdCArPSBHYW1lSHViT25PbllvdXJUZWFtTG9zdDtcblxuICAgICAgICAgICAgdGhpcy5fdGVhbUlkID0gU3BhZkFwcC5UZWFtSWQ7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2dhbWVIdWIuR2V0R2FtZU1vZGUoKTtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uWW91clRlYW1Mb3N0KG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJIYWkgcGVyc28hXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTm90aWZ5V2lubmVyKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJIYWkgdmludG8hXCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgLT0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbUxvc3QgLT0gR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Q7XG5cblxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBUYXAoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlRhcCgpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFJlZ2lzdGVyVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU5hdmlnYXRvciBfbmF2aWdhdG9yO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5SZWdpc2VySWQ7XHJcbn0gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTmFtZSB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIFJlZ2lzdGVyVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElOYXZpZ2F0b3IgbmF2aWdhdG9yKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvciA9IG5hdmlnYXRvcjtcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYXN5bmMgdm9pZCBSZWdpc3RlcigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcuSXNOdWxsT3JFbXB0eSh0aGlzLk5hbWUuU2VsZigpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhcIkluc2VyaXNjaSB1biBub21lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZ2FtZUh1Yi5SZWdpc3Rlcih0aGlzLk5hbWUuU2VsZigpLFNwYWZBcHAuVGVhbUlkKTtcbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLkdhbWVJZCk7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWY7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFdhaXRpbmdWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLldhaXRpbmdJZDtcclxufVxuICAgICAgICBwdWJsaWMgV2FpdGluZ1ZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoZSA9PSBHYW1lU3RhdGUuUmVnaXN0ZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNwYWZBcHAuVGVhbUlkID0gcGFyYW1ldGVycy5HZXRQYXJhbWV0ZXI8R3VpZD4oXCJ0ZWFtSWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoRXhjZXB0aW9uIGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiRXJyb3JlLCBub24gdHJvdm8gaWwgdGVhbSBpZCFcIik7XG4gICAgICAgICAgICAgICAgdGhyb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXG5cbiAgICAgICAgICAgIHZhciBtb2RlID0gYXdhaXQgdGhpcy5fZ2FtZUh1Yi5HZXRHYW1lTW9kZSgpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuQ2xvc2VkOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5SZWdpc3RlcjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIkRvdmV2aSBlc3NlcmUgcGl1IHZlbG9jZS4uIGlsIGdpb2NvIMOoIGdpw6AgaW4gY29yc28uXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5GaW5pc2hlZDpcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSWwgZ2lvY28gw6ggY29uY2x1c28uLiBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXG4gICAge1xuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy93YWl0aW5nLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5XYWl0aW5nSWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxXYWl0aW5nVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvcmVnaXN0ZXIuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlJlZ2lzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPFJlZ2lzdGVyVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvZ2FtZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuR2FtZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8R2FtZVZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2dhbWVSZXN1bHQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkdhbWVSZXN1bHRJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPEdhbWVSZXN1bHRWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLldhaXRpbmdJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzLkltcGw7XG51c2luZyBCcmlkZ2U7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuSW9jO1xudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgcHVibGljIGNsYXNzIFNwYWZBcHBcbiAgICB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3VpZCBUZWFtSWQgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXIgPSBuZXcgQnJpZGdlSW9jKCk7XG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgaHViID0gQ29udGFpbmVyLlJlc29sdmU8SUdhbWVIdWI+KCk7XG4gICAgICAgICAgICBodWIuU3RhcnQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBodWIuT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkICs9IChzZW5kZXIsIHBsYXllcikgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoc3RyaW5nLkZvcm1hdChcIkxhIHR1YSBzcXVhZHJhIGhhIHVuIG51b3ZvIHBsYXllcjogezB9XCIscGxheWVyLk5hbWUpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXG5cbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcblxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUdhbWVIdWIsIEdhbWVIdWI+KCk7XG5cblxuICAgICAgICB9XG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgV2FpdGluZ0lkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIndhaXRpbmdcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJnYW1lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBHYW1lUmVzdWx0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiZ2FtZVJlc3VsdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgUmVnaXNlcklkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInJlZ2lzdGVyXCI7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXG4gICAgICAgIHtcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xuXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFJlZ2lzdGVyIGFsbCB0eXBlcyB0aGF0IGVuZCB3aXRoIFwidmlld21vZGVsXCIuXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXG4gICAgICAgICAgICAgICAgLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlR5cGUsIGJvb2w+KSh3ID0+IHcuTmFtZS5Ub0xvd2VyKCkuRW5kc1dpdGgoXCJ2aWV3bW9kZWxcIikpKS5Ub0xpc3QoKTtcblxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8b2JqZWN0PihhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXIoZik7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnMuSW1wbFxue1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcblxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFBsYXllcj4gT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uUmVnaXN0ZXJEb25lO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxHYW1lU3RhdGU+IE9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXIgT25Zb3VyVGVhbVdpbnM7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXIgT25Zb3VyVGVhbUxvc3Q7XG5cbiAgICAgICAgcHVibGljIEdhbWVIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoQ29uZmlndXJhdGlvbi5HYW1lU2VydmVyKS5CdWlsZCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwicmVnaXN0ZXJEb25lXCIsbmV3IEFjdGlvbigoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25SZWdpc3RlckRvbmUhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25SZWdpc3RlckRvbmUuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwibmV3UGxheWVySW5UaGlzR3JvdXBcIixuZXcgQWN0aW9uPFBsYXllcj4oKHBsYXllcikgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQuSW52b2tlKHRoaXMscGxheWVyKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInlvdXJUZWFtV2luc1wiLG5ldyBBY3Rpb24oKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uWW91clRlYW1XaW5zIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uWW91clRlYW1XaW5zLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwieW91clRlYW1Mb3N0XCIsbmV3IEFjdGlvbigoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Zb3VyVGVhbUxvc3QhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Zb3VyVGVhbUxvc3QuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvblN0YXJ0ZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKS5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+b25TdGFydGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vblN0YXJ0ZWQuSW52b2tlKCkpOm51bGwpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgIFxuICAgICAgICBwdWJsaWMgdm9pZCBUYXAoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJ0YXBcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgVGFzayBSZWdpc3RlcihzdHJpbmcgbmFtZSwgR3VpZCB0ZWFtKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgd2FpdEZvck1lID0gbmV3IFdhaXRGb3JNZTxJR2FtZUh1YiwgR2FtZVN0YXRlPih0aGlzLCBodWIgPT4gXCJPblJlZ2lzdGVyRG9uZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInJlZ2lzdGVyXCIsbmFtZSx0ZWFtKTtcbiAgICAgICAgICAgIHJldHVybiB3YWl0Rm9yTWUuVGFzaztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBUYXNrPEdhbWVTdGF0ZT4gR2V0R2FtZU1vZGUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgd2FpdEZvck1lID0gbmV3IFdhaXRGb3JNZTxJR2FtZUh1YiwgR2FtZVN0YXRlPih0aGlzLCBodWIgPT4gXCJPbkdhbWVTdGF0ZVJlY2VpdmVkXCIpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwiZ2V0U3RhdGVNb2RlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xuICAgICAgICB9XG4gICAgfVxufSJdCn0K
