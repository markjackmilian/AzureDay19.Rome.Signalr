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
                    this.FinishLine = 1000;
                    this.MaxPlayers = 3;
                }
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameResultViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            Winner: null
        },
        alias: ["OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"],
        ctors: {
            ctor: function () {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this.Winner = ko.observable(false);
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.GameResultId;
            },
            OnLoad: function (parameters) {
                var isWinner = Bridge.Navigation.NavigationUtility.GetParameter(System.Int32, parameters, "result");
                this.Winner(isWinner === 1);

                if (isWinner === 1) {
                    $.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Hai Vinto!" });
                } else {
                    $.toast({ heading: 'Info', hideafter: 3500, icon: 'error', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Oh no... hai perso!" });
                }


                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _navigator: null,
            _teamsDataSource: null,
            _teamId: null,
            Game: null,
            TeamName: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            init: function () {
                this._teamId = new System.Guid();
            },
            ctor: function (gameHub, navigator, teamsDataSource) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
                this._teamsDataSource = teamsDataSource;
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
                    team, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamWins(Bridge.fn.cacheBind(this, this.GameHubOnOnNotifyWinner));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamLost(Bridge.fn.cacheBind(this, this.GameHubOnOnYourTeamLost));

                                    this._teamId = System.Guid.Parse(Bridge.Spaf.SpafApp.TeamId);
                                    team = System.Linq.Enumerable.from(this._teamsDataSource.AzureDay$Rome$Remote$DataSources$ITeamsDataSource$GetTeams()).single(Bridge.fn.bind(this, function (s) {
                                        return System.Guid.op_Equality(s.id, this._teamId);
                                    }));
                                    this.TeamName = team.name;

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
                this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.GameResultId, function (_o1) {
                        _o1.add("result", Bridge.box(0, System.Int32));
                        return _o1;
                    }(new (System.Collections.Generic.Dictionary$2(System.String,System.Object))()));
            },
            GameHubOnOnNotifyWinner: function (sender, e) {
                this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.GameResultId, function (_o1) {
                        _o1.add("result", Bridge.box(1, System.Int32));
                        return _o1;
                    }(new (System.Collections.Generic.Dictionary$2(System.String,System.Object))()));
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
                $.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: System.String.format("La tua squadra ha un nuovo player: {0}", [player.name]) });
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

            hub.AzureDay$Rome$Remote$Hubs$IBaseHub$addOnConnectionLost(function (sender, args) {
                var $step = 0,
                    $task1, 
                    sender, 
                    args, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    Bridge.global.alert("Disconnessione.. ricarico la pagina.");
                                    navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.WaitingId, function (_o2) {
                                        _o2.add("teamId", Bridge.Spaf.SpafApp.TeamId);
                                        return _o2;
                                    }(new (System.Collections.Generic.Dictionary$2(System.String,System.Object))()));
                                    $task1 = System.Threading.Tasks.Task.delay(200);
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    Bridge.global.location.reload();
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
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

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Remote.DataSources.ITeamsDataSource, AzureDay.Rome.Remote.DataSources.TeamsDataSource);


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
                                        team1 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"), $t.name = "Falcon", $t);
                                            $enumerator.current = team1;
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {
                                        team2 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"), $t.name = "Dragon", $t);
                                            $enumerator.current = team2;
                                            $step = 2;
                                            return true;
                                    }
                                    case 2: {
                                        team3 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"), $t.name = "Roadster", $t);
                                            $enumerator.current = team3;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        team4 = ($t = new AzureDay.Rome.Shared.team(), $t.id = System.Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"), $t.name = "SpaceX", $t);
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

    Bridge.define("AzureDay.Rome.Remote.Hubs.Impl.BaseHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.IBaseHub],
        fields: {
            Connection: null
        },
        events: {
            OnConnectionLost: null
        },
        alias: [
            "addOnConnectionLost", "AzureDay$Rome$Remote$Hubs$IBaseHub$addOnConnectionLost",
            "removeOnConnectionLost", "AzureDay$Rome$Remote$Hubs$IBaseHub$removeOnConnectionLost",
            "Connection", "AzureDay$Rome$Remote$Hubs$IBaseHub$Connection",
            "Start", "AzureDay$Rome$Remote$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Remote$Hubs$IBaseHub$Stop"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.Connection = new signalR.HubConnectionBuilder().withUrl(AzureDay.Rome.Remote.Configuration.GameServer).build();
                this.Connection.onclose(Bridge.fn.bind(this, function (error) {
                    !Bridge.staticEquals(this.OnConnectionLost, null) ? this.OnConnectionLost(this, null) : null;
                }));
            }
        },
        methods: {
            Start: function (onStarted) {
                this.Connection.start().then(function () {
                    !Bridge.staticEquals(onStarted, null) ? onStarted() : null;
                }, function (o) {
                    Bridge.global.alert(Bridge.toString(o));
                });
            },
            Stop: function () {
                this.Connection.stop();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.Impl.GameHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.Impl.BaseHub,AzureDay.Rome.Remote.Hubs.IGameHub],
        fields: {
            HubUrl: null
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
            "Tap", "AzureDay$Rome$Remote$Hubs$IGameHub$Tap",
            "Register", "AzureDay$Rome$Remote$Hubs$IGameHub$Register",
            "GetGameMode", "AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode"
        ],
        ctors: {
            init: function () {
                this.HubUrl = AzureDay.Rome.Remote.Configuration.GameServer;
            },
            ctor: function () {
                this.$initialize();
                AzureDay.Rome.Remote.Hubs.Impl.BaseHub.ctor.call(this);
                this.Connection.on("registerResult", Bridge.fn.bind(this, function (registered) {
                    !Bridge.staticEquals(this.OnRegisterResult, null) ? this.OnRegisterResult(this, registered) : null;
                }));

                this.Connection.on("gameStateMode", Bridge.fn.bind(this, function (gameState) {
                    !Bridge.staticEquals(this.OnGameStateReceived, null) ? this.OnGameStateReceived(this, gameState) : null;
                }));


                this.Connection.on("newPlayerInThisGroup", Bridge.fn.bind(this, function (player) {
                    !Bridge.staticEquals(this.OnNewPlayerInYourTeamJoined, null) ? this.OnNewPlayerInYourTeamJoined(this, player) : null;
                }));

                this.Connection.on("yourTeamWins", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamWins, null) ? this.OnYourTeamWins(this, null) : null;
                }));

                this.Connection.on("yourTeamLost", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamLost, null) ? this.OnYourTeamLost(this, null) : null;
                }));
            }
        },
        methods: {
            Tap: function () {
                this.Connection.send("tap");
            },
            Register: function (name, team) {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,System.Boolean)).ctor(this, function (hub) {
                    return "OnRegisterResult";
                });
                this.Connection.send("register", name, team);
                return waitForMe.Task;
            },
            GetGameMode: function () {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,AzureDay.Rome.Shared.GameState)).ctor(this, function (hub) {
                    return "OnGameStateReceived";
                });
                this.Connection.send("getStateMode");
                return waitForMe.Task;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLlJlbW90ZS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0dhbWVSZXN1bHRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL0dhbWVWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1JlZ2lzdGVyVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9XYWl0aW5nVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9CYXNlSHViLmNzIiwiSHVicy9JbXBsL0dhbWVIdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFpQlFBLE9BQU9BOzs7Ozs7aUNBVCtDQSxJQUFJQTs7OEJBWXpDQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQTs7NEJBR1BBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBLFVBQWlCQTs7OztpQ0FHbEJBLEtBQU9BO2dCQUUxQkEsWUFBWUE7Z0JBQ1pBLGtCQUFrQkEsNkJBQU9BLFdBQVlBO2dCQUNyQ0EsSUFBSUEsbUJBQW1CQTtvQkFDbkJBLE1BQU1BLElBQUlBLHFDQUF1QkEsNEVBQW9FQSxXQUFVQSxBQUFPQTs7Z0JBQzFIQSxpQkFBaUJBLHNEQUF1Q0E7O2dCQUV4REEsSUFBSUEsY0FBY0E7b0JBQ2RBLE1BQU1BLElBQUlBOzs7Z0JBRWRBLGdCQUFnQkEsaUNBQTBDQSxZQUFOQTtnQkFDcERBLDRDQUFnQ0EsS0FBS0E7O2tDQUdqQkEsUUFBZUE7Z0JBRW5DQSwyQ0FBbUNBLFdBQVdBO2dCQUM5Q0EsNEJBQTRCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dC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b0JBQTJCQSxNQUFLQSxRQUFPQTs7Ozs7O2dCQU0xR0E7O2dDQUd1QkEsTUFBYUE7Z0JBRXBDQSxnQkFBZ0JBLEtBQUlBLGtHQUEwQkEsTUFBTUE7OztnQkFDcERBLGlDQUFnQ0EsTUFBS0E7Z0JBQ3JDQSxPQUFPQTs7O2dCQUtQQSxnQkFBZ0JBLEtBQUlBLGtIQUErQkEsTUFBTUE7OztnQkFDekRBO2dCQUNBQSxPQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcclxuICAgICAgICBwcml2YXRlIFQgX29iajtcclxuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xyXG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgR2FtZVJlc3VsdFZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXHJcbiAgICB7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuR2FtZVJlc3VsdElkO1xyXG59ICAgICAgICBcclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGJvb2w+IFdpbm5lciB7IGdldDsgc2V0OyB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZVJlc3VsdFZpZXdNb2RlbCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLldpbm5lciA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxib29sPihmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpc1dpbm5lciA9IHBhcmFtZXRlcnMuR2V0UGFyYW1ldGVyPGludD4oXCJyZXN1bHRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuV2lubmVyLlNlbGYoaXNXaW5uZXIgPT0gMSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpc1dpbm5lciA9PSAxKVxyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3MoXCJIYWkgVmludG8hXCIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uRXJyb3IoXCJPaCBuby4uLiBoYWkgcGVyc28hXCIpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5EYXRhU291cmNlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmO1xyXG51c2luZyBSZXR5cGVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJVGVhbXNEYXRhU291cmNlIF90ZWFtc0RhdGFTb3VyY2U7XHJcbiAgICAgICAgcHJpdmF0ZSBHdWlkIF90ZWFtSWQ7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuR2FtZUlkO1xyXG59ICAgICAgICBcclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPEdhbWVTdGF0ZT4gR2FtZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgVGVhbU5hbWUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZVZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvciwgSVRlYW1zRGF0YVNvdXJjZSB0ZWFtc0RhdGFTb3VyY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xyXG4gICAgICAgICAgICB0aGlzLl90ZWFtc0RhdGFTb3VyY2UgPSB0ZWFtc0RhdGFTb3VyY2U7XHJcbiAgICAgICAgICAgIHRoaXMuR2FtZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxHYW1lU3RhdGU+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuR2FtZS5TZWxmKGUpO1xyXG4gICAgICAgICAgICBpZiAoZSA9PSBHYW1lU3RhdGUuSW5SdW4pXHJcbiAgICAgICAgICAgICAgICB0aGlzLlN3aXRjaFRvUnVuTW9kZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN3aXRjaFRvUnVuTW9kZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb24uU3VjY2VzcyhcIklsIGdpb2NvIMOoIGluaXppYXRvIVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgKz0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtTG9zdCArPSBHYW1lSHViT25PbllvdXJUZWFtTG9zdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3RlYW1JZCA9IEd1aWQuUGFyc2UoU3BhZkFwcC5UZWFtSWQpO1xyXG4gICAgICAgICAgICB2YXIgdGVhbSA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbT4odGhpcy5fdGVhbXNEYXRhU291cmNlLkdldFRlYW1zKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLCBib29sPikocyA9PiBzLklkID09IHRoaXMuX3RlYW1JZCkpO1xyXG4gICAgICAgICAgICB0aGlzLlRlYW1OYW1lID0gdGVhbS5OYW1lO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZ2FtZUh1Yi5HZXRHYW1lTW9kZSgpO1xyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Qob2JqZWN0IHNlbmRlciwgRXZlbnRBcmdzIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IuTmF2aWdhdGUoU3BhZkFwcC5HYW1lUmVzdWx0SWQsIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PigpLChfbzEpPT57X28xLkFkZChcInJlc3VsdFwiLDApO3JldHVybiBfbzE7fSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTm90aWZ5V2lubmVyKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuR2FtZVJlc3VsdElkLCBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4oKSwoX28xKT0+e19vMS5BZGQoXCJyZXN1bHRcIiwxKTtyZXR1cm4gX28xO30pKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgLT0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtTG9zdCAtPSBHYW1lSHViT25PbllvdXJUZWFtTG9zdDtcclxuXHJcblxyXG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFRhcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlRhcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmO1xyXG51c2luZyBSZXR5cGVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJlZ2lzdGVyVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU5hdmlnYXRvciBfbmF2aWdhdG9yO1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLlJlZ2lzZXJJZDtcclxufSAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IE5hbWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8Ym9vbD4gVG9vTWFueVBsYXllcnMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgUmVnaXN0ZXJWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSU5hdmlnYXRvciBuYXZpZ2F0b3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xyXG4gICAgICAgICAgICB0aGlzLk5hbWUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB0aGlzLlRvb01hbnlQbGF5ZXJzID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGJvb2w+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlRvb01hbnlQbGF5ZXJzLlNlbGYoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKEV4Y2VwdGlvbiBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShlKTtcclxuICAgICAgICAgICAgICAgIHRocm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYXN5bmMgdm9pZCBSZWdpc3RlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yRW1wdHkodGhpcy5OYW1lLlNlbGYoKSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5XYXJuaW5nKFwiSW5zZXJpc2NpIHVuIG5vbWVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcmVnaXN0ZXJlZCA9IGF3YWl0IHRoaXMuX2dhbWVIdWIuUmVnaXN0ZXIodGhpcy5OYW1lLlNlbGYoKSxHdWlkLlBhcnNlKFNwYWZBcHAuVGVhbUlkKSk7XHJcbiAgICAgICAgICAgIGlmICghcmVnaXN0ZXJlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Ub29NYW55UGxheWVycy5TZWxmKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoXCJDaSBzb25vIHRyb3BwaSBnaW9jYXRvcmkgY29ubmVzc2kuLi4gZG92ZXZpIGVzc2VyZSBwaXUgdmVsb2NlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IuTmF2aWdhdGUoU3BhZkFwcC5HYW1lSWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgXHJcblxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFdhaXRpbmdWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuV2FpdGluZ0lkO1xyXG59XHJcbiAgICAgICAgcHVibGljIFdhaXRpbmdWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSU5hdmlnYXRvciBuYXZpZ2F0b3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihlID09IEdhbWVTdGF0ZS5SZWdpc3RlcilcclxuICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvci5OYXZpZ2F0ZShTcGFmQXBwLlJlZ2lzZXJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgLT0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGFzeW5jIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcGFmQXBwLlRlYW1JZCA9IHBhcmFtZXRlcnMuR2V0UGFyYW1ldGVyPHN0cmluZz4oXCJ0ZWFtSWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIkVycm9yZSwgbm9uIHRyb3ZvIGlsIHRlYW0gaWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgdmFyIG1vZGUgPSBhd2FpdCB0aGlzLl9nYW1lSHViLkdldEdhbWVNb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkNsb3NlZDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuUmVnaXN0ZXI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkluUnVuOlxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIkRvdmV2aSBlc3NlcmUgcGl1IHZlbG9jZS4uIGlsIGdpb2NvIMOoIGdpw6AgaW4gY29yc28uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuRmluaXNoZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSWwgZ2lvY28gw6ggY29uY2x1c28uLiBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzO1xyXG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcclxue1xyXG4gICAgY2xhc3MgQ3VzdG9tUm91dGVzQ29uZmlnIDogQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IENyZWF0ZVJvdXRlcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy93YWl0aW5nLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLldhaXRpbmdJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8V2FpdGluZ1ZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvcmVnaXN0ZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuUmVnaXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxSZWdpc3RlclZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvZ2FtZS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5HYW1lSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPEdhbWVWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PmZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2dhbWVSZXN1bHQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuR2FtZVJlc3VsdElkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxHYW1lUmVzdWx0Vmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLldhaXRpbmdJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuQ2xhc3NlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuRGF0YVNvdXJjZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnMuSW1wbDtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVscztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBCcmlkZ2UuSW9jO1xyXG51c2luZyBCcmlkZ2UuTWVzc2VuZ2VyO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3BhZkFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIFRlYW1JZCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcclxuXHJcbiAgICAgICAgICAgIHZhciBuYXZpZ2F0b3IgPSBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpO1xyXG4gICAgICAgICAgICB2YXIgaHViID0gQ29udGFpbmVyLlJlc29sdmU8SUdhbWVIdWI+KCk7XHJcbiAgICAgICAgICAgIGh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGh1Yi5Pbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQgKz0gKHNlbmRlciwgcGxheWVyKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uU3VjY2VzcyhzdHJpbmcuRm9ybWF0KFwiTGEgdHVhIHNxdWFkcmEgaGEgdW4gbnVvdm8gcGxheWVyOiB7MH1cIixwbGF5ZXIuTmFtZSkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gKHNlbmRlciwgc3RhdGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PSBHYW1lU3RhdGUuQ2xvc2VkICYmIG5hdmlnYXRvci5MYXN0TmF2aWdhdGVDb250cm9sbGVyLkdldFR5cGUoKSAhPSB0eXBlb2YoV2FpdGluZ1ZpZXdNb2RlbCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KFRlYW1JZCkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJOb24gaGFpIHVuIHRlYW0gaWQuLi4gc3RyYW5vLi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuV2FpdGluZ0lkLCBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4oKSwoX28xKT0+e19vMS5BZGQoXCJ0ZWFtSWRcIixTcGFmQXBwLlRlYW1JZCk7cmV0dXJuIF9vMTt9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBodWIuT25Db25uZWN0aW9uTG9zdCArPSBhc3luYyAoc2VuZGVyLCBhcmdzKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJEaXNjb25uZXNzaW9uZS4uIHJpY2FyaWNvIGxhIHBhZ2luYS5cIik7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuTmF2aWdhdGUoU3BhZkFwcC5XYWl0aW5nSWQsIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PigpLChfbzIpPT57X28yLkFkZChcInRlYW1JZFwiLFNwYWZBcHAuVGVhbUlkKTtyZXR1cm4gX28yO30pKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IFRhc2suRGVsYXkoMjAwKTtcclxuICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhdGlvbi5SZWxvYWQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XHJcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxyXG5cclxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXHJcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SVRlYW1zRGF0YVNvdXJjZSwgVGVhbXNEYXRhU291cmNlPigpO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgV2FpdGluZ0lkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIndhaXRpbmdcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJnYW1lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBHYW1lUmVzdWx0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiZ2FtZVJlc3VsdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgUmVnaXNlcklkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInJlZ2lzdGVyXCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcclxuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgY2xhc3MgR2xvYmFsU2VuZGVyIHsgfTtcclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBSZWdpc3RlciBhbGwgdHlwZXMgdGhhdCBlbmQgd2l0aCBcInZpZXdtb2RlbFwiLlxyXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIFJlZ2lzdGVyQWxsVmlld01vZGVscygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcclxuICAgICAgICAgICAgICAgIC5XaGVyZSgoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlN5c3RlbS5UeXBlLCBib29sPikodyA9PiB3Lk5hbWUuVG9Mb3dlcigpLkVuZHNXaXRoKFwidmlld21vZGVsXCIpKSkuVG9MaXN0KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PG9iamVjdD4oYXR0cmlidXRlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyKGYpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5EYXRhU291cmNlc1xyXG57XHJcbiAgICBjbGFzcyBUZWFtc0RhdGFTb3VyY2UgOiBJVGVhbXNEYXRhU291cmNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPFRlYW0+IEdldFRlYW1zKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtMSA9IG5ldyBUZWFtXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjc0REI4MDAzLTIzNDgtNDk4Ri1CNzczLTFDNENFMEZENjlBMlwiKSxcclxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIkZhbGNvblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTE7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbTIgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RTZBRjJGNy02MTg0LTREQTAtQjJFNC05NzhFREIzRjQzRDFcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJEcmFnb25cIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0yO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlYW0zID0gbmV3IFRlYW1cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiOEQ3MjRGMDEtQzlFRS00RjMxLUE4NjUtQUZCRDZBMkQyQkRBXCIpLFxyXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiUm9hZHN0ZXJcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0zO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlYW00ID0gbmV3IFRlYW1cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiMEQyQzM3RjctNDlGRS00OEQ5LUExRDMtMUE5MEU3OTQ4QkNDXCIpLFxyXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiU3BhY2VYXCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtNDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicy5JbXBsXHJcbntcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBCYXNlSHViIDogSUJhc2VIdWJcclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc3RyaW5nIEh1YlVybCB7IGdldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uQ29ubmVjdGlvbkxvc3Q7XHJcbiAgICAgICAgcHVibGljIEh1YkNvbm5lY3Rpb24gQ29ubmVjdGlvbiB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIEJhc2VIdWIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5Db25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoQ29uZmlndXJhdGlvbi5HYW1lU2VydmVyKS5CdWlsZCgpO1xyXG4gICAgICAgICAgICB0aGlzLkNvbm5lY3Rpb24uT25DbG9zZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkVycm9yPikoZXJyb3IgPT4gdGhpcy5PbkNvbm5lY3Rpb25Mb3N0IT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uQ29ubmVjdGlvbkxvc3QuSW52b2tlKHRoaXMsbnVsbCkpOm51bGwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBTdGFydChBY3Rpb24gb25TdGFydGVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5Db25uZWN0aW9uLlN0YXJ0KClcclxuICAgICAgICAgICAgICAgIC5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+b25TdGFydGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vblN0YXJ0ZWQuSW52b2tlKCkpOm51bGwpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBTdG9wKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzLkltcGxcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVIdWIgOiBCYXNlSHViLCBJR2FtZUh1YlxyXG4gICAge1xyXG4gICAgICAgIHByb3RlY3RlZCBvdmVycmlkZSBzdHJpbmcgSHViVXJsIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFBsYXllcj4gT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8Ym9vbD4gT25SZWdpc3RlclJlc3VsdDtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uWW91clRlYW1XaW5zO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXIgT25Zb3VyVGVhbUxvc3Q7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lSHViKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5PbihcInJlZ2lzdGVyUmVzdWx0XCIsbmV3IEFjdGlvbjxib29sPigocmVnaXN0ZXJlZCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PblJlZ2lzdGVyUmVzdWx0IT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUmVnaXN0ZXJSZXN1bHQuSW52b2tlKHRoaXMscmVnaXN0ZXJlZCkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5PbihcImdhbWVTdGF0ZU1vZGVcIixuZXcgQWN0aW9uPEdhbWVTdGF0ZT4oKGdhbWVTdGF0ZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5PbihcIm5ld1BsYXllckluVGhpc0dyb3VwXCIsbmV3IEFjdGlvbjxQbGF5ZXI+KChwbGF5ZXIpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZC5JbnZva2UodGhpcyxwbGF5ZXIpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLkNvbm5lY3Rpb24uT24oXCJ5b3VyVGVhbVdpbnNcIixuZXcgQWN0aW9uKCgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25Zb3VyVGVhbVdpbnMhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Zb3VyVGVhbVdpbnMuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5PbihcInlvdXJUZWFtTG9zdFwiLG5ldyBBY3Rpb24oKCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PbllvdXJUZWFtTG9zdCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbllvdXJUZWFtTG9zdC5JbnZva2UodGhpcyxudWxsKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVGFwKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuQ29ubmVjdGlvbi5TZW5kKFwidGFwXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFRhc2s8Ym9vbD4gUmVnaXN0ZXIoc3RyaW5nIG5hbWUsIEd1aWQgdGVhbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB3YWl0Rm9yTWUgPSBuZXcgV2FpdEZvck1lPElHYW1lSHViLCBib29sPih0aGlzLCBodWIgPT4gXCJPblJlZ2lzdGVyUmVzdWx0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLkNvbm5lY3Rpb24uU2VuZChcInJlZ2lzdGVyXCIsbmFtZSx0ZWFtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFRhc2s8R2FtZVN0YXRlPiBHZXRHYW1lTW9kZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd2FpdEZvck1lID0gbmV3IFdhaXRGb3JNZTxJR2FtZUh1YiwgR2FtZVN0YXRlPih0aGlzLCBodWIgPT4gXCJPbkdhbWVTdGF0ZVJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLkNvbm5lY3Rpb24uU2VuZChcImdldFN0YXRlTW9kZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fSHViVXJsPUNvbmZpZ3VyYXRpb24uR2FtZVNlcnZlcjt9XHJcbn0iXQp9Cg==
