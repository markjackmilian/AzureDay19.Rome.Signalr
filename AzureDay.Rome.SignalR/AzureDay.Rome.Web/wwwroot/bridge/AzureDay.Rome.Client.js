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

    Bridge.define("AzureDay.Rome.Client.Models.GameState", {
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

    Bridge.define("AzureDay.Rome.Client.Models.Player", {
        fields: {
            Id: null,
            Name: null,
            ConnectionId: null
        },
        ctors: {
            init: function () {
                this.Id = new System.Guid();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Client.Models.Team", {
        fields: {
            Id: null,
            Name: null,
            Players: null,
            Order: 0
        },
        ctors: {
            init: function () {
                this.Id = new System.Guid();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Client.Repositories.ITeamRepository", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Client.ViewModels.ChatViewModel", {
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
                this._chatHub.AzureDay$Rome$Client$Hubs$IChatHub$addOnMessagereceived(Bridge.fn.cacheBind(this, this.ChatHubOnOnMessagereceived));
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
                this._chatHub.AzureDay$Rome$Client$Hubs$IBaseHub$Start(void 0);
                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            },
            OnLeave: function () {
                this._chatHub.AzureDay$Rome$Client$Hubs$IBaseHub$Stop();
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            Send: function () {
                Bridge.global.alert(this.Message());
            }
        }
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
        fields: {
            _gameHub: null,
            _teamRepository: null,
            Players: null,
            GameState: null,
            Team1Score: null,
            Team2Score: null,
            Team3Score: null,
            Team4Score: null
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


                this.Players = ko.observableArray();
                this.GameState = ko.observable();

                this.Team1Score = ko.observable();
                this.Team2Score = ko.observable();
                this.Team3Score = ko.observable();
                this.Team4Score = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.StartGameId;
            },
            GameHubOnOnPlayerLeaved: function (sender, tuple) {
                var localPlayer = System.Linq.Enumerable.from(this.Players()).singleOrDefault(function (sd) {
                        return System.Guid.op_Equality(sd.Id, tuple.Item1.Id);
                    }, null);
                if (localPlayer == null) {
                    return;
                }

                this.Players.remove(localPlayer);
                var team = this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById(tuple.Item2);

                Bridge.global.alert(System.String.format("Il giocatore {0} della squadra {1} ci ha lasciato prematuramente.", tuple.Item1.Name, team != null ? team.Name : null));
            },
            GameHubOnOnNewPlayerJoined: function (sender, tuple) {
                this.Players.push(tuple.Item1);
                var team = this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById(tuple.Item2);

                Bridge.global.alert(System.String.format("Nuovo giocatore {0} della squadra {1}", tuple.Item1.Name, team != null ? team.Name : null));
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                System.Console.WriteLine(System.Enum.toString(AzureDay.Rome.Client.Models.GameState, e));
                this.GameState(e);
            },
            GameHubOnOnTapCountReceived: function (sender, e) {
                var team = this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById(e.Item2);
                var actions = Bridge.fn.bind(this, function (_o1) {
                        _o1.add(1, Bridge.fn.bind(this, function () {
                            this.Team1Score(e.Item1);
                        }));
                        _o1.add(2, Bridge.fn.bind(this, function () {
                            this.Team2Score(e.Item1);
                        }));
                        _o1.add(3, Bridge.fn.bind(this, function () {
                            this.Team3Score(e.Item1);
                        }));
                        _o1.add(4, Bridge.fn.bind(this, function () {
                            this.Team4Score(e.Item1);
                        }));
                        return _o1;
                    })(new (System.Collections.Generic.Dictionary$2(System.Int32,Function))());

                actions.get(team.Order)();
            },
            StartGame: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$StartGame();
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
                            return "pages/chat.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.HomeId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Client.ViewModels.ChatViewModel);
                        }, $t));
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

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Client.Hubs.IChatHub, AzureDay.Rome.Client.Hubs.Impl.ChatHub);
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

    Bridge.define("AzureDay.Rome.Client.Hubs.IChatHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IBaseHub],
        $kind: "interface"
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
                        return System.String.equals(sd.Id.toString(), id.toString(), 3);
                    }, null);
            },
            GetTeams: function () {
                return new (Bridge.GeneratorEnumerable$1(AzureDay.Rome.Client.Models.Team))(Bridge.fn.bind(this, function ()  {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        team1,
                        $t,
                        team2,
                        team3,
                        team4,
                        $async_e;

                    var $enumerator = new (Bridge.GeneratorEnumerator$1(AzureDay.Rome.Client.Models.Team))(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        team1 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"), $t.Name = "Team 1", $t.Order = 1, $t);
                                            $enumerator.current = team1;
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {
                                        team2 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"), $t.Name = "Team 2", $t.Order = 2, $t);
                                            $enumerator.current = team2;
                                            $step = 2;
                                            return true;
                                    }
                                    case 2: {
                                        team3 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"), $t.Name = "Team 3", $t.Order = 3, $t);
                                            $enumerator.current = team3;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        team4 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"), $t.Name = "Team 4", $t.Order = 4, $t);
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

    Bridge.define("AzureDay.Rome.Client.Hubs.Impl.ChatHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IChatHub],
        fields: {
            _connection: null
        },
        events: {
            OnMessagereceived: null
        },
        alias: [
            "addOnMessagereceived", "AzureDay$Rome$Client$Hubs$IChatHub$addOnMessagereceived",
            "removeOnMessagereceived", "AzureDay$Rome$Client$Hubs$IChatHub$removeOnMessagereceived",
            "Send", "AzureDay$Rome$Client$Hubs$IChatHub$Send",
            "Start", "AzureDay$Rome$Client$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Client$Hubs$IBaseHub$Stop"
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
            Start: function (onConnected) {
                if (onConnected === void 0) { onConnected = null; }
                this._connection.start();
            },
            Stop: function () {
                this._connection.stop();
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
            "NotifyIAmTheAdmin", "AzureDay$Rome$Client$Hubs$IGameHub$NotifyIAmTheAdmin"
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0NoYXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL01vdmVJdFZpZXdNb2RlbC5jcyIsIlZpZXdNb2RlbHMvU3RhcnRHYW1lVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIlJlcG9zaXRvcmllcy9JbXBsL1RlYW1SZXBvc2l0b3J5LmNzIiwiSHVicy9JbXBsL0NoYXRIdWIuY3MiLCJIdWJzL0ltcGwvR2FtZUh1Yi5jcyIsIkh1YnMvSW1wbC9Nb3ZlSXRIdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFpQlFBLE9BQU9BOzs7Ozs7aUNBVCtDQSxJQUFJQTs7OEJBWXpDQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQTs7NEJBR1BBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBLFVBQWlCQTs7OztpQ0FHbEJBLEtBQU9BO2dCQUUxQkEsWUFBWUE7Z0JBQ1pBLGtCQUFrQkEsNkJBQU9BLFdBQVlBO2dCQUNyQ0EsSUFBSUEsbUJBQW1CQTtvQkFDbkJBLE1BQU1BLElBQUlBLHFDQUF1QkEsNEVBQW9FQSxXQUFVQSxBQUFPQTs7Z0JBQzFIQSxpQkFBaUJBLHNEQUF1Q0E7O2dCQUV4REEsSUFBSUEsY0FBY0E7b0JBQ2RBLE1BQU1BLElBQUlBOzs7Z0JBRWRBLGdCQUFnQkEsaUNBQTBDQSxZQUFOQTtnQkFDcERBLDRDQUFnQ0EsS0FBS0E7O2tDQUdqQkEsUUFBZUE7Z0JBRW5DQSwyQ0FBbUNBLFdBQVdBO2dCQUM5Q0EsNEJBQTRCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzdCWEE7OztnQkFFakJBLGdC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QUV4QkEscUNBQW9DQSxBQUFzQkEsK0JBQUNBO29CQUV2REEsK0NBQTBCQSxRQUFLQSxBQUFxQ0EseUJBQWdDQSxNQUFLQSxhQUFZQTs7O2dCQUd6SEEsdUNBQXNDQSxBQUF3QkEsK0JBQUNBLE1BQUtBO29CQUVoRUEsNkNBQXdCQSxRQUFLQSxBQUFxQ0EsdUJBQThCQSxNQUFLQSxTQUE2RUEsYUFBS0EsVUFBUUE7OztnQkFHbk1BLG9DQUFtQ0EsQUFBd0JBLCtCQUFDQSxNQUFLQTtvQkFFN0RBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsU0FBNkVBLGFBQUtBLFVBQVFBOzs7Z0JBRzdMQSxnQ0FBK0JBLEFBQXFCQSwrQkFBQ0EsTUFBS0E7b0JBRXREQSw4Q0FBeUJBLFFBQUtBLEFBQXFDQSx3QkFBK0JBLE1BQUtBLFNBQXNDQSxhQUFLQSxVQUFRQTs7Ozs7Ozs7NkJBUWhKQTs7Z0JBRWRBLDhCQUE4QkEsQUFBd0JBO29CQUFNQSxrQ0FBYUEsUUFBS0EsQUFBcUNBLGdCQUFzQkE7bUJBQU9BLEFBQWdDQSx3QkFDcktBLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs3REE7OztnQkFPQUE7OztnQkFLQUE7OztnQkFLQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkN6REFBLG1CQUFvQkEsSUFBSUE7Z0JBQ3hCQSxpQ0FBZ0NBLEFBQWdCQSwrQkFBQ0E7b0JBRTdDQSx3Q0FBbUJBLFFBQUtBLEFBQXFDQSxrQkFBeUJBLE1BQUtBLE9BQU1BOztnQkFFckdBLGtDQUFpQ0EsQUFBZ0JBLCtCQUFDQTtvQkFFOUNBLHlDQUFvQkEsUUFBS0EsQUFBcUNBLG1CQUEwQkEsTUFBS0EsUUFBT0E7Ozs7OzZCQUkxRkE7O2dCQUVkQTs7O2dCQUtBQTs7K0JBR2dCQTtnQkFFaEJBLGlDQUFpQ0E7O2dDQUdoQkE7Z0JBRWpCQSxrQ0FBa0NBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXNcbntcbiAgICBpbnRlcm5hbCBjbGFzcyBXYWl0Rm9yTWU8VCwgVEs+XG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPiBfY29tcGxldGUgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcbiAgICAgICAgcHJpdmF0ZSBUIF9vYmo7XG4gICAgICAgIHByaXZhdGUgRGVsZWdhdGUgX2hhbmRsZXI7XG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBzdHJpbmcgZXZlbnROQW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50bmFtZS5JbnZva2Uob2JqKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgU3Vic2NyaWJlKFQgb2JqLCBzdHJpbmcgZXZlbnROYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9vYmogPSBvYmo7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8gPSB0eXBlb2YoVCkuR2V0RXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTnVsbFJlZmVyZW5jZUV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiRXZlbnQgd2l0aCBuYW1lIHswfSBub3QgZm91bmQgb24gb2JqZWN0IG9mIHR5cGUgezF9XCIsZXZlbnROYW1lLHR5cGVvZihUKSkpO1xuICAgICAgICAgICAgdmFyIG1ldGhvZEluZm8gPSB0aGlzLkdldFR5cGUoKS5HZXRNZXRob2QoXCJPbkNvbXBsZXRlXCIsIEJpbmRpbmdGbGFncy5Ob25QdWJsaWMgfCBCaW5kaW5nRmxhZ3MuSW5zdGFuY2UpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kSW5mbyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJtZXRob2RpbmZvXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVyID0gRGVsZWdhdGUuQ3JlYXRlRGVsZWdhdGUodHlwZW9mKFRLKSwgdGhpcywgbWV0aG9kSW5mbyk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uQWRkRXZlbnRIYW5kbGVyKG9iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgT25Db21wbGV0ZShvYmplY3Qgc2VuZGVyLCBUSyBoYW5kbGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uUmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX29iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5UcnlTZXRSZXN1bHQoaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBDaGF0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUNoYXRIdWIgX2NoYXRIdWI7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkhvbWVJZDtcclxufSAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBNZXNzYWdlIHsgZ2V0OyBzZXQ7IH1cblxuXG4gICAgICAgIHB1YmxpYyBDaGF0Vmlld01vZGVsKElDaGF0SHViIGNoYXRIdWIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYXRIdWIgPSBjaGF0SHViO1xuICAgICAgICAgICAgdGhpcy5fY2hhdEh1Yi5Pbk1lc3NhZ2VyZWNlaXZlZCArPSB0aGlzLkNoYXRIdWJPbk9uTWVzc2FnZXJlY2VpdmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIENoYXRIdWJPbk9uTWVzc2FnZXJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPHN0cmluZywgc3RyaW5nPiBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoZS5JdGVtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY2hhdEh1Yi5TdGFydCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY2hhdEh1Yi5TdG9wKCk7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQodGhpcy5NZXNzYWdlLlNlbGYoKSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBNb3ZlSXRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTW92ZUl0SHViIF9tb3ZlSXRIdWI7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLk1vdmVJdElkO1xyXG59XG4gICAgICAgIHByaXZhdGUgaW50IF90b3AgPSAwO1xuICAgICAgICBwcml2YXRlIGludCBfbGVmdCA9IDA7XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gVG9wIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IExlZnQgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRWaWV3TW9kZWwoSU1vdmVJdEh1YiBtb3ZlSXRIdWIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1YiA9IG1vdmVJdEh1YjtcbiAgICAgICAgICAgIHRoaXMuVG9wID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fdG9wKSk7XG4gICAgICAgICAgICB0aGlzLkxlZnQgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl9sZWZ0KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PbkxlZnRDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PbkxlZnRDaGFuZ2VkO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uVG9wQ2hhbmdlZCArPSB0aGlzLk1vdmVJdEh1Yk9uT25Ub3BDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25Ub3BDaGFuZ2VkKG9iamVjdCBzZW5kZXIsIGludCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90b3AgPSBlO1xuICAgICAgICAgICAgdGhpcy5Ub3AuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PbkxlZnRDaGFuZ2VkKG9iamVjdCBzZW5kZXIsIGludCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gZTtcbiAgICAgICAgICAgIHRoaXMuTGVmdC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU3RhcnQoKTtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdG9wKCk7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZFRlbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcCs9MTA7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZFRvcCh0aGlzLl90b3ApO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlRvcDogezB9XCIsdGhpcy5fdG9wKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW5MZWZ0KClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbGVmdCs9MTA7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZExlZnQodGhpcy5fbGVmdCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiTGVmdDogezB9XCIsdGhpcy5fbGVmdCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFN0YXJ0R2FtZVZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElUZWFtUmVwb3NpdG9yeSBfdGVhbVJlcG9zaXRvcnk7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLlN0YXJ0R2FtZUlkO1xyXG59ICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFBsYXllcj4gUGxheWVycyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8R2FtZVN0YXRlPiBHYW1lU3RhdGUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gVGVhbTFTY29yZSB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8aW50PiBUZWFtMlNjb3JlIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IFRlYW0zU2NvcmUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gVGVhbTRTY29yZSB7IGdldDsgc2V0OyB9XG5cblxuICAgICAgICBwdWJsaWMgU3RhcnRHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElUZWFtUmVwb3NpdG9yeSB0ZWFtUmVwb3NpdG9yeSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl90ZWFtUmVwb3NpdG9yeSA9IHRlYW1SZXBvc2l0b3J5O1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHRoaXMuUGxheWVycyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFBsYXllcj4oKTtcbiAgICAgICAgICAgIHRoaXMuR2FtZVN0YXRlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPEdhbWVTdGF0ZT4oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5UZWFtMVNjb3JlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGludD4oKTtcbiAgICAgICAgICAgIHRoaXMuVGVhbTJTY29yZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XG4gICAgICAgICAgICB0aGlzLlRlYW0zU2NvcmUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8aW50PigpO1xuICAgICAgICAgICAgdGhpcy5UZWFtNFNjb3JlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGludD4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblBsYXllckxlYXZlZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbG9jYWxQbGF5ZXIgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5QbGF5ZXI+KHRoaXMuUGxheWVycy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHMuUGxheWVyLCBib29sPikoc2QgPT4gc2QuSWQgPT0gdHVwbGUuSXRlbTEuSWQpKTtcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuUGxheWVycy5yZW1vdmUobG9jYWxQbGF5ZXIpO1xuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEdsb2JhbC5BbGVydChzdHJpbmcuRm9ybWF0KFwiSWwgZ2lvY2F0b3JlIHswfSBkZWxsYSBzcXVhZHJhIHsxfSBjaSBoYSBsYXNjaWF0byBwcmVtYXR1cmFtZW50ZS5cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuUGxheWVycy5wdXNoKHR1cGxlLkl0ZW0xKTtcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xuXG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoc3RyaW5nLkZvcm1hdChcIk51b3ZvIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX1cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKGUuVG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB0aGlzLkdhbWVTdGF0ZS5TZWxmKGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPGludCwgR3VpZD4gZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtQnlJZChlLkl0ZW0yKTtcbiAgICAgICAgICAgIHZhciBhY3Rpb25zID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8aW50LCBBY3Rpb24+KCksKF9vMSk9PntfbzEuQWRkKDEsKCkgPT4gdGhpcy5UZWFtMVNjb3JlLlNlbGYoZS5JdGVtMSkpO19vMS5BZGQoMiwoKSA9PiB0aGlzLlRlYW0yU2NvcmUuU2VsZihlLkl0ZW0xKSk7X28xLkFkZCgzLCgpID0+IHRoaXMuVGVhbTNTY29yZS5TZWxmKGUuSXRlbTEpKTtfbzEuQWRkKDQsKCkgPT4gdGhpcy5UZWFtNFNjb3JlLlNlbGYoZS5JdGVtMSkpO3JldHVybiBfbzE7fSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFjdGlvbnNbdGVhbS5PcmRlcl0uSW52b2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRhcENvdW50UmVjZWl2ZWQgKz0gR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpPT4gdGhpcy5fZ2FtZUh1Yi5Ob3RpZnlJQW1UaGVBZG1pbigpKSk7XG4gICAgICAgIH1cblxuICAgICAgXG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uTmV3UGxheWVySm9pbmVkIC09IHRoaXMuR2FtZUh1Yk9uT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9wZW5SZWdpc3RyYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXG4gICAge1xuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9jaGF0Lmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuSG9tZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8Q2hhdFZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvbW92ZUl0Lmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuTW92ZUl0SWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL3N0YXJ0R2FtZS5odG1sXCIsIFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlN0YXJ0R2FtZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8U3RhcnRHYW1lVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7cmV0dXJuIF9vMTt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBqUXVlcnkgQm9keSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEhvbWVJZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBEaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLk1vdmVJdElkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbDtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsO1xudXNpbmcgQnJpZGdlO1xudXNpbmcgQnJpZGdlLklvYztcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcbnVzaW5nIEJyaWRnZS5TcGFmLkF0dHJpYnV0ZXM7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXG4gICAge1xuICAgICAgICBwdWJsaWMgc3RhdGljIElJb2MgQ29udGFpbmVyO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcbiAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyID0gbmV3IEJyaWRnZUlvYygpO1xuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZXNvbHZlPElOYXZpZ2F0b3I+KCkuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXG5cbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcblxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUNoYXRIdWIsIENoYXRIdWI+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTW92ZUl0SHViLCBNb3ZlSXRIdWI+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbVJlcG9zaXRvcnksIFRlYW1SZXBvc2l0b3J5PigpO1xuICAgICAgICB9XG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgSG9tZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcImhvbWVcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIE1vdmVJdElkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIm1vdmVJdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgU3RhcnRHYW1lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwic3RhcnRHYW1lXCI7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXG4gICAgICAgIHtcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xuXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFJlZ2lzdGVyIGFsbCB0eXBlcyB0aGF0IGVuZCB3aXRoIFwidmlld21vZGVsXCIuXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXG4gICAgICAgICAgICAgICAgLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlR5cGUsIGJvb2w+KSh3ID0+IHcuTmFtZS5Ub0xvd2VyKCkuRW5kc1dpdGgoXCJ2aWV3bW9kZWxcIikpKS5Ub0xpc3QoKTtcblxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8b2JqZWN0PihhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXIoZik7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHM7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbFxue1xuICAgIGNsYXNzIFRlYW1SZXBvc2l0b3J5IDogSVRlYW1SZXBvc2l0b3J5XG4gICAge1xuICAgICAgICBwdWJsaWMgVGVhbSBHZXRUZWFtQnlJZChHdWlkIGlkKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbXMgPSB0aGlzLkdldFRlYW1zKCk7XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHMuVGVhbT4odGVhbXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHMuVGVhbSwgYm9vbD4pKHNkID0+IHNkLklkLlRvU3RyaW5nKCkuRXF1YWxzKGlkLlRvU3RyaW5nKCksU3RyaW5nQ29tcGFyaXNvbi5JbnZhcmlhbnRDdWx0dXJlSWdub3JlQ2FzZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBJRW51bWVyYWJsZTxUZWFtPiBHZXRUZWFtcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtMSA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gMVwiLFxuICAgICAgICAgICAgICAgIE9yZGVyID0gMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRlYW0yID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RTZBRjJGNy02MTg0LTREQTAtQjJFNC05NzhFREIzRjQzRDFcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAyXCIsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIE9yZGVyID0gMlxuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0yO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGVhbTMgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhENzI0RjAxLUM5RUUtNEYzMS1BODY1LUFGQkQ2QTJEMkJEQVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDNcIixcbiAgICAgICAgICAgICAgICBPcmRlciA9IDNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0ZWFtNCA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiMEQyQzM3RjctNDlGRS00OEQ5LUExRDMtMUE5MEU3OTQ4QkNDXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gNFwiLFxuICAgICAgICAgICAgICAgIE9yZGVyID0gNFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtNDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBDaGF0SHViIDogSUNoYXRIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcblxuICAgICAgICBwdWJsaWMgQ2hhdEh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9jaGF0XCIpLkJ1aWxkKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiYnJvYWRjYXN0TWVzc2FnZVwiLG5ldyBBY3Rpb248c3RyaW5nLCBzdHJpbmc+KChuYW1lLCBtZXNzYWdlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25NZXNzYWdlcmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25NZXNzYWdlcmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPHN0cmluZyxzdHJpbmc+KG5hbWUsbWVzc2FnZSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxzdHJpbmcsc3RyaW5nPj4gT25NZXNzYWdlcmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoc3RyaW5nIG1lc3NhZ2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwiU2VuZFwiLCBcIkJsYXpvciBDbGllbnRcIiwgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8R2FtZVN0YXRlPiBPbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uUGxheWVyTGVhdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPGludCwgR3VpZD4+IE9uVGFwQ291bnRSZWNlaXZlZDtcblxuXG4gICAgICAgIHB1YmxpYyBHYW1lSHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL3BsYXlcIikuQnVpbGQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcImdhbWVTdGF0ZU1vZGVcIixuZXcgQWN0aW9uPEdhbWVTdGF0ZT4oKGdhbWVTdGF0ZSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZC5JbnZva2UodGhpcyxnYW1lU3RhdGUpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwibmV3UGxheWVySm9pbmVkXCIsbmV3IEFjdGlvbjxQbGF5ZXIsR3VpZD4oKG5hbWUsdGVhbSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySm9pbmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJwbGF5ZXJMZWF2ZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25QbGF5ZXJMZWF2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25QbGF5ZXJMZWF2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlBsYXllcixnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInRhcENvdW50XCIsbmV3IEFjdGlvbjxpbnQsR3VpZD4oKG5hbWUsdGVhbSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uVGFwQ291bnRSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRhcENvdW50UmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGludCxnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCkuVGhlbigoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBvbkNvbm5lY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+b25Db25uZWN0ZWQuSW52b2tlKCkpOm51bGwpLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4ge30pKVxuICAgICAgICAgICAgICAgIC5DYXRjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInN0YXJ0R2FtZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcIm9wZW5SZWdpc3RyYXRpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBOb3RpZnlJQW1UaGVBZG1pbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic2V0VXBBZG1pblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxue1xuICAgIGNsYXNzIE1vdmVJdEh1YiA6IElNb3ZlSXRIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8aW50PiBPbkxlZnRDaGFuZ2VkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25Ub3BDaGFuZ2VkO1xuXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvbW92ZUl0XCIpLkJ1aWxkKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlVG9wXCIsbmV3IEFjdGlvbjxpbnQ+KCh0b3ApID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblRvcENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Ub3BDaGFuZ2VkLkludm9rZSh0aGlzLHRvcCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlTGVmdFwiLG5ldyBBY3Rpb248aW50PigobGVmdCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTGVmdENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25MZWZ0Q2hhbmdlZC5JbnZva2UodGhpcyxsZWZ0KSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZFRvcChpbnQgdG9wKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kVG9wXCIsIHRvcCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kTGVmdChpbnQgbGVmdClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZExlZnRcIiwgbGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbn0iXQp9Cg==
