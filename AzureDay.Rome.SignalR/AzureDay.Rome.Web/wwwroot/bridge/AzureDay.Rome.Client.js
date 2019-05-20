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
                    this.ScreenPosition(System.String.format("{0}px", [Bridge.box(value, System.Double, System.Double.format, System.Double.getHashCode)]));
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
                        System.Console.WriteLine(System.String.format("Width: {0}", [Bridge.box(width, System.Int32)]));
                        System.Console.WriteLine(System.String.format("FinishLine: {0}", [Bridge.box(AzureDay.Rome.Remote.SharedConfiguration.FinishLine, System.Int32)]));
                        System.Console.WriteLine(System.String.format("TapCount: {0}", [Bridge.box(this._tapCount, System.Double, System.Double.format, System.Double.getHashCode)]));
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
                team.Score(e.Item1 * this._tapCount);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vZGVscy9UZWFtVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1N0YXJ0R2FtZVZpZXdNb2RlbC5jcyIsIkN1c3RvbVJvdXRlc0NvbmZpZy5jcyIsIlNwYWZBcHAuY3MiLCJSZXBvc2l0b3JpZXMvSW1wbC9UZWFtUmVwb3NpdG9yeS5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIiwiSHVicy9JbXBsL01vdmVJdEh1Yi5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzlCWEE7O2dCQUVq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QUtBLG9CQUFhQTs7OztnQkFLN0RBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Z0JBTUFBO2dCQUNBQTs7O2dCQUtBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3BFQUEsbUJBQW9CQSxJQUFJQTtnQkFDeEJBLGlDQUFnQ0EsQUFBZ0JBLCtCQUFDQTtvQkFFN0NBLHdDQUFtQkEsUUFBS0EsQUFBcUNBLGtCQUF5QkEsTUFBS0EsT0FBTUE7O2dCQUVyR0Esa0NBQWlDQSxBQUFnQkEsK0JBQUNBO29CQUU5Q0EseUNBQW9CQSxRQUFLQSxBQUFxQ0EsbUJBQTBCQSxNQUFLQSxRQUFPQTs7Ozs7NkJBSTFGQTs7Z0JBRWRBOzs7Z0JBS0FBOzsrQkFHZ0JBO2dCQUVoQkEsaUNBQWlDQTs7Z0NBR2hCQTtnQkFFakJBLGtDQUFrQ0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5DbGFzc2VzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIFdhaXRGb3JNZTxULCBUSz5cclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPiBfY29tcGxldGUgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+KCk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgRXZlbnRJbmZvIF9ldmVudEluZm87XHJcbiAgICAgICAgcHJpdmF0ZSBUIF9vYmo7XHJcbiAgICAgICAgcHJpdmF0ZSBEZWxlZ2F0ZSBfaGFuZGxlcjtcclxucHVibGljIFRhc2s8VEs+IFRhc2tcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlLlRhc2s7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBzdHJpbmcgZXZlbnROQW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudE5BbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgRnVuYzxULCBzdHJpbmc+IGV2ZW50bmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnRuYW1lLkludm9rZShvYmopKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBTdWJzY3JpYmUoVCBvYmosIHN0cmluZyBldmVudE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9vYmogPSBvYmo7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mbyA9IHR5cGVvZihUKS5HZXRFdmVudChldmVudE5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTnVsbFJlZmVyZW5jZUV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiRXZlbnQgd2l0aCBuYW1lIHswfSBub3QgZm91bmQgb24gb2JqZWN0IG9mIHR5cGUgezF9XCIsZXZlbnROYW1lLHR5cGVvZihUKSkpO1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kSW5mbyA9IHRoaXMuR2V0VHlwZSgpLkdldE1ldGhvZChcIk9uQ29tcGxldGVcIiwgQmluZGluZ0ZsYWdzLk5vblB1YmxpYyB8IEJpbmRpbmdGbGFncy5JbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0aG9kSW5mbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcIm1ldGhvZGluZm9cIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVyID0gRGVsZWdhdGUuQ3JlYXRlRGVsZWdhdGUodHlwZW9mKFRLKSwgdGhpcywgbWV0aG9kSW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5BZGRFdmVudEhhbmRsZXIob2JqLCB0aGlzLl9oYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBPbkNvbXBsZXRlKG9iamVjdCBzZW5kZXIsIFRLIGhhbmRsZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudEluZm8uUmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX29iaiwgdGhpcy5faGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLlRyeVNldFJlc3VsdChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG51c2luZyBSZXR5cGVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUZWFtVmlld01vZGVsXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEd1aWQgSWQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgTmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBDc3NDbGFzcyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxkb3VibGU+IFNjb3JlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gSG93TWFueSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IFNjcmVlblBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8UGxheWVyPiBQbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGJvb2w+IElzV2lubmVyIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFRlYW1WaWV3TW9kZWwoVGVhbSB0ZWFtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5JZCA9IHRlYW0uSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IHRlYW0uTmFtZTtcclxuICAgICAgICAgICAgdGhpcy5Dc3NDbGFzcyA9IHRoaXMuTmFtZS5SZXBsYWNlKFwiIFwiLCBcIl9cIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLlNjb3JlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGRvdWJsZT4oKTtcclxuICAgICAgICAgICAgdGhpcy5Ib3dNYW55ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGludD4oKTtcclxuICAgICAgICAgICAgdGhpcy5TY3JlZW5Qb3NpdGlvbiA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuSXNXaW5uZXIgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8Ym9vbD4oKTtcclxuICAgICAgICAgICAgdGhpcy5QbGF5ZXJzID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZUFycmF5LlNlbGY8UGxheWVyPigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5TY29yZS5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dFN1YnNjcmliYWJsZTxkb3VibGU+LnN1YnNjcmliZUZuKSh2YWx1ZSA9PiB0aGlzLlNjcmVlblBvc2l0aW9uLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdmFsdWUpKSkpO1xyXG4gICAgICAgICAgICB0aGlzLlBsYXllcnMuc3Vic2NyaWJlKChnbG9iYWw6OlJldHlwZWQua25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+LnN1YnNjcmliZUZuMikodmFsdWUgPT4gdGhpcy5Ib3dNYW55LlNlbGYodGhpcy5QbGF5ZXJzLlNlbGYoKS5MZW5ndGgpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW92ZUl0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElNb3ZlSXRIdWIgX21vdmVJdEh1YjtcclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5Nb3ZlSXRJZDtcclxufVxyXG4gICAgICAgIHByaXZhdGUgaW50IF90b3AgPSAwO1xyXG4gICAgICAgIHByaXZhdGUgaW50IF9sZWZ0ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gVG9wIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTGVmdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRWaWV3TW9kZWwoSU1vdmVJdEh1YiBtb3ZlSXRIdWIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIgPSBtb3ZlSXRIdWI7XHJcbiAgICAgICAgICAgIHRoaXMuVG9wID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fdG9wKSk7XHJcbiAgICAgICAgICAgIHRoaXMuTGVmdCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX2xlZnQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PbkxlZnRDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PbkxlZnRDaGFuZ2VkO1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25Ub3BDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PblRvcENoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PblRvcENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl90b3AgPSBlO1xyXG4gICAgICAgICAgICB0aGlzLlRvcC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQob2JqZWN0IHNlbmRlciwgaW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gZTtcclxuICAgICAgICAgICAgdGhpcy5MZWZ0LlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU3RhcnQoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdG9wKCk7XHJcbiAgICAgICAgICAgIGJhc2UuT25MZWF2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcCs9MTA7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TZW5kVG9wKHRoaXMuX3RvcCk7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJUb3A6IHswfVwiLHRoaXMuX3RvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuTGVmdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Kz0xMDtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRMZWZ0KHRoaXMuX2xlZnQpO1xyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiTGVmdDogezB9XCIsdGhpcy5fbGVmdCkpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZS5TcGFmO1xyXG51c2luZyBSZXR5cGVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFN0YXJ0R2FtZVZpZXdNb2RlbCA6IExvYWRhYmxlVmlld01vZGVsXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgRmluaXNoTGluZU9mZnNldCA9IDE3MDtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBTcGFjZVNoaXBXaWR0aCA9IDE3ODtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1SZXBvc2l0b3J5IF90ZWFtUmVwb3NpdG9yeTtcclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBfdGFwQ291bnQ7XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuU3RhcnRHYW1lSWQ7XHJcbn1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPEdhbWVTdGF0ZT4gU3RhdGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8VGVhbVZpZXdNb2RlbD4gVGVhbVZpZXdNb2RlbHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU3RhcnRHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElUZWFtUmVwb3NpdG9yeSB0ZWFtUmVwb3NpdG9yeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIgPSBnYW1lSHViO1xyXG4gICAgICAgICAgICB0aGlzLl90ZWFtUmVwb3NpdG9yeSA9IHRlYW1SZXBvc2l0b3J5O1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlYW1zID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4odGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbXMoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKHMgPT4gbmV3IFRlYW1WaWV3TW9kZWwocykpKS5Ub0FycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxUZWFtVmlld01vZGVsPigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscy5wdXNoKHRlYW1zKTtcclxuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxHYW1lU3RhdGU+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uUGxheWVyTGVhdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxQbGF5ZXIgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4odGhpcy5BTGxQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLCBib29sPikoc2QgPT4gc2QuSWQgPT0gdHVwbGUuSXRlbTEuSWQpKTtcclxuICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoc3RyaW5nLkZvcm1hdChcIklsIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX0gY2kgaGEgbGFzY2lhdG8gcHJlbWF0dXJhbWVudGUuXCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKHR1cGxlLkl0ZW0yKTtcclxuICAgICAgICAgICAgdGVhbS5QbGF5ZXJzLnB1c2godHVwbGUuSXRlbTEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3Moc3RyaW5nLkZvcm1hdChcIk51b3ZvIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX1cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN0YXRlLlNlbGYoZSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkNsb3NlZDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlc2V0VGVhbXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlJlZ2lzdGVyOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gR2xvYmFsLkRvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKS5PZmZzZXRXaWR0aC1GaW5pc2hMaW5lT2Zmc2V0LVNwYWNlU2hpcFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhcENvdW50ID0gd2lkdGggLyBTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIldpZHRoOiB7MH1cIix3aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJGaW5pc2hMaW5lOiB7MH1cIixTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmUpKTtcclxuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVGFwQ291bnQ6IHswfVwiLHRoaXMuX3RhcENvdW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5GaW5pc2hlZDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUV4Y2VwdGlvbihcImVcIiwgZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVzZXRUZWFtcygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZi5QbGF5ZXJzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgICAgICAgICAgZi5TY29yZS5TZWxmKDApO1xyXG4gICAgICAgICAgICAgICAgZi5Jc1dpbm5lci5TZWxmKGZhbHNlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKGUuSXRlbTIpO1xyXG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoZS5JdGVtMSp0aGlzLl90YXBDb3VudCk7XHJcblN5c3RlbS5BcnJheUV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KFxyXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT4gZi5Jc1dpbm5lci5TZWxmKGZhbHNlKSkpO1xyXG5TeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk9yZGVyQnlEZXNjZW5kaW5nPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCxkb3VibGU+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgZG91YmxlPikobyA9PiBvLlNjb3JlLlNlbGYoKSkpLkZpcnN0KCkuSXNXaW5uZXIuU2VsZih0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0R2FtZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlJlU3RhcnRHYW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgKz0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB0aGlzLl9nYW1lSHViLk5vdGlmeUlBbVRoZUFkbWluKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBPblRvb01hbnlQbGF5ZXJzKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoXCJUcm9wcGkgdXRlbnRpLi4gZ2lvY2F0b3JlIGVzY2x1c28uIDooXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCAtPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgLT0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT3BlblJlZ2lzdHJhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdG9wR2FtZSgpO1xyXG4gICAgICAgIH1cclxucHJpdmF0ZSBUZWFtVmlld01vZGVsIEdldFRlYW1CeUlkKEd1aWQgaWQpXHJcbntcclxuICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgYm9vbD4pKHMgPT4gcy5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpKSkpO1xyXG59cHJpdmF0ZSBJRW51bWVyYWJsZTxQbGF5ZXI+IEFMbFBsYXllcnNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsZ2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4+KShzbSA9PiBzbS5QbGF5ZXJzLlNlbGYoKSkpO1xyXG4gICAgfVxyXG59ICAgIH1cclxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzO1xyXG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcclxue1xyXG4gICAgY2xhc3MgQ3VzdG9tUm91dGVzQ29uZmlnIDogQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IENyZWF0ZVJvdXRlcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9tb3ZlSXQuaHRtbFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLk1vdmVJdElkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvc3RhcnRHYW1lLmh0bWxcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5TdGFydEdhbWVJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8U3RhcnRHYW1lVmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5Nb3ZlSXRJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGw7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzLkltcGw7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5Jb2M7XHJcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XHJcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xyXG51c2luZyBCcmlkZ2UuU3BhZi5BdHRyaWJ1dGVzO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJSW9jIENvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29udGFpbmVyID0gbmV3IEJyaWRnZUlvYygpO1xyXG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIG5hdmlnYXRvclxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgUXVlcnlQYXJhbWV0ZXJOYXZpZ2F0aW9uSGlzdG9yeT4oKTtcclxuLy8gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBDb21wbGV4T2JqZWN0TmF2aWdhdGlvbkhpc3Rvcnk+KCk7IC8vIGlmIHlvdSBkb24ndCBuZWVkIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXHJcblxyXG4gICAgICAgICAgICAvLyBtZXNzZW5nZXJcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZpZXdtb2RlbHNcclxuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XHJcblxyXG4gICAgICAgICAgICAvLyByZWdpc3RlciBjdXN0b20gcmVzb3VyY2UsIHNlcnZpY2VzLi5cclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1vdmVJdEh1YiwgTW92ZUl0SHViPigpO1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtc0RhdGFTb3VyY2UsIFRlYW1zRGF0YVNvdXJjZT4oKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbVJlcG9zaXRvcnksIFRlYW1SZXBvc2l0b3J5PigpO1xyXG4gICAgICAgIH1cclxuI3JlZ2lvbiBQQUdFUyBJRFNcclxuLy8gc3RhdGljIHBhZ2VzIGlkXHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIEhvbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJob21lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBNb3ZlSXRJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJtb3ZlSXRcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFN0YXJ0R2FtZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInN0YXJ0R2FtZVwiO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgI2VuZHJlZ2lvblxyXG5cclxuICAgICAgICAjcmVnaW9uIE1FU1NBR0VTXHJcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjbGFzcyBNZXNzYWdlc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XHJcblxyXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc3RyaW5nIExvZ2luRG9uZSA9PiBcIkxvZ2luRG9uZVwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cclxuICAgICAgICAvLy8gWW91IGNhbiByZWdpc3RlciBhIHZpZXdtb2RlIGFzIFNpbmdsciBJbnN0YW5jZSBhZGRpbmcgXCJTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZVwiIHRvIHRoZSBjbGFzc1xyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXHJcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZi5HZXRDdXN0b21BdHRyaWJ1dGVzKHR5cGVvZihTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZSksIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlKGYpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbFxyXG57XHJcbiAgICBjbGFzcyBUZWFtUmVwb3NpdG9yeSA6IElUZWFtUmVwb3NpdG9yeVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1zRGF0YVNvdXJjZSBfdGVhbXNEYXRhU291cmNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgVGVhbVJlcG9zaXRvcnkoSVRlYW1zRGF0YVNvdXJjZSB0ZWFtc0RhdGFTb3VyY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl90ZWFtc0RhdGFTb3VyY2UgPSB0ZWFtc0RhdGFTb3VyY2U7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgVGVhbSBHZXRUZWFtQnlJZChHdWlkIGlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW1zID0gdGhpcy5HZXRUZWFtcygpO1xyXG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtPih0ZWFtcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpLFN0cmluZ0NvbXBhcmlzb24uSW52YXJpYW50Q3VsdHVyZUlnbm9yZUNhc2UpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlYW1zRGF0YVNvdXJjZS5HZXRUZWFtcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzXHJcbntcclxuICAgIGNsYXNzIFRlYW1zRGF0YVNvdXJjZSA6IElUZWFtc0RhdGFTb3VyY2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxyXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiRmFsY29uXCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZWFtMiA9IG5ldyBUZWFtXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcclxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIkRyYWdvblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTI7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbTMgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RDcyNEYwMS1DOUVFLTRGMzEtQTg2NS1BRkJENkEyRDJCREFcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJSb2Fkc3RlclwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTM7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbTQgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJTcGFjZVhcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXHJcbntcclxuICAgIGNsYXNzIEdhbWVIdWIgOiBJR2FtZUh1YlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxpbnQsIEd1aWQ+PiBPblRhcENvdW50UmVjZWl2ZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZUh1YigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvcGxheVwiKS5CdWlsZCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcImdhbWVTdGF0ZU1vZGVcIixuZXcgQWN0aW9uPEdhbWVTdGF0ZT4oKGdhbWVTdGF0ZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckpvaW5lZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25OZXdQbGF5ZXJKb2luZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25OZXdQbGF5ZXJKb2luZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwicGxheWVyTGVhdmVkXCIsbmV3IEFjdGlvbjxQbGF5ZXIsR3VpZD4oKG5hbWUsdGVhbSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PblBsYXllckxlYXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblBsYXllckxlYXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ0YXBDb3VudFwiLG5ldyBBY3Rpb248aW50LEd1aWQ+KChuYW1lLHRlYW0pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25UYXBDb3VudFJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVGFwQ291bnRSZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8aW50LGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidG9vTWFueVBsYXllcnNcIixuZXcgQWN0aW9uKCgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25Ub29NYW55UGxheWVycyE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRvb01hbnlQbGF5ZXJzLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpLlRoZW4oKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gb25Db25uZWN0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pm9uQ29ubmVjdGVkLkludm9rZSgpKTpudWxsKSwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IHt9KSlcclxuICAgICAgICAgICAgICAgIC5DYXRjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzdGFydEdhbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwib3BlblJlZ2lzdHJhdGlvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE5vdGlmeUlBbVRoZUFkbWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic2V0VXBBZG1pblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlU3RhcnRHYW1lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIHRvZG9cclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJyZXN0YXJ0IVwiKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJyZVN0YXJ0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJTdG9wR2FtZVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxyXG57XHJcbiAgICBjbGFzcyBNb3ZlSXRIdWIgOiBJTW92ZUl0SHViXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBIdWJDb25uZWN0aW9uIF9jb25uZWN0aW9uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8aW50PiBPbkxlZnRDaGFuZ2VkO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8aW50PiBPblRvcENoYW5nZWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRIdWIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL21vdmVJdFwiKS5CdWlsZCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlVG9wXCIsbmV3IEFjdGlvbjxpbnQ+KCh0b3ApID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25Ub3BDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9wQ2hhbmdlZC5JbnZva2UodGhpcyx0b3ApKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ1cGRhdGVMZWZ0XCIsbmV3IEFjdGlvbjxpbnQ+KChsZWZ0KSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uTGVmdENoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25MZWZ0Q2hhbmdlZC5JbnZva2UodGhpcyxsZWZ0KSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdGFydCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRUb3AoaW50IHRvcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRUb3BcIiwgdG9wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRMZWZ0KGludCBsZWZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZExlZnRcIiwgbGVmdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59Il0KfQo=
