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

    Bridge.define("AzureDay.Rome.Remote.Models.GameResult");

    Bridge.define("AzureDay.Rome.Remote.Models.player", {
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

    Bridge.define("AzureDay.Rome.Remote.Models.team", {
        fields: {
            id: null,
            name: null
        },
        ctors: {
            init: function () {
                this.id = new System.Guid();
            }
        }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLlJlbW90ZS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0dhbWVSZXN1bHRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL0dhbWVWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1JlZ2lzdGVyVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9XYWl0aW5nVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBaUJRQSxPQUFPQTs7Ozs7O2lDQVQrQ0EsSUFBSUE7OzhCQVl6Q0EsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0E7OzRCQUdQQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQSxVQUFpQkE7Ozs7aUNBR2xCQSxLQUFPQTtnQkFFMUJBLFlBQVlBO2dCQUNaQSxrQkFBa0JBLDZCQUFPQSxXQUFZQTtnQkFDckNBLElBQUlBLG1CQUFtQkE7b0JBQ25CQSxNQUFNQSxJQUFJQSxxQ0FBdUJBLDRFQUFvRUEsV0FBVUEsQUFBT0E7O2dCQUMxSEEsaUJBQWlCQSxzREFBdUNBOztnQkFFeERBLElBQUlBLGNBQWNBO29CQUNkQSxNQUFNQSxJQUFJQTs7O2dCQUVkQSxnQkFBZ0JBLGlDQUEwQ0EsWUFBTkE7Z0JBQ3BEQSw0Q0FBZ0NBLEtBQUtBOztrQ0FHakJBLFFBQWVBO2dCQUVuQ0EsMkNBQW1DQSxXQUFXQTtnQkFDOUNBLDRCQUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3hDcENBLE9BQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNla0JBOzs7Z0JBRWpCQSxnQkFBZ0JBO2dCQUNoQkEsWUFBWUE7Ozs7O2dC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QkN0RXhDQSxtQkFBb0JBLElBQUlBLHVDQUErQkE7O2dCQUV2REEsb0NBQW1DQSxBQUFXQTtvQkFFMUNBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsUUFBT0E7OztnQkFHMUdBLHFDQUFvQ0EsQUFBc0JBLCtCQUFDQTtvQkFFdkRBLCtDQUEwQkEsUUFBS0EsQUFBcUNBLHlCQUFnQ0EsTUFBS0EsYUFBWUE7Ozs7Z0JBSXpIQSw0Q0FBMkNBLEFBQW1CQSwrQkFBQ0E7b0JBRTNEQSx1REFBa0NBLFFBQUtBLEFBQXFDQSxpQ0FBd0NBLE1BQUtBLFVBQVNBOzs7Z0JBR3RJQSxvQ0FBbUNBLEFBQVdBO29CQUUxQ0EsMENBQXFCQSxRQUFLQSxBQUFxQ0Esb0JBQTJCQSxNQUFLQSxRQUFPQTs7O2dCQUcxR0Esb0NBQW1DQSxBQUFXQTtvQkFFMUNBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsUUFBT0E7Ozs7Ozs2QkFLNUZBO2dCQUVkQSw4QkFBOEJBLEFBQXdCQTtvQkFBS0EsZ0NBQVdBLFFBQUtBLEFBQXFDQSxjQUFvQkE7bUJBQU1BLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs1TEE7OztnQkFLQUE7O2dDQUdpQkEsTUFBYUE7Z0JBRTlCQSxnQkFBZ0JBLEtBQUlBLGtIQUErQkEsTUFBTUE7OztnQkFDekRBLGtDQUFpQ0EsTUFBS0E7Z0JBQ3RDQSxPQUFPQTs7O2dCQUtQQSxnQkFBZ0JBLEtBQUlBLGtIQUErQkEsTUFBTUE7OztnQkFDekRBO2dCQUNBQSxPQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcclxuICAgICAgICBwcml2YXRlIFQgX29iajtcclxuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xyXG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIEJyaWRnZS5TcGFmO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVSZXN1bHRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkdhbWVSZXN1bHRJZDtcclxufVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuQ2xhc3NlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuTW9kZWxzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBCcmlkZ2UuU3BhZjtcclxudXNpbmcgUmV0eXBlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xyXG4gICAgICAgIHByaXZhdGUgR3VpZCBfdGVhbUlkO1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkdhbWVJZDtcclxufSAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxHYW1lU3RhdGU+IEdhbWUgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIEdhbWVWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xyXG4gICAgICAgICAgICB0aGlzLkdhbWUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8R2FtZVN0YXRlPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLkdhbWUuU2VsZihlKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gR2FtZVN0YXRlLkluUnVuKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5Td2l0Y2hUb1J1bk1vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBTd2l0Y2hUb1J1bk1vZGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3MoXCJJbCBnaW9jbyDDqCBpbml6aWF0byFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGFzeW5jIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uWW91clRlYW1XaW5zICs9IHRoaXMuR2FtZUh1Yk9uT25Ob3RpZnlXaW5uZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbUxvc3QgKz0gR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Q7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90ZWFtSWQgPSBTcGFmQXBwLlRlYW1JZDtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2dhbWVIdWIuR2V0R2FtZU1vZGUoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Qob2JqZWN0IHNlbmRlciwgRXZlbnRBcmdzIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJIYWkgcGVyc28hXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTm90aWZ5V2lubmVyKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSGFpIHZpbnRvIVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgLT0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtTG9zdCAtPSBHYW1lSHViT25PbllvdXJUZWFtTG9zdDtcclxuXHJcblxyXG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFRhcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlRhcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuQ2xhc3NlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUmVnaXN0ZXJWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuUmVnaXNlcklkO1xyXG59ICAgICAgICBcclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTmFtZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBSZWdpc3RlclZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xyXG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XHJcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYXN5bmMgdm9pZCBSZWdpc3RlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yRW1wdHkodGhpcy5OYW1lLlNlbGYoKSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5XYXJuaW5nKFwiSW5zZXJpc2NpIHVuIG5vbWVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2dhbWVIdWIuUmVnaXN0ZXIodGhpcy5OYW1lLlNlbGYoKSxTcGFmQXBwLlRlYW1JZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLkdhbWVJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLk1vZGVscztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFdhaXRpbmdWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuV2FpdGluZ0lkO1xyXG59XHJcbiAgICAgICAgcHVibGljIFdhaXRpbmdWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSU5hdmlnYXRvciBuYXZpZ2F0b3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihlID09IEdhbWVTdGF0ZS5SZWdpc3RlcilcclxuICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLlJlZ2lzZXJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgLT0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGFzeW5jIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcGFmQXBwLlRlYW1JZCA9IHBhcmFtZXRlcnMuR2V0UGFyYW1ldGVyPEd1aWQ+KFwidGVhbUlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChFeGNlcHRpb24gZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiRXJyb3JlLCBub24gdHJvdm8gaWwgdGVhbSBpZCFcIik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kZSA9IGF3YWl0IHRoaXMuX2dhbWVIdWIuR2V0R2FtZU1vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuQ2xvc2VkOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5SZWdpc3RlcjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IuTmF2aWdhdGUoU3BhZkFwcC5SZWdpc2VySWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiRG92ZXZpIGVzc2VyZSBwaXUgdmVsb2NlLi4gaWwgZ2lvY28gw6ggZ2nDoCBpbiBjb3Jzby5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5GaW5pc2hlZDpcclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJJbCBnaW9jbyDDqCBjb25jbHVzby4uIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHM7XHJcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxJUGFnZURlc2NyaXB0b3I+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL3dhaXRpbmcuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuV2FpdGluZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxXYWl0aW5nVmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9yZWdpc3Rlci5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5SZWdpc2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPFJlZ2lzdGVyVmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9nYW1lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkdhbWVJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8R2FtZVZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvZ2FtZVJlc3VsdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5HYW1lUmVzdWx0SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPEdhbWVSZXN1bHRWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO3JldHVybiBfbzE7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgalF1ZXJ5IEJvZHkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBIb21lSWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuICAgIFxucHJpdmF0ZSBqUXVlcnkgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JvZHk9alF1ZXJ5LlNlbGVjdChcIiNwYWdlQm9keVwiKTtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fSG9tZUlkPVNwYWZBcHAuV2FpdGluZ0lkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnMuSW1wbDtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZS5Jb2M7XHJcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XHJcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xyXG51c2luZyBCcmlkZ2UuU3BhZi5BdHRyaWJ1dGVzO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHdWlkIFRlYW1JZCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBodWIgPSBDb250YWluZXIuUmVzb2x2ZTxJR2FtZUh1Yj4oKTtcclxuICAgICAgICAgICAgaHViLlN0YXJ0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZXNvbHZlPElOYXZpZ2F0b3I+KCkuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGh1Yi5Pbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQgKz0gKHNlbmRlciwgcGxheWVyKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoc3RyaW5nLkZvcm1hdChcIkxhIHR1YSBzcXVhZHJhIGhhIHVuIG51b3ZvIHBsYXllcjogezB9XCIscGxheWVyLk5hbWUpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XHJcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxyXG5cclxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXHJcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgV2FpdGluZ0lkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIndhaXRpbmdcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJnYW1lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBHYW1lUmVzdWx0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiZ2FtZVJlc3VsdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgUmVnaXNlcklkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInJlZ2lzdGVyXCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcclxuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgY2xhc3MgR2xvYmFsU2VuZGVyIHsgfTtcclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBSZWdpc3RlciBhbGwgdHlwZXMgdGhhdCBlbmQgd2l0aCBcInZpZXdtb2RlbFwiLlxyXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIFJlZ2lzdGVyQWxsVmlld01vZGVscygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcclxuICAgICAgICAgICAgICAgIC5XaGVyZSgoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlN5c3RlbS5UeXBlLCBib29sPikodyA9PiB3Lk5hbWUuVG9Mb3dlcigpLkVuZHNXaXRoKFwidmlld21vZGVsXCIpKSkuVG9MaXN0KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PG9iamVjdD4oYXR0cmlidXRlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyKGYpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLk1vZGVscztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicy5JbXBsXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XHJcblxyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8UGxheWVyPiBPbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPblJlZ2lzdGVyRG9uZTtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uWW91clRlYW1XaW5zO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXIgT25Zb3VyVGVhbUxvc3Q7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lSHViKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChDb25maWd1cmF0aW9uLkdhbWVTZXJ2ZXIpLkJ1aWxkKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwicmVnaXN0ZXJEb25lXCIsbmV3IEFjdGlvbigoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uUmVnaXN0ZXJEb25lIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUmVnaXN0ZXJEb25lLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiZ2FtZVN0YXRlTW9kZVwiLG5ldyBBY3Rpb248R2FtZVN0YXRlPigoZ2FtZVN0YXRlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZC5JbnZva2UodGhpcyxnYW1lU3RhdGUpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckluVGhpc0dyb3VwXCIsbmV3IEFjdGlvbjxQbGF5ZXI+KChwbGF5ZXIpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZC5JbnZva2UodGhpcyxwbGF5ZXIpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwieW91clRlYW1XaW5zXCIsbmV3IEFjdGlvbigoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uWW91clRlYW1XaW5zIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uWW91clRlYW1XaW5zLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwieW91clRlYW1Mb3N0XCIsbmV3IEFjdGlvbigoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uWW91clRlYW1Mb3N0IT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uWW91clRlYW1Mb3N0Lkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uU3RhcnRlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKS5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+b25TdGFydGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vblN0YXJ0ZWQuSW52b2tlKCkpOm51bGwpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFRhcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJ0YXBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVGFzayBSZWdpc3RlcihzdHJpbmcgbmFtZSwgR3VpZCB0ZWFtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHdhaXRGb3JNZSA9IG5ldyBXYWl0Rm9yTWU8SUdhbWVIdWIsIEdhbWVTdGF0ZT4odGhpcywgaHViID0+IFwiT25SZWdpc3RlckRvbmVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInJlZ2lzdGVyXCIsbmFtZSx0ZWFtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFRhc2s8R2FtZVN0YXRlPiBHZXRHYW1lTW9kZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd2FpdEZvck1lID0gbmV3IFdhaXRGb3JNZTxJR2FtZUh1YiwgR2FtZVN0YXRlPih0aGlzLCBodWIgPT4gXCJPbkdhbWVTdGF0ZVJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJnZXRTdGF0ZU1vZGVcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB3YWl0Rm9yTWUuVGFzaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXQp9Cg==
