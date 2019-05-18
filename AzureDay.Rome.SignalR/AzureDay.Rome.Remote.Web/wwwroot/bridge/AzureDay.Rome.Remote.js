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

    Bridge.define("AzureDay.Rome.Remote.DataSources.ITeamsDataSource", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.IBaseHub", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.SharedConfiguration", {
        statics: {
            fields: {
                FinishLine: 0,
                MaxPlayers: 0
            },
            ctors: {
                init: function () {
                    this.FinishLine = 20;
                    this.MaxPlayers = 3;
                }
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

                                    this._teamId = System.Guid.Parse(Bridge.Spaf.SpafApp.TeamId);

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
            Name: null,
            TooManyPlayers: null
        },
        alias: ["OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"],
        ctors: {
            ctor: function (gameHub, navigator) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
                this.Name = ko.observable();
                this.TooManyPlayers = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.RegiserId;
            },
            OnLoad: function (parameters) {
                try {
                    this.TooManyPlayers(false);
                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
                }
                catch (e) {
                    e = System.Exception.create(e);
                    System.Console.WriteLine(e);
                    throw e;
                }

            },
            Register: function () {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    registered, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    if (System.String.isNullOrEmpty(this.Name())) {
                                        $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Inserisci un nome" });
                                        return;
                                    }


                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$Register(this.Name(), System.Guid.Parse(Bridge.Spaf.SpafApp.TeamId));
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $taskResult1 = $task1.getAwaitedResult();
                                    registered = $taskResult1;
                                    if (!registered) {
                                        this.TooManyPlayers(true);
                                        $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Ci sono troppi giocatori connessi... dovevi essere piu veloce." });
                                        return;
                                    }
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
                    $e1, 
                    mode, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);

                                    try {
                                        Bridge.Spaf.SpafApp.TeamId = Bridge.Navigation.NavigationUtility.GetParameter(System.String, parameters, "teamId");
                                    }
                                    catch ($e1) {
                                        $e1 = System.Exception.create($e1);
                                        Bridge.global.alert("Errore, non trovo il team id!");
                                        throw $e1;
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

            var navigator = Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Navigation.INavigator);
            var hub = Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.Hubs.IGameHub);
            hub.AzureDay$Rome$Remote$Hubs$IBaseHub$Start(function () {
                navigator.Bridge$Navigation$INavigator$InitNavigation();
            });

            hub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined(function (sender, player) {
                Bridge.global.alert(System.String.format("La tua squadra ha un nuovo player: {0}", [player.name]));
            });

            hub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(function (sender, state) {
                if (state === AzureDay.Rome.Shared.GameState.Closed && !Bridge.referenceEquals(Bridge.getType(navigator.Bridge$Navigation$INavigator$LastNavigateController), AzureDay.Rome.Remote.ViewModels.WaitingViewModel)) {
                    if (System.String.isNullOrEmpty(Bridge.Spaf.SpafApp.TeamId)) {
                        Bridge.global.alert("Non hai un team id... strano..");
                        return;
                    }

                    navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.WaitingId, function (_o1) {
                            _o1.add("teamId", Bridge.Spaf.SpafApp.TeamId);
                            return _o1;
                        }(new (System.Collections.Generic.Dictionary$2(System.String,System.Object))()));
                }
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

    Bridge.define("AzureDay.Rome.Remote.DataSources.TeamsDataSource", {
        inherits: [AzureDay.Rome.Remote.DataSources.ITeamsDataSource],
        alias: ["GetTeams", "AzureDay$Rome$Remote$DataSources$ITeamsDataSource$GetTeams"],
        methods: {
            GetTeams: function () {
                return new (Bridge.GeneratorEnumerable$1(AzureDay.Rome.Shared.team))(Bridge.fn.bind(this, function ()  {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        team1,
                        $t,
                        team2,
                        team3,
                        team4,
                        $async_e;

                    var $enumerator = new (Bridge.GeneratorEnumerator$1(AzureDay.Rome.Shared.team))(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        team1 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"), $t.name = "Team 1", $t);
                                            $enumerator.current = team1;
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {
                                        team2 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"), $t.name = "Team 2", $t);
                                            $enumerator.current = team2;
                                            $step = 2;
                                            return true;
                                    }
                                    case 2: {
                                        team3 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"), $t.name = "Team 3", $t);
                                            $enumerator.current = team3;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        team4 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"), $t.name = "Team 4", $t);
                                            $enumerator.current = team4;
                                            $step = 4;
                                            return true;
                                    }
                                    case 4: {

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                }));
            }
        }
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
            OnRegisterResult: null,
            OnGameStateReceived: null,
            OnYourTeamWins: null,
            OnYourTeamLost: null
        },
        alias: [
            "addOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined",
            "removeOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnNewPlayerInYourTeamJoined",
            "addOnRegisterResult", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnRegisterResult",
            "removeOnRegisterResult", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnRegisterResult",
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

                this._connection.on("registerResult", Bridge.fn.bind(this, function (registered) {
                    !Bridge.staticEquals(this.OnRegisterResult, null) ? this.OnRegisterResult(this, registered) : null;
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
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,System.Boolean)).ctor(this, function (hub) {
                    return "OnRegisterResult";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLlJlbW90ZS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0dhbWVSZXN1bHRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL0dhbWVWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1JlZ2lzdGVyVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9XYWl0aW5nVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBaUJRQSxPQUFPQTs7Ozs7O2lDQVQrQ0EsSUFBSUE7OzhCQVl6Q0EsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0E7OzRCQUdQQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQSxVQUFpQkE7Ozs7aUNBR2xCQSxLQUFPQTtnQkFFMUJBLFlBQVlBO2dCQUNaQSxrQkFBa0JBLDZCQUFPQSxXQUFZQTtnQkFDckNBLElBQUlBLG1CQUFtQkE7b0JBQ25CQSxNQUFNQSxJQUFJQSxxQ0FBdUJBLDRFQUFvRUEsV0FBVUEsQUFBT0E7O2dCQUMxSEEsaUJBQWlCQSxzREFBdUNBOztnQkFFeERBLElBQUlBLGNBQWNBO29CQUNkQSxNQUFNQSxJQUFJQTs7O2dCQUVkQSxnQkFBZ0JBLGlDQUEwQ0EsWUFBTkE7Z0JBQ3BEQSw0Q0FBZ0NBLEtBQUtBOztrQ0FHakJBLFFBQWVBO2dCQUVuQ0EsMkNBQW1DQSxXQUFXQTtnQkFDOUNBLDRCQUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkN4Q3BDQSxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7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QSxNQUFLQSxVQUFTQTs7O2dCQUd0SUEsb0NBQW1DQSxBQUFXQTtvQkFFMUNBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsUUFBT0E7OztnQkFHMUdBLG9DQUFtQ0EsQUFBV0E7b0JBRTFDQSwwQ0FBcUJBLFFBQUtBLEFBQXFDQSxvQkFBMkJBLE1BQUtBLFFBQU9BOzs7Ozs7Ozs2QkFPNUZBO2dCQUVkQSw4QkFBOEJBLEFBQXdCQTtvQkFBS0EsZ0NBQVdBLFFBQUtBLEFBQXFDQSxjQUFvQkE7bUJBQU1BLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs1TEE7OztnQkFNQUE7O2dDQUd1QkEsTUFBYUE7Z0JBRXBDQSxnQkFBZ0JBLEtBQUlBLGtHQUEwQkEsTUFBTUE7OztnQkFDcERBLGtDQUFpQ0EsTUFBS0E7Z0JBQ3RDQSxPQUFPQTs7O2dCQUtQQSxnQkFBZ0JBLEtBQUlBLGtIQUErQkEsTUFBTUE7OztnQkFDekRBO2dCQUNBQSxPQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzXG57XG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4gX2NvbXBsZXRlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPigpO1xuXG4gICAgICAgIHByaXZhdGUgRXZlbnRJbmZvIF9ldmVudEluZm87XG4gICAgICAgIHByaXZhdGUgVCBfb2JqO1xuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xucHVibGljIFRhc2s8VEs+IFRhc2tcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlLlRhc2s7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgc3RyaW5nIGV2ZW50TkFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudE5BbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgRnVuYzxULCBzdHJpbmc+IGV2ZW50bmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE51bGxSZWZlcmVuY2VFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV2ZW50IHdpdGggbmFtZSB7MH0gbm90IGZvdW5kIG9uIG9iamVjdCBvZiB0eXBlIHsxfVwiLGV2ZW50TmFtZSx0eXBlb2YoVCkpKTtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcblxuICAgICAgICAgICAgdGhpcy5faGFuZGxlciA9IERlbGVnYXRlLkNyZWF0ZURlbGVnYXRlKHR5cGVvZihUSyksIHRoaXMsIG1ldGhvZEluZm8pO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLlJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9vYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIEJyaWRnZS5TcGFmO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lUmVzdWx0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkdhbWVSZXN1bHRJZDtcclxufVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIEdhbWVWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSBHdWlkIF90ZWFtSWQ7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkdhbWVJZDtcclxufSAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8R2FtZVN0YXRlPiBHYW1lIHsgZ2V0OyBzZXQ7IH1cblxuXG4gICAgICAgIHB1YmxpYyBHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xuICAgICAgICAgICAgdGhpcy5HYW1lID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPEdhbWVTdGF0ZT4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkdhbWUuU2VsZihlKTtcbiAgICAgICAgICAgIGlmIChlID09IEdhbWVTdGF0ZS5JblJ1bilcbiAgICAgICAgICAgICAgICB0aGlzLlN3aXRjaFRvUnVuTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN3aXRjaFRvUnVuTW9kZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5TdWNjZXNzKFwiSWwgZ2lvY28gw6ggaW5pemlhdG8hXCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgKz0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbUxvc3QgKz0gR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Q7XG5cbiAgICAgICAgICAgIHRoaXMuX3RlYW1JZCA9IEd1aWQuUGFyc2UoU3BhZkFwcC5UZWFtSWQpO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9nYW1lSHViLkdldEdhbWVNb2RlKCk7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbllvdXJUZWFtTG9zdChvYmplY3Qgc2VuZGVyLCBFdmVudEFyZ3MgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSGFpIHBlcnNvIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25Pbk5vdGlmeVdpbm5lcihvYmplY3Qgc2VuZGVyLCBFdmVudEFyZ3MgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSGFpIHZpbnRvIVwiKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uWW91clRlYW1XaW5zIC09IHRoaXMuR2FtZUh1Yk9uT25Ob3RpZnlXaW5uZXI7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uWW91clRlYW1Mb3N0IC09IEdhbWVIdWJPbk9uWW91clRlYW1Mb3N0O1xuXG5cbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgVGFwKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5UYXAoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFJlZ2lzdGVyVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU5hdmlnYXRvciBfbmF2aWdhdG9yO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5SZWdpc2VySWQ7XHJcbn0gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTmFtZSB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8Ym9vbD4gVG9vTWFueVBsYXllcnMgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBSZWdpc3RlclZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XG4gICAgICAgICAgICB0aGlzLk5hbWUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPigpO1xuICAgICAgICAgICAgdGhpcy5Ub29NYW55UGxheWVycyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxib29sPigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuVG9vTWFueVBsYXllcnMuU2VsZihmYWxzZSk7XG4gICAgICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoRXhjZXB0aW9uIGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoZSk7XG4gICAgICAgICAgICAgICAgdGhyb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFzeW5jIHZvaWQgUmVnaXN0ZXIoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yRW1wdHkodGhpcy5OYW1lLlNlbGYoKSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoXCJJbnNlcmlzY2kgdW4gbm9tZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHJlZ2lzdGVyZWQgPSBhd2FpdCB0aGlzLl9nYW1lSHViLlJlZ2lzdGVyKHRoaXMuTmFtZS5TZWxmKCksR3VpZC5QYXJzZShTcGFmQXBwLlRlYW1JZCkpO1xuICAgICAgICAgICAgaWYgKCFyZWdpc3RlcmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuVG9vTWFueVBsYXllcnMuU2VsZih0cnVlKTtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhcIkNpIHNvbm8gdHJvcHBpIGdpb2NhdG9yaSBjb25uZXNzaS4uLiBkb3ZldmkgZXNzZXJlIHBpdSB2ZWxvY2UuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLkdhbWVJZCk7XG4gICAgICAgIH1cblxuICBcblxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWY7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFdhaXRpbmdWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLldhaXRpbmdJZDtcclxufVxuICAgICAgICBwdWJsaWMgV2FpdGluZ1ZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoZSA9PSBHYW1lU3RhdGUuUmVnaXN0ZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNwYWZBcHAuVGVhbUlkID0gcGFyYW1ldGVycy5HZXRQYXJhbWV0ZXI8c3RyaW5nPihcInRlYW1JZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIkVycm9yZSwgbm9uIHRyb3ZvIGlsIHRlYW0gaWQhXCIpO1xuICAgICAgICAgICAgICAgIHRocm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgbW9kZSA9IGF3YWl0IHRoaXMuX2dhbWVIdWIuR2V0R2FtZU1vZGUoKTtcblxuICAgICAgICAgICAgc3dpdGNoIChtb2RlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkNsb3NlZDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuUmVnaXN0ZXI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLlJlZ2lzZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkluUnVuOlxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJEb3ZldmkgZXNzZXJlIHBpdSB2ZWxvY2UuLiBpbCBnaW9jbyDDqCBnacOgIGluIGNvcnNvLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuRmluaXNoZWQ6XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIklsIGdpb2NvIMOoIGNvbmNsdXNvLi4gXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzO1xudXNpbmcgQnJpZGdlLmpRdWVyeTI7XG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgY2xhc3MgQ3VzdG9tUm91dGVzQ29uZmlnIDogQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZVxuICAgIHtcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PElQYWdlRGVzY3JpcHRvcj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvd2FpdGluZy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuV2FpdGluZ0lkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8V2FpdGluZ1ZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL3JlZ2lzdGVyLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5SZWdpc2VySWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxSZWdpc3RlclZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2dhbWUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkdhbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPEdhbWVWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PmZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9nYW1lUmVzdWx0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5HYW1lUmVzdWx0SWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxHYW1lUmVzdWx0Vmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7cmV0dXJuIF9vMTt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBqUXVlcnkgQm9keSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEhvbWVJZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBEaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5XYWl0aW5nSWQ7cHJpdmF0ZSBib29sIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19EaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZT10cnVlO31cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzLkltcGw7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2U7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuSW9jO1xudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgcHVibGljIGNsYXNzIFNwYWZBcHBcbiAgICB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIFRlYW1JZCB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBJSW9jIENvbnRhaW5lcjtcbiAgICAgICAgXG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXIgPSBuZXcgQnJpZGdlSW9jKCk7XG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxuXG4gICAgICAgICAgICB2YXIgbmF2aWdhdG9yID0gQ29udGFpbmVyLlJlc29sdmU8SU5hdmlnYXRvcj4oKTtcbiAgICAgICAgICAgIHZhciBodWIgPSBDb250YWluZXIuUmVzb2x2ZTxJR2FtZUh1Yj4oKTtcbiAgICAgICAgICAgIGh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5Jbml0TmF2aWdhdGlvbigpOyAvLyBpbml0IG5hdmlnYXRpb25cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaHViLk9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZCArPSAoc2VuZGVyLCBwbGF5ZXIpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KHN0cmluZy5Gb3JtYXQoXCJMYSB0dWEgc3F1YWRyYSBoYSB1biBudW92byBwbGF5ZXI6IHswfVwiLHBsYXllci5OYW1lKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodWIuT25HYW1lU3RhdGVSZWNlaXZlZCArPSAoc2VuZGVyLCBzdGF0ZSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT0gR2FtZVN0YXRlLkNsb3NlZCAmJiBuYXZpZ2F0b3IuTGFzdE5hdmlnYXRlQ29udHJvbGxlci5HZXRUeXBlKCkgIT0gdHlwZW9mKFdhaXRpbmdWaWV3TW9kZWwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KFRlYW1JZCkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIk5vbiBoYWkgdW4gdGVhbSBpZC4uLiBzdHJhbm8uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuV2FpdGluZ0lkLCBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4oKSwoX28xKT0+e19vMS5BZGQoXCJ0ZWFtSWRcIixTcGFmQXBwLlRlYW1JZCk7cmV0dXJuIF9vMTt9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBDb250YWluZXJDb25maWcoKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElOYXZpZ2F0b3IsIEJyaWRnZU5hdmlnYXRvcldpdGhSb3V0aW5nPigpO1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgUXVlcnlQYXJhbWV0ZXJOYXZpZ2F0aW9uSGlzdG9yeT4oKTtcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXI8SU5hdmlnYXRvckNvbmZpZ3VyYXRvciwgQ3VzdG9tUm91dGVzQ29uZmlnPigpOyBcblxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTWVzc2VuZ2VyLCBNZXNzZW5nZXIuTWVzc2VuZ2VyPigpO1xuXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXG4gICAgICAgICAgICBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKTtcblxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcblxuXG4gICAgICAgIH1cbiNyZWdpb24gUEFHRVMgSURTXHJcbi8vIHN0YXRpYyBwYWdlcyBpZFxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBXYWl0aW5nSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwid2FpdGluZ1wiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgR2FtZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcImdhbWVcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVSZXN1bHRJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJnYW1lUmVzdWx0XCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBSZWdpc2VySWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwicmVnaXN0ZXJcIjtcclxuICAgIH1cclxufVxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgI3JlZ2lvbiBNRVNTQUdFU1xuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTWVzc2FnZXNcbiAgICAgICAge1xuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XG5cbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcblxuICAgICAgICAgICAgLy9wdWJsaWMgc3RhdGljIHN0cmluZyBMb2dpbkRvbmUgPT4gXCJMb2dpbkRvbmVcIjtcblxuICAgICAgICB9XG5cblxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cbiAgICAgICAgLy8vIFlvdSBjYW4gcmVnaXN0ZXIgYSB2aWV3bW9kZSBhcyBTaW5nbHIgSW5zdGFuY2UgYWRkaW5nIFwiU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGVcIiB0byB0aGUgY2xhc3NcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xuXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGYuR2V0Q3VzdG9tQXR0cmlidXRlcyh0eXBlb2YoU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGUpLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZShmKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzXG57XG4gICAgY2xhc3MgVGVhbXNEYXRhU291cmNlIDogSVRlYW1zRGF0YVNvdXJjZVxuICAgIHtcbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPFRlYW0+IEdldFRlYW1zKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI3NERCODAwMy0yMzQ4LTQ5OEYtQjc3My0xQzRDRTBGRDY5QTJcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAxXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0xO1xuXG4gICAgICAgICAgICB2YXIgdGVhbTIgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDJcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTI7XG5cbiAgICAgICAgICAgIHZhciB0ZWFtMyA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiOEQ3MjRGMDEtQzlFRS00RjMxLUE4NjUtQUZCRDZBMkQyQkRBXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gM1wiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMztcblxuICAgICAgICAgICAgdmFyIHRlYW00ID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSA0XCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnMuSW1wbFxue1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcblxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFBsYXllcj4gT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGJvb2w+IE9uUmVnaXN0ZXJSZXN1bHQ7XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPbllvdXJUZWFtV2lucztcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPbllvdXJUZWFtTG9zdDtcblxuICAgICAgICBwdWJsaWMgR2FtZUh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChDb25maWd1cmF0aW9uLkdhbWVTZXJ2ZXIpLkJ1aWxkKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJyZWdpc3RlclJlc3VsdFwiLG5ldyBBY3Rpb248Ym9vbD4oKHJlZ2lzdGVyZWQpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblJlZ2lzdGVyUmVzdWx0IT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUmVnaXN0ZXJSZXN1bHQuSW52b2tlKHRoaXMscmVnaXN0ZXJlZCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwibmV3UGxheWVySW5UaGlzR3JvdXBcIixuZXcgQWN0aW9uPFBsYXllcj4oKHBsYXllcikgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQuSW52b2tlKHRoaXMscGxheWVyKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInlvdXJUZWFtV2luc1wiLG5ldyBBY3Rpb24oKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uWW91clRlYW1XaW5zIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uWW91clRlYW1XaW5zLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwieW91clRlYW1Mb3N0XCIsbmV3IEFjdGlvbigoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Zb3VyVGVhbUxvc3QhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Zb3VyVGVhbUxvc3QuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uU3RhcnRlZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpLlRoZW4oKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT5vblN0YXJ0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pm9uU3RhcnRlZC5JbnZva2UoKSk6bnVsbCksKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IEdsb2JhbC5BbGVydChvLlRvU3RyaW5nKCkpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFRhcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInRhcFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBUYXNrPGJvb2w+IFJlZ2lzdGVyKHN0cmluZyBuYW1lLCBHdWlkIHRlYW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3YWl0Rm9yTWUgPSBuZXcgV2FpdEZvck1lPElHYW1lSHViLCBib29sPih0aGlzLCBodWIgPT4gXCJPblJlZ2lzdGVyUmVzdWx0XCIpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwicmVnaXN0ZXJcIixuYW1lLHRlYW0pO1xuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFRhc2s8R2FtZVN0YXRlPiBHZXRHYW1lTW9kZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3YWl0Rm9yTWUgPSBuZXcgV2FpdEZvck1lPElHYW1lSHViLCBHYW1lU3RhdGU+KHRoaXMsIGh1YiA9PiBcIk9uR2FtZVN0YXRlUmVjZWl2ZWRcIik7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJnZXRTdGF0ZU1vZGVcIik7XG4gICAgICAgICAgICByZXR1cm4gd2FpdEZvck1lLlRhc2s7XG4gICAgICAgIH1cbiAgICB9XG59Il0KfQo=
