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
            Players: null
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
                        return System.Guid.op_Equality(sd.Id, tuple.Item1.Id);
                    }, null);
                if (localPlayer == null) {
                    return;
                }

                var team = this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById(tuple.Item2);

                $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: System.String.format("Il giocatore {0} della squadra {1} ci ha lasciato prematuramente.", tuple.Item1.Name, team != null ? team.Name : null) });
            },
            GameHubOnOnNewPlayerJoined: function (sender, tuple) {
                var team = this.GetTeamById(tuple.Item2);
                team.Players.push(tuple.Item1);

                $.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: System.String.format("Nuovo giocatore {0} della squadra {1}", tuple.Item1.Name, team != null ? team.Name : null) });
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                this.State(e);

                if (e !== AzureDay.Rome.Shared.GameState.InRun) {
                    return;
                }
                var width = (Bridge.global.document.getElementById("gameDiv").offsetWidth - 50) | 0;
                this._tapCount = (Bridge.Int.div(width, 20)) | 0;
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
                this.Id = team.Id;
                this.Name = team.Name;
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
                                        team1 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("74DB8003-2348-498F-B773-1C4CE0FD69A2"), $t.Name = "Team 1", $t);
                                            $enumerator.current = team1;
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {
                                        team2 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("8E6AF2F7-6184-4DA0-B2E4-978EDB3F43D1"), $t.Name = "Team 2", $t);
                                            $enumerator.current = team2;
                                            $step = 2;
                                            return true;
                                    }
                                    case 2: {
                                        team3 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("8D724F01-C9EE-4F31-A865-AFBD6A2D2BDA"), $t.Name = "Team 3", $t);
                                            $enumerator.current = team3;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        team4 = ($t = new AzureDay.Rome.Client.Models.Team(), $t.Id = System.Guid.Parse("0D2C37F7-49FE-48D9-A1D3-1A90E7948BCC"), $t.Name = "Team 4", $t);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0NoYXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL01vdmVJdFZpZXdNb2RlbC5jcyIsIlZpZXdNb2RlbHMvU3RhcnRHYW1lVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIlJlcG9zaXRvcmllcy9JbXBsL1RlYW1SZXBvc2l0b3J5LmNzIiwiSHVicy9JbXBsL0NoYXRIdWIuY3MiLCJIdWJzL0ltcGwvR2FtZUh1Yi5jcyIsIkh1YnMvSW1wbC9Nb3ZlSXRIdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFpQlFBLE9BQU9BOzs7Ozs7aUNBVCtDQSxJQUFJQTs7OEJBWXpDQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQTs7NEJBR1BBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBLFVBQWlCQTs7OztpQ0FHbEJBLEtBQU9BO2dCQUUxQkEsWUFBWUE7Z0JBQ1pBLGtCQUFrQkEsNkJBQU9BLFdBQVlBO2dCQUNyQ0EsSUFBSUEsbUJBQW1CQTtvQkFDbkJBLE1BQU1BLElBQUlBLHFDQUF1QkEsNEVBQW9FQSxXQUFVQSxBQUFPQTs7Z0JBQzFIQSxpQkFBaUJBLHNEQUF1Q0E7O2dCQUV4REEsSUFBSUEsY0FBY0E7b0JBQ2RBLE1BQU1BLElBQUlBOzs7Z0JBRWRBLGdCQUFnQkEsaUNBQTBDQSxZQUFOQTtnQkFDcERBLDRDQUFnQ0EsS0FBS0E7O2tDQUdqQkEsUUFBZUE7Z0JBRW5DQSwyQ0FBbUNBLFdBQVdBO2dCQUM5Q0EsNEJBQTRCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDN0JYQTs7O2dCQUVqQkEsZ0JBQWdCQTtnQkFDaEJB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QUNBO29CQUU3Q0Esd0NBQW1CQSxRQUFLQSxBQUFxQ0Esa0JBQXlCQSxNQUFLQSxPQUFNQTs7Z0JBRXJHQSxrQ0FBaUNBLEFBQWdCQSwrQkFBQ0E7b0JBRTlDQSx5Q0FBb0JBLFFBQUtBLEFBQXFDQSxtQkFBMEJBLE1BQUtBLFFBQU9BOzs7Ozs2QkFJMUZBOztnQkFFZEE7OztnQkFLQUE7OytCQUdnQkE7Z0JBRWhCQSxpQ0FBaUNBOztnQ0FHaEJBO2dCQUVqQkEsa0NBQWtDQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcclxuICAgICAgICBwcml2YXRlIFQgX29iajtcclxuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xyXG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ2hhdFZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJQ2hhdEh1YiBfY2hhdEh1YjtcclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5Ib21lSWQ7XHJcbn0gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBNZXNzYWdlIHsgZ2V0OyBzZXQ7IH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBDaGF0Vmlld01vZGVsKElDaGF0SHViIGNoYXRIdWIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViID0gY2hhdEh1YjtcclxuICAgICAgICAgICAgdGhpcy5fY2hhdEh1Yi5Pbk1lc3NhZ2VyZWNlaXZlZCArPSB0aGlzLkNoYXRIdWJPbk9uTWVzc2FnZXJlY2VpdmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIENoYXRIdWJPbk9uTWVzc2FnZXJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPHN0cmluZywgc3RyaW5nPiBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KGUuSXRlbTEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLlN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGF0SHViLlN0b3AoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEdsb2JhbC5BbGVydCh0aGlzLk1lc3NhZ2UuU2VsZigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xyXG51c2luZyBCcmlkZ2UuU3BhZjtcclxudXNpbmcgUmV0eXBlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3ZlSXRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU1vdmVJdEh1YiBfbW92ZUl0SHViO1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLk1vdmVJdElkO1xyXG59XHJcbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RvcCA9IDA7XHJcbiAgICAgICAgcHJpdmF0ZSBpbnQgX2xlZnQgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBUb3AgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBMZWZ0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIE1vdmVJdFZpZXdNb2RlbChJTW92ZUl0SHViIG1vdmVJdEh1YilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1YiA9IG1vdmVJdEh1YjtcclxuICAgICAgICAgICAgdGhpcy5Ub3AgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl90b3ApKTtcclxuICAgICAgICAgICAgdGhpcy5MZWZ0ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fbGVmdCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uTGVmdENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PblRvcENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGU7XHJcbiAgICAgICAgICAgIHRoaXMuVG9wLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBlO1xyXG4gICAgICAgICAgICB0aGlzLkxlZnQuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdGFydCgpO1xyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0b3AoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fdG9wKz0xMDtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRUb3AodGhpcy5fdG9wKTtcclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlRvcDogezB9XCIsdGhpcy5fdG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW5MZWZ0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQrPTEwO1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZExlZnQodGhpcy5fbGVmdCk7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJMZWZ0OiB7MH1cIix0aGlzLl9sZWZ0KSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3NlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3RhcnRHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1SZXBvc2l0b3J5IF90ZWFtUmVwb3NpdG9yeTtcclxuICAgICAgICBwcml2YXRlIGludCBfdGFwQ291bnQ7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuU3RhcnRHYW1lSWQ7XHJcbn1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPEdhbWVTdGF0ZT4gU3RhdGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8VGVhbVZpZXdNb2RlbD4gVGVhbVZpZXdNb2RlbHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU3RhcnRHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElUZWFtUmVwb3NpdG9yeSB0ZWFtUmVwb3NpdG9yeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xyXG4gICAgICAgICAgICB0aGlzLl90ZWFtUmVwb3NpdG9yeSA9IHRlYW1SZXBvc2l0b3J5O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHNicmF6emkgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5UZWFtLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlRlYW0sIGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPikocyA9PiBuZXcgVGVhbVZpZXdNb2RlbChzKSkpLlRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxUZWFtVmlld01vZGVsPigpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMucHVzaChzYnJhenppKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxHYW1lU3RhdGU+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8UGxheWVyLCBHdWlkPiB0dXBsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBsYXllciA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlBsYXllcj4odGhpcy5BTGxQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlBsYXllciwgYm9vbD4pKHNkID0+IHNkLklkID09IHR1cGxlLkl0ZW0xLklkKSk7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuX3RlYW1SZXBvc2l0b3J5LkdldFRlYW1CeUlkKHR1cGxlLkl0ZW0yKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5XYXJuaW5nKHN0cmluZy5Gb3JtYXQoXCJJbCBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9IGNpIGhhIGxhc2NpYXRvIHByZW1hdHVyYW1lbnRlLlwiLHR1cGxlLkl0ZW0xLk5hbWUsdGVhbSE9bnVsbD90ZWFtLk5hbWU6KHN0cmluZyludWxsKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25OZXdQbGF5ZXJKb2luZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8UGxheWVyLCBHdWlkPiB0dXBsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XHJcbiAgICAgICAgICAgIHRlYW0uUGxheWVycy5wdXNoKHR1cGxlLkl0ZW0xKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5TdWNjZXNzKHN0cmluZy5Gb3JtYXQoXCJOdW92byBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9XCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdGF0ZS5TZWxmKGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUgIT0gR2FtZVN0YXRlLkluUnVuKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IEdsb2JhbC5Eb2N1bWVudC5HZXRFbGVtZW50QnlJZChcImdhbWVEaXZcIikuT2Zmc2V0V2lkdGgtNTA7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcENvdW50ID0gd2lkdGggLyAyMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKGUuSXRlbTIpO1xyXG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoZS5JdGVtMSp0aGlzLl90YXBDb3VudCk7XHJcblN5c3RlbS5BcnJheUV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbD4oXHJcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLlRlYW1WaWV3TW9kZWw+KShmID0+IGYuSXNXaW5uZXIuU2VsZihmYWxzZSkpKTtcclxuU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5PcmRlckJ5RGVzY2VuZGluZzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCxpbnQ+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsLCBpbnQ+KShvID0+IG8uU2NvcmUuU2VsZigpKSkuRmlyc3QoKS5Jc1dpbm5lci5TZWxmKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RhcnRHYW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB0aGlzLl9nYW1lSHViLk5vdGlmeUlBbVRoZUFkbWluKCkpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25OZXdQbGF5ZXJKb2luZWQgLT0gdGhpcy5HYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xyXG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PcGVuUmVnaXN0cmF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIFRlYW1WaWV3TW9kZWwgR2V0VGVhbUJ5SWQoR3VpZCBpZClcclxue1xyXG4gICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCwgYm9vbD4pKHMgPT4gcy5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpKSkpO1xyXG59cHJpdmF0ZSBJRW51bWVyYWJsZTxQbGF5ZXI+IEFMbFBsYXllcnNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuVGVhbVZpZXdNb2RlbCxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5QbGF5ZXI+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5UZWFtVmlld01vZGVsLCBnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLklFbnVtZXJhYmxlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlBsYXllcj4+KShzbSA9PiBzbS5QbGF5ZXJzLlNlbGYoKSkpO1xyXG4gICAgfVxyXG59ICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVGVhbVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBHdWlkIElkIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIE5hbWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQ3NzQ2xhc3MgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8aW50PiBTY29yZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IEhvd01hbnkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBTY3JlZW5Qb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFBsYXllcj4gUGxheWVycyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxib29sPiBJc1dpbm5lciB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUZWFtVmlld01vZGVsKFRlYW0gdGVhbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuSWQgPSB0ZWFtLklkO1xyXG4gICAgICAgICAgICB0aGlzLk5hbWUgPSB0ZWFtLk5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3MgPSB0aGlzLk5hbWUuUmVwbGFjZShcIiBcIiwgXCJfXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5TY29yZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuSG93TWFueSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2NyZWVuUG9zaXRpb24gPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB0aGlzLklzV2lubmVyID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGJvb2w+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuUGxheWVycyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFBsYXllcj4oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuU2NvcmUuc3Vic2NyaWJlKChnbG9iYWw6OlJldHlwZWQua25vY2tvdXQuS25vY2tvdXRTdWJzY3JpYmFibGU8aW50Pi5zdWJzY3JpYmVGbikodmFsdWUgPT4gdGhpcy5TY3JlZW5Qb3NpdGlvbi5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHZhbHVlKSkpKTtcclxuICAgICAgICAgICAgdGhpcy5QbGF5ZXJzLnN1YnNjcmliZSgoZ2xvYmFsOjpSZXR5cGVkLmtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlBsYXllcj4uc3Vic2NyaWJlRm4yKSh2YWx1ZSA9PiB0aGlzLkhvd01hbnkuU2VsZih0aGlzLlBsYXllcnMuU2VsZigpLkxlbmd0aCkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscztcclxudXNpbmcgQnJpZGdlLmpRdWVyeTI7XHJcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXHJcbntcclxuICAgIGNsYXNzIEN1c3RvbVJvdXRlc0NvbmZpZyA6IEJyaWRnZU5hdmlnYXRvckNvbmZpZ0Jhc2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PElQYWdlRGVzY3JpcHRvcj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvY2hhdC5odG1sXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuSG9tZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxDaGF0Vmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL21vdmVJdC5odG1sXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuTW92ZUl0SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPE1vdmVJdFZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9zdGFydEdhbWUuaHRtbFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlN0YXJ0R2FtZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxTdGFydEdhbWVWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO3JldHVybiBfbzE7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgalF1ZXJ5IEJvZHkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBIb21lSWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLk1vdmVJdElkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbDtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbDtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSW9jO1xyXG51c2luZyBCcmlkZ2UuTWVzc2VuZ2VyO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3BhZkFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlc29sdmU8SU5hdmlnYXRvcj4oKS5Jbml0TmF2aWdhdGlvbigpOyAvLyBpbml0IG5hdmlnYXRpb25cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XHJcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxyXG5cclxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXHJcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElDaGF0SHViLCBDaGF0SHViPigpO1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTW92ZUl0SHViLCBNb3ZlSXRIdWI+KCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtUmVwb3NpdG9yeSwgVGVhbVJlcG9zaXRvcnk+KCk7XHJcbiAgICAgICAgfVxyXG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgSG9tZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcImhvbWVcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIE1vdmVJdElkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIm1vdmVJdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgU3RhcnRHYW1lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwic3RhcnRHYW1lXCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcclxuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgY2xhc3MgR2xvYmFsU2VuZGVyIHsgfTtcclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBSZWdpc3RlciBhbGwgdHlwZXMgdGhhdCBlbmQgd2l0aCBcInZpZXdtb2RlbFwiLlxyXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIFJlZ2lzdGVyQWxsVmlld01vZGVscygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcclxuICAgICAgICAgICAgICAgIC5XaGVyZSgoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlN5c3RlbS5UeXBlLCBib29sPikodyA9PiB3Lk5hbWUuVG9Mb3dlcigpLkVuZHNXaXRoKFwidmlld21vZGVsXCIpKSkuVG9MaXN0KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PG9iamVjdD4oYXR0cmlidXRlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyKGYpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsXHJcbntcclxuICAgIGNsYXNzIFRlYW1SZXBvc2l0b3J5IDogSVRlYW1SZXBvc2l0b3J5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRlYW0gR2V0VGVhbUJ5SWQoR3VpZCBpZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtcyA9IHRoaXMuR2V0VGVhbXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlRlYW0+KHRlYW1zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuTW9kZWxzLlRlYW0sIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpLFN0cmluZ0NvbXBhcmlzb24uSW52YXJpYW50Q3VsdHVyZUlnbm9yZUNhc2UpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxyXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAxXCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB0ZWFtMiA9IG5ldyBUZWFtXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcclxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gMlwiLCAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB0ZWFtMyA9IG5ldyBUZWFtXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhENzI0RjAxLUM5RUUtNEYzMS1BODY1LUFGQkQ2QTJEMkJEQVwiKSxcclxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gM1wiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdGVhbTQgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDRcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXHJcbntcclxuICAgIGNsYXNzIENoYXRIdWIgOiBJQ2hhdEh1YlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcclxuXHJcbiAgICAgICAgcHVibGljIENoYXRIdWIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL2NoYXRcIikuQnVpbGQoKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcImJyb2FkY2FzdE1lc3NhZ2VcIixuZXcgQWN0aW9uPHN0cmluZywgc3RyaW5nPigobmFtZSwgbWVzc2FnZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Pbk1lc3NhZ2VyZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk1lc3NhZ2VyZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8c3RyaW5nLHN0cmluZz4obmFtZSxtZXNzYWdlKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8c3RyaW5nLHN0cmluZz4+IE9uTWVzc2FnZXJlY2VpdmVkO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoc3RyaW5nIG1lc3NhZ2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcIlNlbmRcIiwgXCJCbGF6b3IgQ2xpZW50XCIsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcclxuICAgICAgICB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5Nb2RlbHM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxyXG57XHJcbiAgICBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxHYW1lU3RhdGU+IE9uR2FtZVN0YXRlUmVjZWl2ZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxQbGF5ZXIsIEd1aWQ+PiBPbk5ld1BsYXllckpvaW5lZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uUGxheWVyTGVhdmVkO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8aW50LCBHdWlkPj4gT25UYXBDb3VudFJlY2VpdmVkO1xyXG5cclxuXHJcbiAgICAgICAgcHVibGljIEdhbWVIdWIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL3BsYXlcIikuQnVpbGQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkLkludm9rZSh0aGlzLGdhbWVTdGF0ZSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJuZXdQbGF5ZXJKb2luZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySm9pbmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJwbGF5ZXJMZWF2ZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uUGxheWVyTGVhdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUGxheWVyTGVhdmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50Lk1vZGVscy5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ0YXBDb3VudFwiLG5ldyBBY3Rpb248aW50LEd1aWQ+KChuYW1lLHRlYW0pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25UYXBDb3VudFJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVGFwQ291bnRSZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8aW50LGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpLlRoZW4oKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gb25Db25uZWN0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pm9uQ29ubmVjdGVkLkludm9rZSgpKTpudWxsKSwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IHt9KSlcclxuICAgICAgICAgICAgICAgIC5DYXRjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInN0YXJ0R2FtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJvcGVuUmVnaXN0cmF0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTm90aWZ5SUFtVGhlQWRtaW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzZXRVcEFkbWluXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXHJcbntcclxuICAgIGNsYXNzIE1vdmVJdEh1YiA6IElNb3ZlSXRIdWJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uTGVmdENoYW5nZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uVG9wQ2hhbmdlZDtcclxuXHJcbiAgICAgICAgcHVibGljIE1vdmVJdEh1YigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvbW92ZUl0XCIpLkJ1aWxkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ1cGRhdGVUb3BcIixuZXcgQWN0aW9uPGludD4oKHRvcCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PblRvcENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Ub3BDaGFuZ2VkLkludm9rZSh0aGlzLHRvcCkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZUxlZnRcIixuZXcgQWN0aW9uPGludD4oKGxlZnQpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25MZWZ0Q2hhbmdlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkxlZnRDaGFuZ2VkLkludm9rZSh0aGlzLGxlZnQpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2VuZFRvcChpbnQgdG9wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZFRvcFwiLCB0b3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2VuZExlZnQoaW50IGxlZnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kTGVmdFwiLCBsZWZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn0iXQp9Cg==
