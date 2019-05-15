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
        statics: {
            fields: {
                FinishLineOffset: 0,
                SpaceShipWidth: 0
            },
            ctors: {
                init: function () {
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
                this._tapCount = (Bridge.Int.div(width, 100)) | 0;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0NoYXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL01vdmVJdFZpZXdNb2RlbC5jcyIsIlZpZXdNb2RlbHMvU3RhcnRHYW1lVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIlJlcG9zaXRvcmllcy9JbXBsL1RlYW1SZXBvc2l0b3J5LmNzIiwiSHVicy9JbXBsL0NoYXRIdWIuY3MiLCJIdWJzL0ltcGwvR2FtZUh1Yi5jcyIsIkh1YnMvSW1wbC9Nb3ZlSXRIdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFpQlFBLE9BQU9BOzs7Ozs7aUNBVCtDQSxJQUFJQTs7OEJBWXpDQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQTs7NEJBR1BBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBLFVBQWlCQTs7OztpQ0FHbEJBLEtBQU9BO2dCQUUxQkEsWUFBWUE7Z0JBQ1pBLGtCQUFrQkEsNkJBQU9BLFdBQVlBO2dCQUNyQ0EsSUFBSUEsbUJBQW1CQTtvQkFDbkJBLE1BQU1BLElBQUlBLHFDQUF1QkEsNEVBQW9FQSxXQUFVQSxBQUFPQTs7Z0JBQzFIQSxpQkFBaUJBLHNEQUF1Q0E7O2dCQUV4REEsSUFBSUEsY0FBY0E7b0JBQ2RBLE1BQU1BLElBQUlBOzs7Z0JBRWRBLGdCQUFnQkEsaUNBQTBDQSxZQUFOQTtnQkFDcERBLDRDQUFnQ0EsS0FBS0E7O2tDQUdqQkEsUUFBZUE7Z0JBRW5DQSwyQ0FBbUNBLFdBQVdBO2dCQUM5Q0EsNEJBQTRCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzdCWEE7OztnQkFFakJBLGdCQUFnQkE7Z0JBQ2hCQSxzRUFBbUNBOzs7OztnQkFSM0NBLE9BQU9B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QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3pEQUEsbUJBQW9CQSxJQUFJQTtnQkFDeEJBLGlDQUFnQ0EsQUFBZ0JBLCtCQUFDQTtvQkFFN0NBLHdDQUFtQkEsUUFBS0EsQUFBcUNBLGtCQUF5QkEsTUFBS0EsT0FBTUE7O2dCQUVyR0Esa0NBQWlDQSxBQUFnQkEsK0JBQUNBO29CQUU5Q0EseUNBQW9CQSxRQUFLQSxBQUFxQ0EsbUJBQTBCQSxNQUFLQSxRQUFPQTs7Ozs7NkJBSTFGQTs7Z0JBRWRBOzs7Z0JBS0FBOzsrQkFHZ0JBO2dCQUVoQkEsaUNBQWlDQTs7Z0NBR2hCQTtnQkFFakJBLGtDQUFrQ0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3Nlc1xue1xuICAgIGludGVybmFsIGNsYXNzIFdhaXRGb3JNZTxULCBUSz5cbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcblxuICAgICAgICBwcml2YXRlIEV2ZW50SW5mbyBfZXZlbnRJbmZvO1xuICAgICAgICBwcml2YXRlIFQgX29iajtcbiAgICAgICAgcHJpdmF0ZSBEZWxlZ2F0ZSBfaGFuZGxlcjtcbnB1YmxpYyBUYXNrPFRLPiBUYXNrXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZS5UYXNrO1xyXG4gICAgfVxyXG59XG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnROQW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIEZ1bmM8VCwgc3RyaW5nPiBldmVudG5hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnRuYW1lLkludm9rZShvYmopKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBTdWJzY3JpYmUoVCBvYmosIHN0cmluZyBldmVudE5hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mbyA9IHR5cGVvZihUKS5HZXRFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SW5mbyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XG4gICAgICAgICAgICB2YXIgbWV0aG9kSW5mbyA9IHRoaXMuR2V0VHlwZSgpLkdldE1ldGhvZChcIk9uQ29tcGxldGVcIiwgQmluZGluZ0ZsYWdzLk5vblB1YmxpYyB8IEJpbmRpbmdGbGFncy5JbnN0YW5jZSk7XG5cbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcIm1ldGhvZGluZm9cIik7XG5cbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5BZGRFdmVudEhhbmRsZXIob2JqLCB0aGlzLl9oYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBPbkNvbXBsZXRlKG9iamVjdCBzZW5kZXIsIFRLIGhhbmRsZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLlRyeVNldFJlc3VsdChoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIENoYXRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJQ2hhdEh1YiBfY2hhdEh1YjtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuSG9tZUlkO1xyXG59ICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IE1lc3NhZ2UgeyBnZXQ7IHNldDsgfVxuXG5cbiAgICAgICAgcHVibGljIENoYXRWaWV3TW9kZWwoSUNoYXRIdWIgY2hhdEh1YilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY2hhdEh1YiA9IGNoYXRIdWI7XG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLk9uTWVzc2FnZXJlY2VpdmVkICs9IHRoaXMuQ2hhdEh1Yk9uT25NZXNzYWdlcmVjZWl2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgQ2hhdEh1Yk9uT25NZXNzYWdlcmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8c3RyaW5nLCBzdHJpbmc+IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIEdsb2JhbC5BbGVydChlLkl0ZW0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLlN0YXJ0KCk7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLlN0b3AoKTtcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIEdsb2JhbC5BbGVydCh0aGlzLk1lc3NhZ2UuU2VsZigpKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIE1vdmVJdFZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElNb3ZlSXRIdWIgX21vdmVJdEh1YjtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuTW92ZUl0SWQ7XHJcbn1cbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgaW50IF9sZWZ0ID0gMDtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBUb3AgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTGVmdCB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIE1vdmVJdFZpZXdNb2RlbChJTW92ZUl0SHViIG1vdmVJdEh1YilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViID0gbW92ZUl0SHViO1xuICAgICAgICAgICAgdGhpcy5Ub3AgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl90b3ApKTtcbiAgICAgICAgICAgIHRoaXMuTGVmdCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX2xlZnQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uTGVmdENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQ7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25Ub3BDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PblRvcENoYW5nZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PblRvcENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGU7XG4gICAgICAgICAgICB0aGlzLlRvcC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBlO1xuICAgICAgICAgICAgdGhpcy5MZWZ0LlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdGFydCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0b3AoKTtcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdG9wKz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kVG9wKHRoaXMuX3RvcCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVG9wOiB7MH1cIix0aGlzLl90b3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZFRlbkxlZnQoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0Kz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kTGVmdCh0aGlzLl9sZWZ0KTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJMZWZ0OiB7MH1cIix0aGlzLl9sZWZ0KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3NlcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZTtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5TcGFmO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgU3RhcnRHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IEZpbmlzaExpbmVPZmZzZXQgPSAxNzA7XG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IFNwYWNlU2hpcFdpZHRoID0gMTc4O1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJVGVhbVJlcG9zaXRvcnkgX3RlYW1SZXBvc2l0b3J5O1xuICAgICAgICBwcml2YXRlIGludCBfdGFwQ291bnQ7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLlN0YXJ0R2FtZUlkO1xyXG59XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8R2FtZVN0YXRlPiBTdGF0ZSB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFRlYW1WaWV3TW9kZWw+IFRlYW1WaWV3TW9kZWxzIHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgU3RhcnRHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElUZWFtUmVwb3NpdG9yeSB0ZWFtUmVwb3NpdG9yeSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl90ZWFtUmVwb3NpdG9yeSA9IHRlYW1SZXBvc2l0b3J5O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2JyYXp6aSA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbD4odGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbXMoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPikocyA9PiBuZXcgVGVhbVZpZXdNb2RlbChzKSkpLlRvQXJyYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFRlYW1WaWV3TW9kZWw+KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLnB1c2goc2JyYXp6aSk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlN0YXRlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPEdhbWVTdGF0ZT4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblBsYXllckxlYXZlZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbG9jYWxQbGF5ZXIgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4odGhpcy5BTGxQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLCBib29sPikoc2QgPT4gc2QuSWQgPT0gdHVwbGUuSXRlbTEuSWQpKTtcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhzdHJpbmcuRm9ybWF0KFwiSWwgZ2lvY2F0b3JlIHswfSBkZWxsYSBzcXVhZHJhIHsxfSBjaSBoYSBsYXNjaWF0byBwcmVtYXR1cmFtZW50ZS5cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlBsYXllcnMucHVzaCh0dXBsZS5JdGVtMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5TdWNjZXNzKHN0cmluZy5Gb3JtYXQoXCJOdW92byBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9XCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN0YXRlLlNlbGYoZSk7XG5cbiAgICAgICAgICAgIGlmIChlICE9IEdhbWVTdGF0ZS5JblJ1bikgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gR2xvYmFsLkRvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKS5PZmZzZXRXaWR0aC1GaW5pc2hMaW5lT2Zmc2V0LVNwYWNlU2hpcFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fdGFwQ291bnQgPSB3aWR0aCAvIDEwMDtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJXaWR0aDogezB9XCIsd2lkdGgpKTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJUYXBDb3VudDogezB9XCIsdGhpcy5fdGFwQ291bnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuR2V0VGVhbUJ5SWQoZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoZS5JdGVtMSp0aGlzLl90YXBDb3VudCk7XG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWw+KFxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT4gZi5Jc1dpbm5lci5TZWxmKGZhbHNlKSkpO1xuU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5PcmRlckJ5RGVzY2VuZGluZzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCxpbnQ+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsLCBpbnQ+KShvID0+IG8uU2NvcmUuU2VsZigpKSkuRmlyc3QoKS5Jc1dpbm5lci5TZWxmKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydEdhbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcblxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25OZXdQbGF5ZXJKb2luZWQgKz0gdGhpcy5HYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25QbGF5ZXJMZWF2ZWQgKz0gdGhpcy5HYW1lSHViT25PblBsYXllckxlYXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xuXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IHRoaXMuX2dhbWVIdWIuTm90aWZ5SUFtVGhlQWRtaW4oKSkpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25OZXdQbGF5ZXJKb2luZWQgLT0gdGhpcy5HYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25QbGF5ZXJMZWF2ZWQgLT0gdGhpcy5HYW1lSHViT25PblBsYXllckxlYXZlZDtcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgT3BlblJlZ2lzdHJhdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT3BlblJlZ2lzdHJhdGlvbigpO1xuICAgICAgICB9XG5wcml2YXRlIFRlYW1WaWV3TW9kZWwgR2V0VGVhbUJ5SWQoR3VpZCBpZClcclxue1xyXG4gICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCwgYm9vbD4pKHMgPT4gcy5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpKSkpO1xyXG59cHJpdmF0ZSBJRW51bWVyYWJsZTxQbGF5ZXI+IEFMbFBsYXllcnNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4odGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWwsIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+Pikoc20gPT4gc20uUGxheWVycy5TZWxmKCkpKTtcclxuICAgIH1cclxufSAgICB9XG5cbiAgICBwdWJsaWMgY2xhc3MgVGVhbVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHVibGljIEd1aWQgSWQgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgc3RyaW5nIE5hbWUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgc3RyaW5nIENzc0NsYXNzIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IFNjb3JlIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IEhvd01hbnkgeyBnZXQ7IHNldDsgfVxuICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IFNjcmVlblBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFBsYXllcj4gUGxheWVycyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8Ym9vbD4gSXNXaW5uZXIgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBUZWFtVmlld01vZGVsKFRlYW0gdGVhbSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5JZCA9IHRlYW0uSWQ7XG4gICAgICAgICAgICB0aGlzLk5hbWUgPSB0ZWFtLk5hbWU7XG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzID0gdGhpcy5OYW1lLlJlcGxhY2UoXCIgXCIsIFwiX1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5TY29yZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XG4gICAgICAgICAgICB0aGlzLkhvd01hbnkgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8aW50PigpO1xuICAgICAgICAgICAgdGhpcy5TY3JlZW5Qb3NpdGlvbiA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XG4gICAgICAgICAgICB0aGlzLklzV2lubmVyID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGJvb2w+KCk7XG4gICAgICAgICAgICB0aGlzLlBsYXllcnMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxQbGF5ZXI+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuU2NvcmUuc3Vic2NyaWJlKChnbG9iYWw6OlJldHlwZWQua25vY2tvdXQuS25vY2tvdXRTdWJzY3JpYmFibGU8aW50Pi5zdWJzY3JpYmVGbikodmFsdWUgPT4gdGhpcy5TY3JlZW5Qb3NpdGlvbi5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHZhbHVlKSkpKTtcbiAgICAgICAgICAgIHRoaXMuUGxheWVycy5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4uc3Vic2NyaWJlRm4yKSh2YWx1ZSA9PiB0aGlzLkhvd01hbnkuU2VsZih0aGlzLlBsYXllcnMuU2VsZigpLkxlbmd0aCkpKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXG4gICAge1xuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9jaGF0Lmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuSG9tZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8Q2hhdFZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvbW92ZUl0Lmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuTW92ZUl0SWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL3N0YXJ0R2FtZS5odG1sXCIsIFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlN0YXJ0R2FtZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8U3RhcnRHYW1lVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7cmV0dXJuIF9vMTt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBqUXVlcnkgQm9keSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEhvbWVJZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBEaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLk1vdmVJdElkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbDtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsO1xudXNpbmcgQnJpZGdlO1xudXNpbmcgQnJpZGdlLklvYztcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcbnVzaW5nIEJyaWRnZS5TcGFmLkF0dHJpYnV0ZXM7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXG4gICAge1xuICAgICAgICBwdWJsaWMgc3RhdGljIElJb2MgQ29udGFpbmVyO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcbiAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyID0gbmV3IEJyaWRnZUlvYygpO1xuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZXNvbHZlPElOYXZpZ2F0b3I+KCkuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXG5cbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcblxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUNoYXRIdWIsIENoYXRIdWI+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTW92ZUl0SHViLCBNb3ZlSXRIdWI+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbVJlcG9zaXRvcnksIFRlYW1SZXBvc2l0b3J5PigpO1xuICAgICAgICB9XG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgSG9tZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcImhvbWVcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIE1vdmVJdElkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIm1vdmVJdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgU3RhcnRHYW1lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwic3RhcnRHYW1lXCI7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXG4gICAgICAgIHtcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xuXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFJlZ2lzdGVyIGFsbCB0eXBlcyB0aGF0IGVuZCB3aXRoIFwidmlld21vZGVsXCIuXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXG4gICAgICAgICAgICAgICAgLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlR5cGUsIGJvb2w+KSh3ID0+IHcuTmFtZS5Ub0xvd2VyKCkuRW5kc1dpdGgoXCJ2aWV3bW9kZWxcIikpKS5Ub0xpc3QoKTtcblxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8b2JqZWN0PihhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXIoZik7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsXG57XG4gICAgY2xhc3MgVGVhbVJlcG9zaXRvcnkgOiBJVGVhbVJlcG9zaXRvcnlcbiAgICB7XG4gICAgICAgIHB1YmxpYyBUZWFtIEdldFRlYW1CeUlkKEd1aWQgaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtcyA9IHRoaXMuR2V0VGVhbXMoKTtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0+KHRlYW1zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSwgYm9vbD4pKHNkID0+IHNkLklkLlRvU3RyaW5nKCkuRXF1YWxzKGlkLlRvU3RyaW5nKCksU3RyaW5nQ29tcGFyaXNvbi5JbnZhcmlhbnRDdWx0dXJlSWdub3JlQ2FzZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBJRW51bWVyYWJsZTxUZWFtPiBHZXRUZWFtcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtMSA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gMVwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRlYW0yID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RTZBRjJGNy02MTg0LTREQTAtQjJFNC05NzhFREIzRjQzRDFcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAyXCIsICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0yO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGVhbTMgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhENzI0RjAxLUM5RUUtNEYzMS1BODY1LUFGQkQ2QTJEMkJEQVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDNcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0ZWFtNCA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiMEQyQzM3RjctNDlGRS00OEQ5LUExRDMtMUE5MEU3OTQ4QkNDXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gNFwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtNDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBDaGF0SHViIDogSUNoYXRIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcblxuICAgICAgICBwdWJsaWMgQ2hhdEh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9jaGF0XCIpLkJ1aWxkKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiYnJvYWRjYXN0TWVzc2FnZVwiLG5ldyBBY3Rpb248c3RyaW5nLCBzdHJpbmc+KChuYW1lLCBtZXNzYWdlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25NZXNzYWdlcmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25NZXNzYWdlcmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPHN0cmluZyxzdHJpbmc+KG5hbWUsbWVzc2FnZSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxzdHJpbmcsc3RyaW5nPj4gT25NZXNzYWdlcmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoc3RyaW5nIG1lc3NhZ2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwiU2VuZFwiLCBcIkJsYXpvciBDbGllbnRcIiwgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxue1xuICAgIGNsYXNzIEdhbWVIdWIgOiBJR2FtZUh1YlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBIdWJDb25uZWN0aW9uIF9jb25uZWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxHYW1lU3RhdGU+IE9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8aW50LCBHdWlkPj4gT25UYXBDb3VudFJlY2VpdmVkO1xuXG5cbiAgICAgICAgcHVibGljIEdhbWVIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvcGxheVwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiZ2FtZVN0YXRlTW9kZVwiLG5ldyBBY3Rpb248R2FtZVN0YXRlPigoZ2FtZVN0YXRlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkLkludm9rZSh0aGlzLGdhbWVTdGF0ZSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJuZXdQbGF5ZXJKb2luZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25OZXdQbGF5ZXJKb2luZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25OZXdQbGF5ZXJKb2luZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwicGxheWVyTGVhdmVkXCIsbmV3IEFjdGlvbjxQbGF5ZXIsR3VpZD4oKG5hbWUsdGVhbSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uUGxheWVyTGVhdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUGxheWVyTGVhdmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcixnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInRhcENvdW50XCIsbmV3IEFjdGlvbjxpbnQsR3VpZD4oKG5hbWUsdGVhbSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uVGFwQ291bnRSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRhcENvdW50UmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGludCxnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCkuVGhlbigoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBvbkNvbm5lY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+b25Db25uZWN0ZWQuSW52b2tlKCkpOm51bGwpLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4ge30pKVxuICAgICAgICAgICAgICAgIC5DYXRjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInN0YXJ0R2FtZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcIm9wZW5SZWdpc3RyYXRpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBOb3RpZnlJQW1UaGVBZG1pbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic2V0VXBBZG1pblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxue1xuICAgIGNsYXNzIE1vdmVJdEh1YiA6IElNb3ZlSXRIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8aW50PiBPbkxlZnRDaGFuZ2VkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25Ub3BDaGFuZ2VkO1xuXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvbW92ZUl0XCIpLkJ1aWxkKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlVG9wXCIsbmV3IEFjdGlvbjxpbnQ+KCh0b3ApID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblRvcENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Ub3BDaGFuZ2VkLkludm9rZSh0aGlzLHRvcCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlTGVmdFwiLG5ldyBBY3Rpb248aW50PigobGVmdCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTGVmdENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25MZWZ0Q2hhbmdlZC5JbnZva2UodGhpcyxsZWZ0KSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZFRvcChpbnQgdG9wKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kVG9wXCIsIHRvcCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kTGVmdChpbnQgbGVmdClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZExlZnRcIiwgbGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbn0iXQp9Cg==
