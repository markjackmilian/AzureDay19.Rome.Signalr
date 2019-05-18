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

    Bridge.define("AzureDay.Rome.Client.ViewModels.Models.TeamViewModel", {
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

                var teams = System.Linq.Enumerable.from(this._teamRepository.AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeams()).select(function (s) {
                        return new AzureDay.Rome.Client.ViewModels.Models.TeamViewModel(s);
                    }).ToArray(AzureDay.Rome.Client.ViewModels.Models.TeamViewModel);
                this.TeamViewModels = ko.observableArray();

                this.TeamViewModels.push.apply(this.TeamViewModels, teams);
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

                switch (e) {
                    case AzureDay.Rome.Shared.GameState.Closed: 
                        this.ResetTeams();
                        break;
                    case AzureDay.Rome.Shared.GameState.Register: 
                        break;
                    case AzureDay.Rome.Shared.GameState.InRun: 
                        var width = (((Bridge.global.document.getElementById("gameDiv").offsetWidth - AzureDay.Rome.Client.ViewModels.StartGameViewModel.FinishLineOffset) | 0) - AzureDay.Rome.Client.ViewModels.StartGameViewModel.SpaceShipWidth) | 0;
                        this._tapCount = (Bridge.Int.div(width, AzureDay.Rome.Remote.SharedConfiguration.FinishLine)) | 0;
                        break;
                    case AzureDay.Rome.Shared.GameState.Finished: 
                        break;
                    default: 
                        throw new System.ArgumentOutOfRangeException.$ctor3("e", Bridge.box(e, AzureDay.Rome.Shared.GameState, System.Enum.toStringFn(AzureDay.Rome.Shared.GameState)), null);
                }

            },
            ResetTeams: function () {
                this.TeamViewModels().forEach(function (f) {
                        f.Players.removeAll();
                        f.Score(0);
                        f.IsWinner(false);
                    });
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
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$addOnTooManyPlayers(Bridge.fn.cacheBind(this, this.OnTooManyPlayers));

                this._gameHub.AzureDay$Rome$Client$Hubs$IBaseHub$Start(Bridge.fn.bind(this, function () {
                    this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$NotifyIAmTheAdmin();
                }));
            },
            OnTooManyPlayers: function (sender, e) {
                $.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: "Troppi utenti.. giocatore escluso. :(" });
            },
            OnLeave: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnNewPlayerJoined(Bridge.fn.cacheBind(this, this.GameHubOnOnNewPlayerJoined));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnPlayerLeaved(Bridge.fn.cacheBind(this, this.GameHubOnOnPlayerLeaved));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnTapCountReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnTapCountReceived));
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$removeOnTooManyPlayers(Bridge.fn.cacheBind(this, this.OnTooManyPlayers));

                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            OpenRegistration: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$OpenRegistration();
            },
            StopGame: function () {
                this._gameHub.AzureDay$Rome$Client$Hubs$IGameHub$StopGame();
            },
            GetTeamById: function (id) {
                return System.Linq.Enumerable.from(this.TeamViewModels()).single(function (s) {
                        return System.String.equals(s.Id.toString(), id.toString());
                    });
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.DataSources.ITeamsDataSource", {
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

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Remote.DataSources.ITeamsDataSource, AzureDay.Rome.Remote.DataSources.TeamsDataSource);


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
        fields: {
            _teamsDataSource: null
        },
        alias: [
            "GetTeamById", "AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeamById",
            "GetTeams", "AzureDay$Rome$Client$Repositories$ITeamRepository$GetTeams"
        ],
        ctors: {
            ctor: function (teamsDataSource) {
                this.$initialize();
                this._teamsDataSource = teamsDataSource;
            }
        },
        methods: {
            GetTeamById: function (id) {
                var teams = this.GetTeams();
                return System.Linq.Enumerable.from(teams).singleOrDefault(function (sd) {
                        return System.String.equals(sd.id.toString(), id.toString(), 3);
                    }, null);
            },
            GetTeams: function () {
                return this._teamsDataSource.AzureDay$Rome$Remote$DataSources$ITeamsDataSource$GetTeams();
            }
        }
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

    Bridge.define("AzureDay.Rome.Client.Hubs.Impl.GameHub", {
        inherits: [AzureDay.Rome.Client.Hubs.IGameHub],
        fields: {
            _connection: null
        },
        events: {
            OnGameStateReceived: null,
            OnNewPlayerJoined: null,
            OnPlayerLeaved: null,
            OnTapCountReceived: null,
            OnTooManyPlayers: null
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
            "addOnTooManyPlayers", "AzureDay$Rome$Client$Hubs$IGameHub$addOnTooManyPlayers",
            "removeOnTooManyPlayers", "AzureDay$Rome$Client$Hubs$IGameHub$removeOnTooManyPlayers",
            "Start", "AzureDay$Rome$Client$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Client$Hubs$IBaseHub$Stop",
            "StartGame", "AzureDay$Rome$Client$Hubs$IGameHub$StartGame",
            "OpenRegistration", "AzureDay$Rome$Client$Hubs$IGameHub$OpenRegistration",
            "NotifyIAmTheAdmin", "AzureDay$Rome$Client$Hubs$IGameHub$NotifyIAmTheAdmin",
            "ReStartGame", "AzureDay$Rome$Client$Hubs$IGameHub$ReStartGame",
            "StopGame", "AzureDay$Rome$Client$Hubs$IGameHub$StopGame"
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

                this._connection.on("tooManyPlayers", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnTooManyPlayers, null) ? this.OnTooManyPlayers(this, null) : null;
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
                System.Console.WriteLine("restart!");
                this._connection.invoke("reStart");
            },
            StopGame: function () {
                this._connection.invoke("StopGame");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vZGVscy9UZWFtVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1N0YXJ0R2FtZVZpZXdNb2RlbC5jcyIsIkN1c3RvbVJvdXRlc0NvbmZpZy5jcyIsIlNwYWZBcHAuY3MiLCJSZXBvc2l0b3JpZXMvSW1wbC9UZWFtUmVwb3NpdG9yeS5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIiwiSHVicy9JbXBsL01vdmVJdEh1Yi5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzlCWEE7O2dCQUVq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QkFLQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkMzRUFBLG1CQUFvQkEsSUFBSUE7Z0JBQ3hCQSxpQ0FBZ0NBLEFBQWdCQSwrQkFBQ0E7b0JBRTdDQSx3Q0FBbUJBLFFBQUtBLEFBQXFDQSxrQkFBeUJBLE1BQUtBLE9BQU1BOztnQkFFckdBLGtDQUFpQ0EsQUFBZ0JBLCtCQUFDQTtvQkFFOUNBLHlDQUFvQkEsUUFBS0EsQUFBcUNBLG1CQUEwQkEsTUFBS0EsUUFBT0E7Ozs7OzZCQUkxRkE7O2dCQUVkQTs7O2dCQUtBQTs7K0JBR2dCQTtnQkFFaEJBLGlDQUFpQ0E7O2dDQUdoQkE7Z0JBRWpCQSxrQ0FBa0NBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXNcbntcbiAgICBpbnRlcm5hbCBjbGFzcyBXYWl0Rm9yTWU8VCwgVEs+XG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPiBfY29tcGxldGUgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcbiAgICAgICAgcHJpdmF0ZSBUIF9vYmo7XG4gICAgICAgIHByaXZhdGUgRGVsZWdhdGUgX2hhbmRsZXI7XG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBzdHJpbmcgZXZlbnROQW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50bmFtZS5JbnZva2Uob2JqKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgU3Vic2NyaWJlKFQgb2JqLCBzdHJpbmcgZXZlbnROYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9vYmogPSBvYmo7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8gPSB0eXBlb2YoVCkuR2V0RXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTnVsbFJlZmVyZW5jZUV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiRXZlbnQgd2l0aCBuYW1lIHswfSBub3QgZm91bmQgb24gb2JqZWN0IG9mIHR5cGUgezF9XCIsZXZlbnROYW1lLHR5cGVvZihUKSkpO1xuICAgICAgICAgICAgdmFyIG1ldGhvZEluZm8gPSB0aGlzLkdldFR5cGUoKS5HZXRNZXRob2QoXCJPbkNvbXBsZXRlXCIsIEJpbmRpbmdGbGFncy5Ob25QdWJsaWMgfCBCaW5kaW5nRmxhZ3MuSW5zdGFuY2UpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kSW5mbyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJtZXRob2RpbmZvXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVyID0gRGVsZWdhdGUuQ3JlYXRlRGVsZWdhdGUodHlwZW9mKFRLKSwgdGhpcywgbWV0aG9kSW5mbyk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uQWRkRXZlbnRIYW5kbGVyKG9iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgT25Db21wbGV0ZShvYmplY3Qgc2VuZGVyLCBUSyBoYW5kbGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uUmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX29iaiwgdGhpcy5faGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5UcnlTZXRSZXN1bHQoaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgVGVhbVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHVibGljIEd1aWQgSWQgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgc3RyaW5nIE5hbWUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgc3RyaW5nIENzc0NsYXNzIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IFNjb3JlIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxpbnQ+IEhvd01hbnkgeyBnZXQ7IHNldDsgfVxuICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IFNjcmVlblBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFBsYXllcj4gUGxheWVycyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8Ym9vbD4gSXNXaW5uZXIgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBUZWFtVmlld01vZGVsKFRlYW0gdGVhbSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5JZCA9IHRlYW0uSWQ7XG4gICAgICAgICAgICB0aGlzLk5hbWUgPSB0ZWFtLk5hbWU7XG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzID0gdGhpcy5OYW1lLlJlcGxhY2UoXCIgXCIsIFwiX1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5TY29yZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XG4gICAgICAgICAgICB0aGlzLkhvd01hbnkgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8aW50PigpO1xuICAgICAgICAgICAgdGhpcy5TY3JlZW5Qb3NpdGlvbiA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XG4gICAgICAgICAgICB0aGlzLklzV2lubmVyID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGJvb2w+KCk7XG4gICAgICAgICAgICB0aGlzLlBsYXllcnMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxQbGF5ZXI+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuU2NvcmUuc3Vic2NyaWJlKChnbG9iYWw6OlJldHlwZWQua25vY2tvdXQuS25vY2tvdXRTdWJzY3JpYmFibGU8aW50Pi5zdWJzY3JpYmVGbikodmFsdWUgPT4gdGhpcy5TY3JlZW5Qb3NpdGlvbi5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHZhbHVlKSkpKTtcbiAgICAgICAgICAgIHRoaXMuUGxheWVycy5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4uc3Vic2NyaWJlRm4yKSh2YWx1ZSA9PiB0aGlzLkhvd01hbnkuU2VsZih0aGlzLlBsYXllcnMuU2VsZigpLkxlbmd0aCkpKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIE1vdmVJdFZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElNb3ZlSXRIdWIgX21vdmVJdEh1YjtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuTW92ZUl0SWQ7XHJcbn1cbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgaW50IF9sZWZ0ID0gMDtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBUb3AgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTGVmdCB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIE1vdmVJdFZpZXdNb2RlbChJTW92ZUl0SHViIG1vdmVJdEh1YilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViID0gbW92ZUl0SHViO1xuICAgICAgICAgICAgdGhpcy5Ub3AgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl90b3ApKTtcbiAgICAgICAgICAgIHRoaXMuTGVmdCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX2xlZnQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uTGVmdENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQ7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25Ub3BDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PblRvcENoYW5nZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PblRvcENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGU7XG4gICAgICAgICAgICB0aGlzLlRvcC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBlO1xuICAgICAgICAgICAgdGhpcy5MZWZ0LlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdGFydCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0b3AoKTtcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdG9wKz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kVG9wKHRoaXMuX3RvcCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVG9wOiB7MH1cIix0aGlzLl90b3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZFRlbkxlZnQoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0Kz0xMDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kTGVmdCh0aGlzLl9sZWZ0KTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJMZWZ0OiB7MH1cIix0aGlzLl9sZWZ0KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3NlcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2U7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFN0YXJ0R2FtZVZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXG4gICAge1xuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBGaW5pc2hMaW5lT2Zmc2V0ID0gMTcwO1xuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBTcGFjZVNoaXBXaWR0aCA9IDE3ODtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1SZXBvc2l0b3J5IF90ZWFtUmVwb3NpdG9yeTtcbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RhcENvdW50O1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5TdGFydEdhbWVJZDtcclxufVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPEdhbWVTdGF0ZT4gU3RhdGUgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxUZWFtVmlld01vZGVsPiBUZWFtVmlld01vZGVscyB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIFN0YXJ0R2FtZVZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJVGVhbVJlcG9zaXRvcnkgdGVhbVJlcG9zaXRvcnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xuICAgICAgICAgICAgdGhpcy5fdGVhbVJlcG9zaXRvcnkgPSB0ZWFtUmVwb3NpdG9yeTtcblxuICAgICAgICAgICAgdmFyIHRlYW1zID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4odGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbXMoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKHMgPT4gbmV3IFRlYW1WaWV3TW9kZWwocykpKS5Ub0FycmF5KCk7XG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZUFycmF5LlNlbGY8VGVhbVZpZXdNb2RlbD4oKTtcblxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscy5wdXNoKHRlYW1zKTtcbiAgICAgICAgICAgIHRoaXMuU3RhdGUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8R2FtZVN0YXRlPigpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8UGxheWVyLCBHdWlkPiB0dXBsZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxvY2FsUGxheWVyID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+KHRoaXMuQUxsUGxheWVycywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllciwgYm9vbD4pKHNkID0+IHNkLklkID09IHR1cGxlLkl0ZW0xLklkKSk7XG4gICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuX3RlYW1SZXBvc2l0b3J5LkdldFRlYW1CeUlkKHR1cGxlLkl0ZW0yKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoc3RyaW5nLkZvcm1hdChcIklsIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX0gY2kgaGEgbGFzY2lhdG8gcHJlbWF0dXJhbWVudGUuXCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xuICAgICAgICAgICAgdGVhbS5QbGF5ZXJzLnB1c2godHVwbGUuSXRlbTEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBOb3RpZmljYXRpb24uU3VjY2VzcyhzdHJpbmcuRm9ybWF0KFwiTnVvdm8gZ2lvY2F0b3JlIHswfSBkZWxsYSBzcXVhZHJhIHsxfVwiLHR1cGxlLkl0ZW0xLk5hbWUsdGVhbSE9bnVsbD90ZWFtLk5hbWU6KHN0cmluZyludWxsKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdGF0ZS5TZWxmKGUpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuQ2xvc2VkOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlc2V0VGVhbXMoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuUmVnaXN0ZXI6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkluUnVuOlxuICAgICAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBHbG9iYWwuRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJnYW1lRGl2XCIpLk9mZnNldFdpZHRoLUZpbmlzaExpbmVPZmZzZXQtU3BhY2VTaGlwV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhcENvdW50ID0gd2lkdGggLyBTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkZpbmlzaGVkOlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwiZVwiLCBlLCBudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFJlc2V0VGVhbXMoKVxuICAgICAgICB7XG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmLlBsYXllcnMucmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICAgICAgZi5TY29yZS5TZWxmKDApO1xuICAgICAgICAgICAgICAgIGYuSXNXaW5uZXIuU2VsZihmYWxzZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuR2V0VGVhbUJ5SWQoZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoZS5JdGVtMSp0aGlzLl90YXBDb3VudCk7XG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPihcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPikoZiA9PiBmLklzV2lubmVyLlNlbGYoZmFsc2UpKSk7XG5TeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk9yZGVyQnlEZXNjZW5kaW5nPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCxpbnQ+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgaW50PikobyA9PiBvLlNjb3JlLlNlbGYoKSkpLkZpcnN0KCkuSXNXaW5uZXIuU2VsZih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RhcnRHYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5SZVN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRhcENvdW50UmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgKz0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xuXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IHRoaXMuX2dhbWVIdWIuTm90aWZ5SUFtVGhlQWRtaW4oKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uVG9vTWFueVBsYXllcnMob2JqZWN0IHNlbmRlciwgRXZlbnRBcmdzIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5XYXJuaW5nKFwiVHJvcHBpIHV0ZW50aS4uIGdpb2NhdG9yZSBlc2NsdXNvLiA6KFwiKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uTmV3UGxheWVySm9pbmVkIC09IHRoaXMuR2FtZUh1Yk9uT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVGFwQ291bnRSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uVGFwQ291bnRSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Ub29NYW55UGxheWVycyAtPSB0aGlzLk9uVG9vTWFueVBsYXllcnM7XG5cbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgT3BlblJlZ2lzdHJhdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT3BlblJlZ2lzdHJhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0b3BHYW1lKCk7XG4gICAgICAgIH1cbnByaXZhdGUgVGVhbVZpZXdNb2RlbCBHZXRUZWFtQnlJZChHdWlkIGlkKVxyXG57XHJcbiAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsIGJvb2w+KShzID0+IHMuSWQuVG9TdHJpbmcoKS5FcXVhbHMoaWQuVG9TdHJpbmcoKSkpKTtcclxufXByaXZhdGUgSUVudW1lcmFibGU8UGxheWVyPiBBTGxQbGF5ZXJzXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPih0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+Pikoc20gPT4gc20uUGxheWVycy5TZWxmKCkpKTtcclxuICAgIH1cclxufSAgICB9XG59IiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzO1xudXNpbmcgQnJpZGdlLmpRdWVyeTI7XG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgY2xhc3MgQ3VzdG9tUm91dGVzQ29uZmlnIDogQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZVxuICAgIHtcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PElQYWdlRGVzY3JpcHRvcj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvbW92ZUl0Lmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuTW92ZUl0SWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL3N0YXJ0R2FtZS5odG1sXCIsIFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlN0YXJ0R2FtZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8U3RhcnRHYW1lVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7cmV0dXJuIF9vMTt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBqUXVlcnkgQm9keSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEhvbWVJZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBEaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLk1vdmVJdElkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbDtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuRGF0YVNvdXJjZXM7XG51c2luZyBCcmlkZ2U7XG51c2luZyBCcmlkZ2UuSW9jO1xudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgcHVibGljIGNsYXNzIFNwYWZBcHBcbiAgICB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXIgPSBuZXcgQnJpZGdlSW9jKCk7XG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlc29sdmU8SU5hdmlnYXRvcj4oKS5Jbml0TmF2aWdhdGlvbigpOyAvLyBpbml0IG5hdmlnYXRpb25cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBDb250YWluZXJDb25maWcoKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBuYXZpZ2F0b3JcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElOYXZpZ2F0b3IsIEJyaWRnZU5hdmlnYXRvcldpdGhSb3V0aW5nPigpO1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgUXVlcnlQYXJhbWV0ZXJOYXZpZ2F0aW9uSGlzdG9yeT4oKTtcbi8vICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgQ29tcGxleE9iamVjdE5hdmlnYXRpb25IaXN0b3J5PigpOyAvLyBpZiB5b3UgZG9uJ3QgbmVlZCBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXI8SU5hdmlnYXRvckNvbmZpZ3VyYXRvciwgQ3VzdG9tUm91dGVzQ29uZmlnPigpOyBcblxuICAgICAgICAgICAgLy8gbWVzc2VuZ2VyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTWVzc2VuZ2VyLCBNZXNzZW5nZXIuTWVzc2VuZ2VyPigpO1xuXG4gICAgICAgICAgICAvLyB2aWV3bW9kZWxzXG4gICAgICAgICAgICBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKTtcblxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY3VzdG9tIHJlc291cmNlLCBzZXJ2aWNlcy4uXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTW92ZUl0SHViLCBNb3ZlSXRIdWI+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SVRlYW1zRGF0YVNvdXJjZSwgVGVhbXNEYXRhU291cmNlPigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtUmVwb3NpdG9yeSwgVGVhbVJlcG9zaXRvcnk+KCk7XG4gICAgICAgIH1cbiNyZWdpb24gUEFHRVMgSURTXHJcbi8vIHN0YXRpYyBwYWdlcyBpZFxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBIb21lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiaG9tZVwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgTW92ZUl0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwibW92ZUl0XCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBTdGFydEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJzdGFydEdhbWVcIjtcclxuICAgIH1cclxufVxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgI3JlZ2lvbiBNRVNTQUdFU1xuICAgICAgICAvLyBtZXNzZW5nZXIgaGVscGVyIGZvciBnbG9iYWwgbWVzc2FnZXMgYW5kIG1lc3NhZ2VzIGlkc1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTWVzc2FnZXNcbiAgICAgICAge1xuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XG5cbiAgICAgICAgICAgIHB1YmxpYyBzdGF0aWMgR2xvYmFsU2VuZGVyIFNlbmRlciA9IG5ldyBHbG9iYWxTZW5kZXIoKTtcblxuICAgICAgICAgICAgLy9wdWJsaWMgc3RhdGljIHN0cmluZyBMb2dpbkRvbmUgPT4gXCJMb2dpbkRvbmVcIjtcblxuICAgICAgICB9XG5cblxuICAgICAgICAjZW5kcmVnaW9uXG5cbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cbiAgICAgICAgLy8vIFlvdSBjYW4gcmVnaXN0ZXIgYSB2aWV3bW9kZSBhcyBTaW5nbHIgSW5zdGFuY2UgYWRkaW5nIFwiU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGVcIiB0byB0aGUgY2xhc3NcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdE1hbnk8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSxnbG9iYWw6OlN5c3RlbS5UeXBlPihBcHBEb21haW4uQ3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uUmVmbGVjdGlvbi5Bc3NlbWJseSwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OlN5c3RlbS5UeXBlPj4pKHMgPT4gcy5HZXRUeXBlcygpKSlcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xuXG4gICAgICAgICAgICB0eXBlcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uVHlwZT4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGYuR2V0Q3VzdG9tQXR0cmlidXRlcyh0eXBlb2YoU2luZ2xlSW5zdGFuY2VBdHRyaWJ1dGUpLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZShmKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbFxue1xuICAgIGNsYXNzIFRlYW1SZXBvc2l0b3J5IDogSVRlYW1SZXBvc2l0b3J5XG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElUZWFtc0RhdGFTb3VyY2UgX3RlYW1zRGF0YVNvdXJjZTtcblxuICAgICAgICBwdWJsaWMgVGVhbVJlcG9zaXRvcnkoSVRlYW1zRGF0YVNvdXJjZSB0ZWFtc0RhdGFTb3VyY2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RlYW1zRGF0YVNvdXJjZSA9IHRlYW1zRGF0YVNvdXJjZTtcbiAgICAgICAgfSAgICBcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBUZWFtIEdldFRlYW1CeUlkKEd1aWQgaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtcyA9IHRoaXMuR2V0VGVhbXMoKTtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0+KHRlYW1zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSwgYm9vbD4pKHNkID0+IHNkLklkLlRvU3RyaW5nKCkuRXF1YWxzKGlkLlRvU3RyaW5nKCksU3RyaW5nQ29tcGFyaXNvbi5JbnZhcmlhbnRDdWx0dXJlSWdub3JlQ2FzZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBJRW51bWVyYWJsZTxUZWFtPiBHZXRUZWFtcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZWFtc0RhdGFTb3VyY2UuR2V0VGVhbXMoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuRGF0YVNvdXJjZXNcbntcbiAgICBjbGFzcyBUZWFtc0RhdGFTb3VyY2UgOiBJVGVhbXNEYXRhU291cmNlXG4gICAge1xuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbTEgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjc0REI4MDAzLTIzNDgtNDk4Ri1CNzczLTFDNENFMEZENjlBMlwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDFcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTE7XG5cbiAgICAgICAgICAgIHZhciB0ZWFtMiA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiOEU2QUYyRjctNjE4NC00REEwLUIyRTQtOTc4RURCM0Y0M0QxXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlRlYW0gMlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMjtcblxuICAgICAgICAgICAgdmFyIHRlYW0zID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RDcyNEYwMS1DOUVFLTRGMzEtQTg2NS1BRkJENkEyRDJCREFcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiVGVhbSAzXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0zO1xuXG4gICAgICAgICAgICB2YXIgdGVhbTQgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjBEMkMzN0Y3LTQ5RkUtNDhEOS1BMUQzLTFBOTBFNzk0OEJDQ1wiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJUZWFtIDRcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTQ7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxue1xuICAgIGNsYXNzIEdhbWVIdWIgOiBJR2FtZUh1YlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBIdWJDb25uZWN0aW9uIF9jb25uZWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxHYW1lU3RhdGU+IE9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8aW50LCBHdWlkPj4gT25UYXBDb3VudFJlY2VpdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uVG9vTWFueVBsYXllcnM7XG5cblxuICAgICAgICBwdWJsaWMgR2FtZUh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9wbGF5XCIpLkJ1aWxkKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckpvaW5lZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5Pbk5ld1BsYXllckpvaW5lZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk5ld1BsYXllckpvaW5lZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJwbGF5ZXJMZWF2ZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25QbGF5ZXJMZWF2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25QbGF5ZXJMZWF2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidGFwQ291bnRcIixuZXcgQWN0aW9uPGludCxHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25UYXBDb3VudFJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVGFwQ291bnRSZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8aW50LGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidG9vTWFueVBsYXllcnNcIixuZXcgQWN0aW9uKCgpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblRvb01hbnlQbGF5ZXJzIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9vTWFueVBsYXllcnMuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpLlRoZW4oKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gb25Db25uZWN0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pm9uQ29ubmVjdGVkLkludm9rZSgpKTpudWxsKSwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IHt9KSlcbiAgICAgICAgICAgICAgICAuQ2F0Y2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IEdsb2JhbC5BbGVydChvLlRvU3RyaW5nKCkpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzdGFydEdhbWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJvcGVuUmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgTm90aWZ5SUFtVGhlQWRtaW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInNldFVwQWRtaW5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHRvZG9cbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwicmVzdGFydCFcIik7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInJlU3RhcnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wR2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwiU3RvcEdhbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBNb3ZlSXRIdWIgOiBJTW92ZUl0SHViXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uVG9wQ2hhbmdlZDtcblxuICAgICAgICBwdWJsaWMgTW92ZUl0SHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL21vdmVJdFwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZVRvcFwiLG5ldyBBY3Rpb248aW50PigodG9wKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Ub3BDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9wQ2hhbmdlZC5JbnZva2UodGhpcyx0b3ApKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZUxlZnRcIixuZXcgQWN0aW9uPGludD4oKGxlZnQpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkxlZnRDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTGVmdENoYW5nZWQuSW52b2tlKHRoaXMsbGVmdCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRUb3AoaW50IHRvcClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZFRvcFwiLCB0b3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZExlZnQoaW50IGxlZnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRMZWZ0XCIsIGxlZnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59Il0KfQo=
