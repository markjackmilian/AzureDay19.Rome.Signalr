/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("AzureDay.Rome.Client", function ($asm, globals) {
    "use strict";

    Bridge.define("AzureDay.Rome.Client.Classes.WaitForMe$2", function (T, TK) { return {
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

    Bridge.define("AzureDay.Rome.Client.Hubs.IBaseHub", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.Repositories.ITeamRepository", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.ViewModels.MoveItViewModel", {
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

                this._moveItHub.AzureDay$Rome$Client$Hubs$IMoveItHub$addOnLeftChanged(Bridge.fn.cacheBind(this, this.MoveItHubOnOnLeftChanged));
                this._moveItHub.AzureDay$Rome$Client$Hubs$IMoveItHub$addOnTopChanged(Bridge.fn.cacheBind(this, this.MoveItHubOnOnTopChanged));
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
                this._moveItHub.AzureDay$Rome$Client$Hubs$IBaseHub$Start(void 0);
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            },
            OnLeave: function () {
                this._moveItHub.AzureDay$Rome$Client$Hubs$IBaseHub$Stop();
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            AddTen: function () {
                this._top = (this._top + 10) | 0;
                this._moveItHub.AzureDay$Rome$Client$Hubs$IMoveItHub$SendTop(this._top);
                System.Console.WriteLine(System.String.format("Top: {0}", [Bridge.box(this._top, System.Int32)]));
            },
            AddTenLeft: function () {
                this._left = (this._left + 10) | 0;
                this._moveItHub.AzureDay$Rome$Client$Hubs$IMoveItHub$SendLeft(this._left);
                System.Console.WriteLine(System.String.format("Left: {0}", [Bridge.box(this._left, System.Int32)]));

            }
        }
    });

    Bridge.define("AzureDay.Rome.Client.ViewModels.StartGameViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        statics: {
            fields: {
                FinishLineCount: 0,
                FinishLineOffset: 0,
                SpaceShipWidth: 0
            },
            ctors: {
                init: function () {
                    this.FinishLineCount = 20;
                    this.FinishLineOffset = 170;
                    this.SpaceShipWidth = 178;
                }
            }
        },
        fields: {
            _gameHub: null,
            _teamRepository: null,
            _tapCount: 0,
            State: null,
            TeamViewModels: null
        },
        props: {
            ALlPlayers: {
                get: function () {
                    return System.Linq.Enumerable.from(this.TeamViewModels()).selectMany(function (sm) {
                            return sm.Players();
                        });
                }
            }
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            ctor: function (gameHub, teamRepository) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._teamRepository = teamRepository;

                var sbrazzi = System.Linq.Enumerable.from(this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeams()).select(function (s) {
                        return new AzureDay.Rome.Client.ViewModels.TeamViewModel(s);
                    }).ToArray(AzureDay.Rome.Client.ViewModels.TeamViewModel);

                this.TeamViewModels = ko.observableArray();

                this.TeamViewModels.push.apply(this.TeamViewModels, sbrazzi);
                this.State = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.StartGameId;
            },
            GameHubOnOnPlayerLeaved: function (sender, tuple) {
                var localPlayer = System.Linq.Enumerable.from(this.ALlPlayers).singleOrDefault(function (sd) {
                        return System.Guid.op_Equality(sd.id, tuple.Item1.id);
                    }, null);
                if (localPlayer == null) {
                    return;
                }

                var team = this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById(tuple.Item2);

                $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: System.String.format("Il giocatore {0} della squadra {1} ci ha lasciato prematuramente.", tuple.Item1.name, team != null ? team.name : null) });
            },
            GameHubOnOnNewPlayerJoined: function (sender, tuple) {
                var team = this.GetTeamById(tuple.Item2);
                team.Players.push(tuple.Item1);

                $.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: System.String.format("Nuovo giocatore {0} della squadra {1}", tuple.Item1.name, team != null ? team.Name : null) });
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                this.State(e);

                if (e !== AzureDay.Rome.Shared.GameState.InRun) {
                    return;
                }
                var width = (((Bridge.global.document.getElementById("gameDiv").offsetWidth - AzureDay.Rome.Client.ViewModels.StartGameViewModel.FinishLineOffset) | 0) - AzureDay.Rome.Client.ViewModels.StartGameViewModel.SpaceShipWidth) | 0;
                this._tapCount = (Bridge.Int.div(width, AzureDay.Rome.Client.ViewModels.StartGameViewModel.FinishLineCount)) | 0;
                System.Console.WriteLine(System.String.format("Width: {0}", [Bridge.box(width, System.Int32)]));
                System.Console.WriteLine(System.String.format("TapCount: {0}", [Bridge.box(this._tapCount, System.Int32)]));
            },
            GameHubOnOnTapCountReceived: function (sender, e) {
                var team = this.GetTeamById(e.Item2);
                team.Score(Bridge.Int.mul(e.Item1, this._tapCount));
                this.TeamViewModels().forEach(function (f) {
                        f.IsWinner(false);
                    });
                System.Linq.Enumerable.from(this.TeamViewModels()).orderByDescending(function (o) {
                        return o.Score();
                    }).first().IsWinner(true);
            },
            StartGame: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$StartGame();
            },
            ReStartGame: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$ReStartGame();
            },
            OnLoad: function (parameters) {
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);

                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$addOnNewPlayerJoined(Bridge.fn.cacheBind(this, this.GameHubOnOnNewPlayerJoined));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$addOnPlayerLeaved(Bridge.fn.cacheBind(this, this.GameHubOnOnPlayerLeaved));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$addOnTapCountReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnTapCountReceived));

                this._gameHub.AzureDay$Rome$Client$Hubs$IBaseHub$Start(Bridge.fn.bind(this, function () {
                    this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$NotifyIAmTheAdmin();
                }));
            },
            OnLeave: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnNewPlayerJoined(Bridge.fn.cacheBind(this, this.GameHubOnOnNewPlayerJoined));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnPlayerLeaved(Bridge.fn.cacheBind(this, this.GameHubOnOnPlayerLeaved));
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            OpenRegistration: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$OpenRegistration();
            },
            GetTeamById: function (id) {
                return System.Linq.Enumerable.from(this.TeamViewModels()).single(function (s) {
                        return System.String.equals(s.Id.toString(), id.toString());
                    });
            }
        }
    });

    Bridge.define("AzureDay.Rome.Client.ViewModels.TeamViewModel", {
        fields: {
            Id: null,
            Name: null,
            CssClass: null,
            Score: null,
            HowMany: null,
            ScreenPosition: null,
            Players: null,
            IsWinner: null
        },
        ctors: {
            init: function () {
                this.Id = new System.Guid();
            },
            ctor: function (team) {
                this.$initialize();
                this.Id = team.id;
                this.Name = team.name;
                this.CssClass = System.String.replaceAll(this.Name, " ", "_");

                this.Score = ko.observable();
                this.HowMany = ko.observable();
                this.ScreenPosition = ko.observable();
                this.IsWinner = ko.observable();
                this.Players = ko.observableArray();

                this.Score.subscribe(Bridge.fn.bind(this, function (value) {
                    this.ScreenPosition(System.String.format("{0}px", [Bridge.box(value, System.Int32)]));
                }));
                this.Players.subscribe(Bridge.fn.bind(this, function (value) {
                    this.HowMany(this.Players().length);
                }));
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
                            return "pages/moveIt.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.MoveItId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Client.ViewModels.MoveItViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return true;
                        }, $t.HtmlLocation = function () {
                            return "pages/startGame.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.StartGameId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Client.ViewModels.StartGameViewModel);
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
                StartGameId: {
                    get: function () {
                        return "startGame";
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

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Client.Hubs.IMoveItHub, AzureDay.Rome.Client.Hubs.Impl.MoveItHub);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Client.Hubs.IGameHub, AzureDay.Rome.Client.Hubs.Impl.GameHub);


                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Client.Repositories.ITeamRepository, AzureDay.Rome.Client.Repositories.Impl.TeamRepository);
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

    Bridge.define("AzureDay.Rome.Client.Hubs.IGameHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.Hubs.IMoveItHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.Repositories.Impl.TeamRepository", {
        inherits: [AzureDay.Rome.Client.Repositories.ITeamRepository],
        alias: [
            "GetTeamById", "AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById",
            "GetTeams", "AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeams"
        ],
        methods: {
            GetTeamById: function (id) {
                var teams = this.GetTeams();
                return System.Linq.Enumerable.from(teams).singleOrDefault(function (sd) {
                        return System.String.equals(sd.id.toString(), id.toString(), 3);
                    }, null);
            },
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

    Bridge.define("AzureDay.Rome.Client.Hubs.Impl.GameHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IGameHub],
        fields: {
            _connection: null
        },
        events: {
            OnGameStateReceived: null,
            OnNewPlayerJoined: null,
            OnPlayerLeaved: null,
            OnTapCountReceived: null
        },
        alias: [
            "addOnGameStateReceived", "AzureDay$Rome$Client$Hubs$IGameHub$addOnGameStateReceived",
            "removeOnGameStateReceived", "AzureDay$Rome$Client$Hubs$IGameHub$removeOnGameStateReceived",
            "addOnNewPlayerJoined", "AzureDay$Rome$Client$Hubs$IGameHub$addOnNewPlayerJoined",
            "removeOnNewPlayerJoined", "AzureDay$Rome$Client$Hubs$IGameHub$removeOnNewPlayerJoined",
            "addOnPlayerLeaved", "AzureDay$Rome$Client$Hubs$IGameHub$addOnPlayerLeaved",
            "removeOnPlayerLeaved", "AzureDay$Rome$Client$Hubs$IGameHub$removeOnPlayerLeaved",
            "addOnTapCountReceived", "AzureDay$Rome$Client$Hubs$IGameHub$addOnTapCountReceived",
            "removeOnTapCountReceived", "AzureDay$Rome$Client$Hubs$IGameHub$removeOnTapCountReceived",
            "Start", "AzureDay$Rome$Client$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Client$Hubs$IBaseHub$Stop",
            "StartGame", "AzureDay$Rome$Client$Hubs$IGameHub$StartGame",
            "OpenRegistration", "AzureDay$Rome$Client$Hubs$IGameHub$OpenRegistration",
            "NotifyIAmTheAdmin", "AzureDay$Rome$Client$Hubs$IGameHub$NotifyIAmTheAdmin",
            "ReStartGame", "AzureDay$Rome$Client$Hubs$IGameHub$ReStartGame"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl("/play").build();

                this._connection.on("gameStateMode", Bridge.fn.bind(this, function (gameState) {
                    !Bridge.staticEquals(this.OnGameStateReceived, null) ? this.OnGameStateReceived(this, gameState) : null;
                }));

                this._connection.on("newPlayerJoined", Bridge.fn.bind(this, function (name, team) {
                    !Bridge.staticEquals(this.OnNewPlayerJoined, null) ? this.OnNewPlayerJoined(this, { Item1: name, Item2: team }) : null;
                }));

                this._connection.on("playerLeaved", Bridge.fn.bind(this, function (name, team) {
                    !Bridge.staticEquals(this.OnPlayerLeaved, null) ? this.OnPlayerLeaved(this, { Item1: name, Item2: team }) : null;
                }));

                this._connection.on("tapCount", Bridge.fn.bind(this, function (name, team) {
                    !Bridge.staticEquals(this.OnTapCountReceived, null) ? this.OnTapCountReceived(this, { Item1: name, Item2: team }) : null;
                }));



            }
        },
        methods: {
            Start: function (onConnected) {
                if (onConnected === void 0) { onConnected = null; }
                this._connection.start().then(function () {
                    !Bridge.staticEquals(onConnected, null) ? onConnected() : null;
                }, function (o) { }).catch(function (o) {
                    Bridge.global.alert(Bridge.toString(o));
                });
            },
            Stop: function () {
                this._connection.stop();
            },
            StartGame: function () {
                this._connection.invoke("startGame");
            },
            OpenRegistration: function () {
                this._connection.invoke("openRegistration");
            },
            NotifyIAmTheAdmin: function () {
                this._connection.invoke("setUpAdmin");
            },
            ReStartGame: function () {
                this._connection.invoke("reStart");
            }
        }
    });

    Bridge.define("AzureDay.Rome.Client.Hubs.Impl.MoveItHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IMoveItHub],
        fields: {
            _connection: null
        },
        events: {
            OnLeftChanged: null,
            OnTopChanged: null
        },
        alias: [
            "addOnLeftChanged", "AzureDay$Rome$Client$Hubs$IMoveItHub$addOnLeftChanged",
            "removeOnLeftChanged", "AzureDay$Rome$Client$Hubs$IMoveItHub$removeOnLeftChanged",
            "addOnTopChanged", "AzureDay$Rome$Client$Hubs$IMoveItHub$addOnTopChanged",
            "removeOnTopChanged", "AzureDay$Rome$Client$Hubs$IMoveItHub$removeOnTopChanged",
            "Start", "AzureDay$Rome$Client$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Client$Hubs$IBaseHub$Stop",
            "SendTop", "AzureDay$Rome$Client$Hubs$IMoveItHub$SendTop",
            "SendLeft", "AzureDay$Rome$Client$Hubs$IMoveItHub$SendLeft"
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
            Start: function (onConnected) {
                if (onConnected === void 0) { onConnected = null; }
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
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vdmVJdFZpZXdNb2RlbC5jcyIsIlZpZXdNb2RlbHMvU3RhcnRHYW1lVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIlJlcG9zaXRvcmllcy9JbXBsL1RlYW1SZXBvc2l0b3J5LmNzIiwiSHVicy9JbXBsL0dhbWVIdWIuY3MiLCJIdWJzL0ltcGwvTW92ZUl0SHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBaUJRQSxPQUFPQTs7Ozs7O2lDQVQrQ0EsSUFBSUE7OzhCQVl6Q0EsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0E7OzRCQUdQQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQSxVQUFpQkE7Ozs7aUNBR2xCQSxLQUFPQTtnQkFFMUJBLFlBQVlBO2dCQUNaQSxrQkFBa0JBLDZCQUFPQSxXQUFZQTtnQkFDckNBLElBQUlBLG1CQUFtQkE7b0JBQ25CQSxNQUFNQSxJQUFJQSxxQ0FBdUJBLDRFQUFvRUEsV0FBVUEsQUFBT0E7O2dCQUMxSEEsaUJBQWlCQSxzREFBdUNBOztnQkFFeERBLElBQUlBLGNBQWNBO29CQUNkQSxNQUFNQSxJQUFJQTs7O2dCQUVkQSxnQkFBZ0JBLGlDQUEwQ0EsWUFBTkE7Z0JBQ3BEQSw0Q0FBZ0NBLEtBQUtBOztrQ0FHakJBLFFBQWVBO2dCQUVuQ0EsMkNBQW1DQSxXQUFXQTtnQkFDOUNBLDRCQUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDM0JUQTs7O2dCQUVuQkEsa0JBQWtCQTtnQkFDbEJBLFdBQVdBLGNBQW9DQSwrQkFBc0JBO2dCQUNyRUEsWUFBWUEsY0FBb0NBLCtCQUFzQkE7O2dCQUV0RUEsc0VBQWlDQTtnQkFD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d0JBLCtCQUFDQSxNQUFLQTtvQkFFaEVBLDZDQUF3QkEsUUFBS0EsQUFBcUNBLHVCQUE4QkEsTUFBS0EsU0FBc0VBLGFBQUtBLFVBQVFBOzs7Z0JBRzVMQSxvQ0FBbUNBLEFBQXdCQSwrQkFBQ0EsTUFBS0E7b0JBRTdEQSwwQ0FBcUJBLFFBQUtBLEFBQXFDQSxvQkFBMkJBLE1BQUtBLFNBQXNFQSxhQUFLQSxVQUFRQTs7O2dCQUd0TEEsZ0NBQStCQSxBQUFxQkEsK0JBQUNBLE1BQUtBO29CQUV0REEsOENBQXlCQSxRQUFLQSxBQUFxQ0Esd0JBQStCQSxNQUFLQSxTQUFzQ0EsYUFBS0EsVUFBUUE7Ozs7Ozs7OzZCQVFoSkE7O2dCQUVkQSw4QkFBOEJBLEFBQXdCQTtvQkFBTUEsa0NBQWFBLFFBQUtBLEFBQXFDQSxnQkFBc0JBO21CQUFPQSxBQUFnQ0Esd0JBQ3JLQSxBQUFnQ0E7b0JBQUtBLG9CQUFhQTs7OztnQkFLN0RBOzs7Z0JBT0FBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDOURBQSxtQkFBb0JBLElBQUlBO2dCQUN4QkEsaUNBQWdDQSxBQUFnQkEsK0JBQUNBO29CQUU3Q0Esd0NBQW1CQSxRQUFLQSxBQUFxQ0Esa0JBQXlCQSxNQUFLQSxPQUFNQTs7Z0JBRXJHQSxrQ0FBaUNBLEFBQWdCQSwrQkFBQ0E7b0JBRTlDQSx5Q0FBb0JBLFFBQUtBLEFBQXFDQSxtQkFBMEJBLE1BQUtBLFFBQU9BOzs7Ozs2QkFJMUZBOztnQkFFZEE7OztnQkFLQUE7OytCQUdnQkE7Z0JBRWhCQSxpQ0FBaUNBOztnQ0FHaEJBO2dCQUVqQkEsa0NBQWtDQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5DbGFzc2VzXG57XG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4gX2NvbXBsZXRlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPigpO1xuXG4gICAgICAgIHByaXZhdGUgRXZlbnRJbmZvIF9ldmVudEluZm87XG4gICAgICAgIHByaXZhdGUgVCBfb2JqO1xuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xucHVibGljIFRhc2s8VEs+IFRhc2tcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlLlRhc2s7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgc3RyaW5nIGV2ZW50TkFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudE5BbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgRnVuYzxULCBzdHJpbmc+IGV2ZW50bmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE51bGxSZWZlcmVuY2VFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV2ZW50IHdpdGggbmFtZSB7MH0gbm90IGZvdW5kIG9uIG9iamVjdCBvZiB0eXBlIHsxfVwiLGV2ZW50TmFtZSx0eXBlb2YoVCkpKTtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcblxuICAgICAgICAgICAgdGhpcy5faGFuZGxlciA9IERlbGVnYXRlLkNyZWF0ZURlbGVnYXRlKHR5cGVvZihUSyksIHRoaXMsIG1ldGhvZEluZm8pO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLlJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9vYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEJyaWRnZS5TcGFmO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgTW92ZUl0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU1vdmVJdEh1YiBfbW92ZUl0SHViO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5Nb3ZlSXRJZDtcclxufVxuICAgICAgICBwcml2YXRlIGludCBfdG9wID0gMDtcbiAgICAgICAgcHJpdmF0ZSBpbnQgX2xlZnQgPSAwO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IFRvcCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBMZWZ0IHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgTW92ZUl0Vmlld01vZGVsKElNb3ZlSXRIdWIgbW92ZUl0SHViKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIgPSBtb3ZlSXRIdWI7XG4gICAgICAgICAgICB0aGlzLlRvcCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX3RvcCkpO1xuICAgICAgICAgICAgdGhpcy5MZWZ0ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fbGVmdCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25MZWZ0Q2hhbmdlZCArPSB0aGlzLk1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PblRvcENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gZTtcbiAgICAgICAgICAgIHRoaXMuVG9wLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGU7XG4gICAgICAgICAgICB0aGlzLkxlZnQuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0YXJ0KCk7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU3RvcCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90b3ArPTEwO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRUb3AodGhpcy5fdG9wKTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJUb3A6IHswfVwiLHRoaXMuX3RvcCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuTGVmdCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnQrPTEwO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRMZWZ0KHRoaXMuX2xlZnQpO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIkxlZnQ6IHswfVwiLHRoaXMuX2xlZnQpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xudXNpbmcgQnJpZGdlO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBTdGFydEdhbWVWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgRmluaXNoTGluZUNvdW50ID0gMjA7XG5cbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgRmluaXNoTGluZU9mZnNldCA9IDE3MDtcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgU3BhY2VTaGlwV2lkdGggPSAxNzg7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElUZWFtUmVwb3NpdG9yeSBfdGVhbVJlcG9zaXRvcnk7XG4gICAgICAgIHByaXZhdGUgaW50IF90YXBDb3VudDtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuU3RhcnRHYW1lSWQ7XHJcbn1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxHYW1lU3RhdGU+IFN0YXRlIHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8VGVhbVZpZXdNb2RlbD4gVGVhbVZpZXdNb2RlbHMgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBTdGFydEdhbWVWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSVRlYW1SZXBvc2l0b3J5IHRlYW1SZXBvc2l0b3J5KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcbiAgICAgICAgICAgIHRoaXMuX3RlYW1SZXBvc2l0b3J5ID0gdGVhbVJlcG9zaXRvcnk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzYnJhenppID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSwgZ2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWw+KShzID0+IG5ldyBUZWFtVmlld01vZGVsKHMpKSkuVG9BcnJheSgpO1xuXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZUFycmF5LlNlbGY8VGVhbVZpZXdNb2RlbD4oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMucHVzaChzYnJhenppKTtcbiAgICAgICAgICAgIHRoaXMuU3RhdGUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8R2FtZVN0YXRlPigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uUGxheWVyTGVhdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBsYXllciA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPih0aGlzLkFMbFBsYXllcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsIGJvb2w+KShzZCA9PiBzZC5JZCA9PSB0dXBsZS5JdGVtMS5JZCkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyID09IG51bGwpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5XYXJuaW5nKHN0cmluZy5Gb3JtYXQoXCJJbCBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9IGNpIGhhIGxhc2NpYXRvIHByZW1hdHVyYW1lbnRlLlwiLHR1cGxlLkl0ZW0xLk5hbWUsdGVhbSE9bnVsbD90ZWFtLk5hbWU6KHN0cmluZyludWxsKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25OZXdQbGF5ZXJKb2luZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8UGxheWVyLCBHdWlkPiB0dXBsZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKHR1cGxlLkl0ZW0yKTtcbiAgICAgICAgICAgIHRlYW0uUGxheWVycy5wdXNoKHR1cGxlLkl0ZW0xKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3Moc3RyaW5nLkZvcm1hdChcIk51b3ZvIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX1cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuU3RhdGUuU2VsZihlKTtcblxuICAgICAgICAgICAgaWYgKGUgIT0gR2FtZVN0YXRlLkluUnVuKSByZXR1cm47XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBHbG9iYWwuRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJnYW1lRGl2XCIpLk9mZnNldFdpZHRoLUZpbmlzaExpbmVPZmZzZXQtU3BhY2VTaGlwV2lkdGg7XG4gICAgICAgICAgICB0aGlzLl90YXBDb3VudCA9IHdpZHRoIC8gRmluaXNoTGluZUNvdW50O1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIldpZHRoOiB7MH1cIix3aWR0aCkpO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlRhcENvdW50OiB7MH1cIix0aGlzLl90YXBDb3VudCkpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPGludCwgR3VpZD4gZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKGUuSXRlbTIpO1xuICAgICAgICAgICAgdGVhbS5TY29yZS5TZWxmKGUuSXRlbTEqdGhpcy5fdGFwQ291bnQpO1xuU3lzdGVtLkFycmF5RXh0ZW5zaW9ucy5Gb3JFYWNoPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPihcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWw+KShmID0+IGYuSXNXaW5uZXIuU2VsZihmYWxzZSkpKTtcblN5c3RlbS5MaW5xLkVudW1lcmFibGUuT3JkZXJCeURlc2NlbmRpbmc8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWwsaW50PiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCwgaW50PikobyA9PiBvLlNjb3JlLlNlbGYoKSkpLkZpcnN0KCkuSXNXaW5uZXIuU2VsZih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RhcnRHYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5SZVN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRhcENvdW50UmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RhcnQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gdGhpcy5fZ2FtZUh1Yi5Ob3RpZnlJQW1UaGVBZG1pbigpKSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgLT0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCAtPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PcGVuUmVnaXN0cmF0aW9uKCk7XG4gICAgICAgIH1cbnByaXZhdGUgVGVhbVZpZXdNb2RlbCBHZXRUZWFtQnlJZChHdWlkIGlkKVxyXG57XHJcbiAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWw+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsLCBib29sPikocyA9PiBzLklkLlRvU3RyaW5nKCkuRXF1YWxzKGlkLlRvU3RyaW5nKCkpKSk7XHJcbn1wcml2YXRlIElFbnVtZXJhYmxlPFBsYXllcj4gQUxsUGxheWVyc1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPih0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4+KShzbSA9PiBzbS5QbGF5ZXJzLlNlbGYoKSkpO1xyXG4gICAgfVxyXG59ICAgIH1cblxuICAgIHB1YmxpYyBjbGFzcyBUZWFtVmlld01vZGVsXG4gICAge1xuICAgICAgICBwdWJsaWMgR3VpZCBJZCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBzdHJpbmcgTmFtZSB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQ3NzQ2xhc3MgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gU2NvcmUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gSG93TWFueSB7IGdldDsgc2V0OyB9XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gU2NyZWVuUG9zaXRpb24geyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8UGxheWVyPiBQbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxib29sPiBJc1dpbm5lciB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIFRlYW1WaWV3TW9kZWwoVGVhbSB0ZWFtKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklkID0gdGVhbS5JZDtcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IHRlYW0uTmFtZTtcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3MgPSB0aGlzLk5hbWUuUmVwbGFjZShcIiBcIiwgXCJfXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlNjb3JlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGludD4oKTtcbiAgICAgICAgICAgIHRoaXMuSG93TWFueSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XG4gICAgICAgICAgICB0aGlzLlNjcmVlblBvc2l0aW9uID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oKTtcbiAgICAgICAgICAgIHRoaXMuSXNXaW5uZXIgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8Ym9vbD4oKTtcbiAgICAgICAgICAgIHRoaXMuUGxheWVycyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFBsYXllcj4oKTtcblxuICAgICAgICAgICAgdGhpcy5TY29yZS5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dFN1YnNjcmliYWJsZTxpbnQ+LnN1YnNjcmliZUZuKSh2YWx1ZSA9PiB0aGlzLlNjcmVlblBvc2l0aW9uLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdmFsdWUpKSkpO1xuICAgICAgICAgICAgdGhpcy5QbGF5ZXJzLnN1YnNjcmliZSgoZ2xvYmFsOjpSZXR5cGVkLmtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPi5zdWJzY3JpYmVGbjIpKHZhbHVlID0+IHRoaXMuSG93TWFueS5TZWxmKHRoaXMuUGxheWVycy5TZWxmKCkuTGVuZ3RoKSkpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscztcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIGNsYXNzIEN1c3RvbVJvdXRlc0NvbmZpZyA6IEJyaWRnZU5hdmlnYXRvckNvbmZpZ0Jhc2VcbiAgICB7XG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IENyZWF0ZVJvdXRlcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxJUGFnZURlc2NyaXB0b3I+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL21vdmVJdC5odG1sXCIsIFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLk1vdmVJdElkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8TW92ZUl0Vmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9zdGFydEdhbWUuaHRtbFwiLCBcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5TdGFydEdhbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPFN0YXJ0R2FtZVZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO3JldHVybiBfbzE7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgalF1ZXJ5IEJvZHkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBIb21lSWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cblxuXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5Nb3ZlSXRJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGw7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbDtcbnVzaW5nIEJyaWRnZTtcbnVzaW5nIEJyaWRnZS5Jb2M7XG51c2luZyBCcmlkZ2UuTWVzc2VuZ2VyO1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG51c2luZyBCcmlkZ2UuU3BhZi5BdHRyaWJ1dGVzO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBwdWJsaWMgY2xhc3MgU3BhZkFwcFxuICAgIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBJSW9jIENvbnRhaW5lcjtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcbiAgICAgICAgICAgIENvbnRhaW5lckNvbmZpZygpOyAvLyBjb25maWcgY29udGFpbmVyXG4gICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIG5hdmlnYXRvclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBRdWVyeVBhcmFtZXRlck5hdmlnYXRpb25IaXN0b3J5PigpO1xuLy8gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBDb21wbGV4T2JqZWN0TmF2aWdhdGlvbkhpc3Rvcnk+KCk7IC8vIGlmIHlvdSBkb24ndCBuZWVkIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxuXG4gICAgICAgICAgICAvLyBtZXNzZW5nZXJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XG5cbiAgICAgICAgICAgIC8vIHZpZXdtb2RlbHNcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xuXG4gICAgICAgICAgICAvLyByZWdpc3RlciBjdXN0b20gcmVzb3VyY2UsIHNlcnZpY2VzLi5cbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNb3ZlSXRIdWIsIE1vdmVJdEh1Yj4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtUmVwb3NpdG9yeSwgVGVhbVJlcG9zaXRvcnk+KCk7XG4gICAgICAgIH1cbiNyZWdpb24gUEFHRVMgSURTXHJcbi8vIHN0YXRpYyBwYWdlcyBpZFxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBIb21lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiaG9tZVwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgTW92ZUl0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwibW92ZUl0XCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBTdGFydEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJzdGFydEdhbWVcIjtcclxuICAgIH1cclxufVxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgI3JlZ2lvbiBNRVNTQUdFU1xuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTWVzc2FnZXNcbiAgICAgICAge1xuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XG5cbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcblxuICAgICAgICAgICAgLy9wdWJsaWMgc3RhdGljIHN0cmluZyBMb2dpbkRvbmUgPT4gXCJMb2dpbkRvbmVcIjtcblxuICAgICAgICB9XG5cblxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cbiAgICAgICAgLy8vIFlvdSBjYW4gcmVnaXN0ZXIgYSB2aWV3bW9kZSBhcyBTaW5nbHIgSW5zdGFuY2UgYWRkaW5nIFwiU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGVcIiB0byB0aGUgY2xhc3NcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xuXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGYuR2V0Q3VzdG9tQXR0cmlidXRlcyh0eXBlb2YoU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGUpLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZShmKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzLkltcGxcbntcbiAgICBjbGFzcyBUZWFtUmVwb3NpdG9yeSA6IElUZWFtUmVwb3NpdG9yeVxuICAgIHtcbiAgICAgICAgcHVibGljIFRlYW0gR2V0VGVhbUJ5SWQoR3VpZCBpZClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW1zID0gdGhpcy5HZXRUZWFtcygpO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbT4odGVhbXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLCBib29sPikoc2QgPT4gc2QuSWQuVG9TdHJpbmcoKS5FcXVhbHMoaWQuVG9TdHJpbmcoKSxTdHJpbmdDb21wYXJpc29uLkludmFyaWFudEN1bHR1cmVJZ25vcmVDYXNlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPFRlYW0+IEdldFRlYW1zKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI3NERCODAwMy0yMzQ4LTQ5OEYtQjc3My0xQzRDRTBGRDY5QTJcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAxXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0xO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGVhbTIgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDJcIiwgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0ZWFtMyA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiOEQ3MjRGMDEtQzlFRS00RjMxLUE4NjUtQUZCRDZBMkQyQkRBXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gM1wiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRlYW00ID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSA0XCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xudXNpbmcgQnJpZGdlLkh0bWw1O1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXG57XG4gICAgY2xhc3MgR2FtZUh1YiA6IElHYW1lSHViXG4gICAge1xuICAgICAgICBwcml2YXRlIEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxQbGF5ZXIsIEd1aWQ+PiBPbk5ld1BsYXllckpvaW5lZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxQbGF5ZXIsIEd1aWQ+PiBPblBsYXllckxlYXZlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxpbnQsIEd1aWQ+PiBPblRhcENvdW50UmVjZWl2ZWQ7XG5cblxuICAgICAgICBwdWJsaWMgR2FtZUh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9wbGF5XCIpLkJ1aWxkKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckpvaW5lZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5Pbk5ld1BsYXllckpvaW5lZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk5ld1BsYXllckpvaW5lZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJwbGF5ZXJMZWF2ZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25QbGF5ZXJMZWF2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25QbGF5ZXJMZWF2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidGFwQ291bnRcIixuZXcgQWN0aW9uPGludCxHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25UYXBDb3VudFJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVGFwQ291bnRSZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8aW50LGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKS5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG9uQ29ubmVjdGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vbkNvbm5lY3RlZC5JbnZva2UoKSk6bnVsbCksIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiB7fSkpXG4gICAgICAgICAgICAgICAgLkNhdGNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic3RhcnRHYW1lXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgT3BlblJlZ2lzdHJhdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwib3BlblJlZ2lzdHJhdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE5vdGlmeUlBbVRoZUFkbWluKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzZXRVcEFkbWluXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgUmVTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInJlU3RhcnRcIik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBNb3ZlSXRIdWIgOiBJTW92ZUl0SHViXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uVG9wQ2hhbmdlZDtcblxuICAgICAgICBwdWJsaWMgTW92ZUl0SHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL21vdmVJdFwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZVRvcFwiLG5ldyBBY3Rpb248aW50PigodG9wKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Ub3BDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9wQ2hhbmdlZC5JbnZva2UodGhpcyx0b3ApKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZUxlZnRcIixuZXcgQWN0aW9uPGludD4oKGxlZnQpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkxlZnRDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTGVmdENoYW5nZWQuSW52b2tlKHRoaXMsbGVmdCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRUb3AoaW50IHRvcClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZFRvcFwiLCB0b3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZExlZnQoaW50IGxlZnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRMZWZ0XCIsIGxlZnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59Il0KfQo=
