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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vZGVscy9UZWFtVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1N0YXJ0R2FtZVZpZXdNb2RlbC5jcyIsIkN1c3RvbVJvdXRlc0NvbmZpZy5jcyIsIlNwYWZBcHAuY3MiLCJSZXBvc2l0b3JpZXMvSW1wbC9UZWFtUmVwb3NpdG9yeS5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIiwiSHVicy9JbXBsL01vdmVJdEh1Yi5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzlCWEE7O2dCQUVqQkEsVUFBVUE7Z0JBQ1ZBLFlBQVlBO2dCQUNaQSxnQkFBZ0JBOztnQkFFaEJBLGFBQWFBO2dCQUNiQSxlQUFlQTtnQkFDZkEsc0JBQXNCQTtnQkFDdEJBLGdCQUFnQkE7Z0JBQ2hCQSxlQUFlQTs7Z0JBRWZBLHFCQUFxQkEsQUFBb0VBO29CQUFTQSxvQkFBeUJBLCtCQUFzQkE7O2dCQUNqSkEsdUJBQXVCQSxBQUFxR0E7b0JBQVNBLGFBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQ1ZwSUE7OztnQkFFbkJBLGtCQUFrQkE7Z0JBQ2xCQSxXQUFXQSxjQUFvQ0EsK0JBQXNCQTtnQkFDckVBLFlBQVlBLGNBQW9DQSwrQkFBc0JBOztnQkFFdEVBLHNFQUFpQ0E7Z0JBQ2pDQSxxRUFBZ0NBOzs7OztnQkFmeENBLE9BQU9BOzsrQ0FrQmtDQSxRQUFlQTtnQkFFaERBLFlBQVlBO2dCQUNaQSxTQUFjQSwrQkFBc0JBOztnREFHRkEsUUFBZUE7Z0JBRWpEQSxhQUFhQTtnQkFDYkEsVUFBZUEsK0JBQXNCQTs7OEJBR2JBO2dCQUV4QkE7Z0JBQ0FBLDBEQUFZQTs7O2dCQUtaQTtnQkFDQUE7OztnQkFLQUE7Z0JBQ0FBLDZEQUF3QkE7Z0JBQ3hCQSx5QkFBa0JBLGtDQUF5QkE7OztnQkFLM0NBO2dCQUNBQSw4REFBeUJBO2dCQUN6QkEseUJBQWtCQSxtQ0FBMEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JDbUdoREEsT0FBT0EsNEJBQW9JQSxrQ0FBMkJBLEFBQXlLQTttQ0FBTUE7Ozs7Ozs7Ozs7NEJBckkzVEEsU0FBa0JBOzs7Z0JBRXhDQSxnQkFBZ0JBO2dCQUNoQkEsdUJBQXVCQTs7Z0JBRXZCQSxZQUFZQSw0QkFBOEhBLDBGQUFnQ0EsQUFBdUhBOytCQUFLQSxJQUFJQSxxREFBY0E7O2dCQUN4VEEsc0JBQXNCQTs7Z0JBRXRCQSxvREFBeUJBO2dCQUN6QkEsYUFBYUE7Ozs7O2dCQWZyQkEsT0FBT0E7OytDQW1Ca0NBLFFBQWVBO2dCQUVoREEsa0JBQWtCQSw0QkFBNEVBLGlDQUFnQkEsQUFBaUVBOytCQUFNQSwrQkFBU0E7O2dCQUM5TEEsSUFBSUEsZUFBZUE7b0JBQU1BOzs7Z0JBRXpCQSxXQUFXQSxtRkFBaUNBOztnQkFFNUNBLHlIQUFxQkEsMEZBQWtGQSxrQkFBaUJBLFFBQU1BLE9BQUtBLFlBQVVBLEFBQVFBOztrREFHakhBLFFBQWVBO2dCQUVuREEsV0FBV0EsaUJBQWlCQTtnQkFDNUJBLGtCQUFrQkE7O2dCQUVsQkEseUhBQXFCQSw4REFBc0RBLGtCQUFpQkEsUUFBTUEsT0FBS0EsWUFBVUEsQUFBUUE7O29EQUduRkEsUUFBZUE7Z0JBRXJEQSxXQUFnQkE7O2dCQUVoQkEsUUFBUUE7b0JBRUpBLEtBQUtBO3dCQUNEQTt3QkFDQUE7b0JBQ0pBLEtBQUtBO3dCQUNEQTtvQkFDSkEsS0FBS0E7d0JBQ0RBLFlBQVlBLGtFQUFzREEsNEVBQWlCQTt3QkFDbkZBLGlCQUFpQkEsdUJBQVFBO3dCQUN6QkEseUJBQWtCQSxvQ0FBMkJBO3dCQUM3Q0EseUJBQWtCQSx5Q0FBZ0NBO3dCQUNsREEseUJBQWtCQSx1Q0FBOEJBO3dCQUNoREE7b0JBQ0pBLEtBQUtBO3dCQUNEQTtvQkFDSkE7d0JBQ0lBLE1BQU1BLElBQUlBLCtDQUFpQ0EsdUdBQUdBOzs7OztnQkFPbEVBLEFBQXlHQSw4QkFBMkJBLEFBQXNGQTt3QkFFMU1BO3dCQUNBQTt3QkFDQUE7OzttREFLaUNBLFFBQWVBO2dCQUVwREEsV0FBV0EsaUJBQWlCQTtnQkFDNUJBLFdBQWdCQSxVQUFRQTtnQkFDcENBLEFBQ1lBLDhCQUEyQkEsQUFBc0ZBO3dCQUFLQTs7Z0JBQ2xJQSw0QkFBMEhBLHlDQUEyQkEsQUFBNEZBOytCQUFLQTs7OztnQkFLMU9BOzs7Z0JBS0FBOzs4QkFHd0JBO2dCQUV4QkEsMERBQVlBOztnQkFFWkEsd0VBQXFDQTtnQkFDckNBLHNFQUFtQ0E7Z0JBQ25DQSxtRUFBZ0NBO2dCQUNoQ0EsdUVBQW9DQTtnQkFDcENBLHFFQUFrQ0E7O2dCQUVsQ0EsdURBQW9CQSxBQUF3QkE7b0JBQU1BOzs7d0NBR3hCQSxRQUFlQTtnQkFFekNBOzs7Z0JBTUFBLDJFQUFxQ0E7Z0JBQ3JDQSx5RUFBbUNBO2dCQUNuQ0Esc0VBQWdDQTtnQkFDaENBLDBFQUFvQ0E7Z0JBQ3BDQSx3RUFBa0NBOztnQkFFbENBOzs7Z0JBS0FBOzs7Z0JBS0FBOzttQ0FFc0JBO2dCQUU5QkEsT0FBT0EsNEJBQTRGQSw4QkFBMkJBLEFBQTBGQTsrQkFBS0Esc0NBQXVCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzdIM01BOzhCQUEwRUE7Ozs7OztnQkF4QjNHQSxPQUFPQSxBQUEwREEsVUFBQ0E7O3dCQUFPQSxRQUFRQSxVQUFJQSx5REFFM0RBOzs2Q0FDSEE7O29DQUNUQSxrREFDV0E7bUNBQU1BOzt3QkFDeEJBLFFBQVFBLFVBQUlBLHlEQUVPQTs7NkNBQ0hBOztvQ0FDVEEscURBQ1dBO21DQUFNQTs7d0JBQ3hCQSxPQUFPQTtzQkFadUJBLEtBQUlBOzs7Ozs7O1lDV3pDQSxnQ0FBWUEsSUFBSUE7WUFDaEJBO1lBQ0FBOzs7Ozs7Ozs7O3dCQWlDSkE7Ozs7O3dCQU1BQTs7Ozs7d0JBTUFBOzs7Ozs7b0JBdENJQTtvQkFDQUE7b0JBRUFBOztvQkFHQUE7O29CQUdBQTs7b0JBR0FBO29CQUNBQTs7b0JBRUFBOzs7b0JBR0FBOzs7Ozs7Ozs7Ozs7O29CQStDQUEsWUFBWUEsNEJBQTBGQSw2Q0FBd0NBLEFBQStIQTttQ0FBS0E7aUNBQ3ZRQSxBQUFpREE7K0JBQUtBOzs7b0JBRWpFQSxjQUFjQSxBQUE2Q0E7d0JBRXZEQSxpQkFBaUJBLG1DQUFzQkEsQUFBT0E7O3dCQUU5Q0EsSUFBSUEsNEJBQW1DQTs0QkFDbkNBLHFFQUFpQ0E7OzRCQUVqQ0EsdURBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBekJTQSxJQUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQ3JFdEJBOztnQkFFbEJBLHdCQUF3QkE7Ozs7bUNBR0pBO2dCQUVwQkEsWUFBWUE7Z0JBQ1pBLE9BQU9BLDRCQUEwRUEsdUJBQU1BLEFBQStEQTsrQkFBTUEsdUNBQXdCQSxlQUFjQTs7OztnQkFLbE1BLE9BQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0NmUEEsUUFBWUEsVUFBSUEscUNBRVBBOzRDQUdUQSxzQkFBYUE7Ozs7O3dDQUViQSxRQUFZQSxVQUFJQSxxQ0FFUEE7NENBR1RBLHNCQUFhQTs7Ozs7d0NBRWJBLFFBQVlBLFVBQUlBLHFDQUVQQTs0Q0FHVEEsc0JBQWFBOzs7Ozt3Q0FFYkEsUUFBWUEsVUFBSUEscUNBRVBBOzRDQUdUQSxzQkFBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkNqQmJBLG1CQUFvQkEsSUFBSUE7O2dCQUV4QkEscUNBQW9DQSxBQUFzQkEsK0JBQUNBO29CQUV2REEsK0NBQTBCQSxRQUFLQSxBQUFxQ0EseUJBQWdDQSxNQUFLQSxhQUFZQTs7O2dCQUd6SEEsdUNBQXNDQSxBQUF3QkEsK0JBQUNBLE1BQUtBO29CQUVoRUEsNkNBQXdCQSxRQUFLQSxBQUFxQ0EsdUJBQThCQSxNQUFLQSxTQUFzRUEsYUFBS0EsVUFBUUE7OztnQkFHNUxBLG9DQUFtQ0EsQUFBd0JBLCtCQUFDQSxNQUFLQTtvQkFFN0RBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsU0FBc0VBLGFBQUtBLFVBQVFBOzs7Z0JBR3RMQSxnQ0FBK0JBLEFBQXFCQSwrQkFBQ0EsTUFBS0E7b0JBRXREQSw4Q0FBeUJBLFFBQUtBLEFBQXFDQSx3QkFBK0JBLE1BQUtBLFNBQXNDQSxhQUFLQSxVQUFRQTs7O2dCQUc5SkEsc0NBQXFDQSxBQUFXQTtvQkFFNUNBLDRDQUF1QkEsUUFBS0EsQUFBcUNBLHNCQUE2QkEsTUFBS0EsUUFBT0E7Ozs7OzZCQUloR0E7O2dCQUVkQSw4QkFBOEJBLEFBQXdCQTtvQkFBTUEsa0NBQWFBLFFBQUtBLEFBQXFDQSxnQkFBc0JBO21CQUFPQSxBQUFnQ0Esd0JBQ3JLQSxBQUFnQ0E7b0JBQUtBLG9CQUFhQTs7OztnQkFLN0RBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Z0JBS0FBOzs7Z0JBTUFBO2dCQUNBQTs7O2dCQUtBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3BFQUEsbUJBQW9CQSxJQUFJQTtnQkFDeEJBLGlDQUFnQ0EsQUFBZ0JBLCtCQUFDQTtvQkFFN0NBLHdDQUFtQkEsUUFBS0EsQUFBcUNBLGtCQUF5QkEsTUFBS0EsT0FBTUE7O2dCQUVyR0Esa0NBQWlDQSxBQUFnQkEsK0JBQUNBO29CQUU5Q0EseUNBQW9CQSxRQUFLQSxBQUFxQ0EsbUJBQTBCQSxNQUFLQSxRQUFPQTs7Ozs7NkJBSTFGQTs7Z0JBRWRBOzs7Z0JBS0FBOzsrQkFHZ0JBO2dCQUVoQkEsaUNBQWlDQTs7Z0NBR2hCQTtnQkFFakJBLGtDQUFrQ0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3Nlc1xue1xuICAgIGludGVybmFsIGNsYXNzIFdhaXRGb3JNZTxULCBUSz5cbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcblxuICAgICAgICBwcml2YXRlIEV2ZW50SW5mbyBfZXZlbnRJbmZvO1xuICAgICAgICBwcml2YXRlIFQgX29iajtcbiAgICAgICAgcHJpdmF0ZSBEZWxlZ2F0ZSBfaGFuZGxlcjtcbnB1YmxpYyBUYXNrPFRLPiBUYXNrXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZS5UYXNrO1xyXG4gICAgfVxyXG59XG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnROQW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIEZ1bmM8VCwgc3RyaW5nPiBldmVudG5hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuU3Vic2NyaWJlKG9iaiwgZXZlbnRuYW1lLkludm9rZShvYmopKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBTdWJzY3JpYmUoVCBvYmosIHN0cmluZyBldmVudE5hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mbyA9IHR5cGVvZihUKS5HZXRFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SW5mbyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XG4gICAgICAgICAgICB2YXIgbWV0aG9kSW5mbyA9IHRoaXMuR2V0VHlwZSgpLkdldE1ldGhvZChcIk9uQ29tcGxldGVcIiwgQmluZGluZ0ZsYWdzLk5vblB1YmxpYyB8IEJpbmRpbmdGbGFncy5JbnN0YW5jZSk7XG5cbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcIm1ldGhvZGluZm9cIik7XG5cbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5BZGRFdmVudEhhbmRsZXIob2JqLCB0aGlzLl9oYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBPbkNvbXBsZXRlKG9iamVjdCBzZW5kZXIsIFRLIGhhbmRsZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLlRyeVNldFJlc3VsdChoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBUZWFtVmlld01vZGVsXG4gICAge1xuICAgICAgICBwdWJsaWMgR3VpZCBJZCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBzdHJpbmcgTmFtZSB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQ3NzQ2xhc3MgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGRvdWJsZT4gU2NvcmUgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGludD4gSG93TWFueSB7IGdldDsgc2V0OyB9XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gU2NyZWVuUG9zaXRpb24geyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8UGxheWVyPiBQbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxib29sPiBJc1dpbm5lciB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIFRlYW1WaWV3TW9kZWwoVGVhbSB0ZWFtKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklkID0gdGVhbS5JZDtcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IHRlYW0uTmFtZTtcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3MgPSB0aGlzLk5hbWUuUmVwbGFjZShcIiBcIiwgXCJfXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlNjb3JlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGRvdWJsZT4oKTtcbiAgICAgICAgICAgIHRoaXMuSG93TWFueSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxpbnQ+KCk7XG4gICAgICAgICAgICB0aGlzLlNjcmVlblBvc2l0aW9uID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oKTtcbiAgICAgICAgICAgIHRoaXMuSXNXaW5uZXIgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8Ym9vbD4oKTtcbiAgICAgICAgICAgIHRoaXMuUGxheWVycyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFBsYXllcj4oKTtcblxuICAgICAgICAgICAgdGhpcy5TY29yZS5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dFN1YnNjcmliYWJsZTxkb3VibGU+LnN1YnNjcmliZUZuKSh2YWx1ZSA9PiB0aGlzLlNjcmVlblBvc2l0aW9uLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdmFsdWUpKSkpO1xuICAgICAgICAgICAgdGhpcy5QbGF5ZXJzLnN1YnNjcmliZSgoZ2xvYmFsOjpSZXR5cGVkLmtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPi5zdWJzY3JpYmVGbjIpKHZhbHVlID0+IHRoaXMuSG93TWFueS5TZWxmKHRoaXMuUGxheWVycy5TZWxmKCkuTGVuZ3RoKSkpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEJyaWRnZS5TcGFmO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgTW92ZUl0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU1vdmVJdEh1YiBfbW92ZUl0SHViO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5Nb3ZlSXRJZDtcclxufVxuICAgICAgICBwcml2YXRlIGludCBfdG9wID0gMDtcbiAgICAgICAgcHJpdmF0ZSBpbnQgX2xlZnQgPSAwO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IFRvcCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBMZWZ0IHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgTW92ZUl0Vmlld01vZGVsKElNb3ZlSXRIdWIgbW92ZUl0SHViKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIgPSBtb3ZlSXRIdWI7XG4gICAgICAgICAgICB0aGlzLlRvcCA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLHRoaXMuX3RvcCkpO1xuICAgICAgICAgICAgdGhpcy5MZWZ0ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fbGVmdCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuT25MZWZ0Q2hhbmdlZCArPSB0aGlzLk1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PblRvcENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gZTtcbiAgICAgICAgICAgIHRoaXMuVG9wLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGU7XG4gICAgICAgICAgICB0aGlzLkxlZnQuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0YXJ0KCk7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU3RvcCgpO1xuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90b3ArPTEwO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRUb3AodGhpcy5fdG9wKTtcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJUb3A6IHswfVwiLHRoaXMuX3RvcCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgQWRkVGVuTGVmdCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnQrPTEwO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRMZWZ0KHRoaXMuX2xlZnQpO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIkxlZnQ6IHswfVwiLHRoaXMuX2xlZnQpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGU7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcbnVzaW5nIEJyaWRnZTtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5TcGFmO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHNcbntcbiAgICBwdWJsaWMgY2xhc3MgU3RhcnRHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IEZpbmlzaExpbmVPZmZzZXQgPSAxNzA7XG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IFNwYWNlU2hpcFdpZHRoID0gMTc4O1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJVGVhbVJlcG9zaXRvcnkgX3RlYW1SZXBvc2l0b3J5O1xuICAgICAgICBwcml2YXRlIGRvdWJsZSBfdGFwQ291bnQ7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLlN0YXJ0R2FtZUlkO1xyXG59XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8R2FtZVN0YXRlPiBTdGF0ZSB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFRlYW1WaWV3TW9kZWw+IFRlYW1WaWV3TW9kZWxzIHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgU3RhcnRHYW1lVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElUZWFtUmVwb3NpdG9yeSB0ZWFtUmVwb3NpdG9yeSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl90ZWFtUmVwb3NpdG9yeSA9IHRlYW1SZXBvc2l0b3J5O1xuXG4gICAgICAgICAgICB2YXIgdGVhbXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sZ2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSwgZ2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPikocyA9PiBuZXcgVGVhbVZpZXdNb2RlbChzKSkpLlRvQXJyYXkoKTtcbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxUZWFtVmlld01vZGVsPigpO1xuXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLnB1c2godGVhbXMpO1xuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxHYW1lU3RhdGU+KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblBsYXllckxlYXZlZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbG9jYWxQbGF5ZXIgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4odGhpcy5BTGxQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLCBib29sPikoc2QgPT4gc2QuSWQgPT0gdHVwbGUuSXRlbTEuSWQpKTtcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhzdHJpbmcuRm9ybWF0KFwiSWwgZ2lvY2F0b3JlIHswfSBkZWxsYSBzcXVhZHJhIHsxfSBjaSBoYSBsYXNjaWF0byBwcmVtYXR1cmFtZW50ZS5cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlBsYXllcnMucHVzaCh0dXBsZS5JdGVtMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5TdWNjZXNzKHN0cmluZy5Gb3JtYXQoXCJOdW92byBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9XCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN0YXRlLlNlbGYoZSk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5DbG9zZWQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUmVzZXRUZWFtcygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5SZWdpc3RlcjpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IEdsb2JhbC5Eb2N1bWVudC5HZXRFbGVtZW50QnlJZChcImdhbWVEaXZcIikuT2Zmc2V0V2lkdGgtRmluaXNoTGluZU9mZnNldC1TcGFjZVNoaXBXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFwQ291bnQgPSB3aWR0aCAvIFNoYXJlZENvbmZpZ3VyYXRpb24uRmluaXNoTGluZTtcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIldpZHRoOiB7MH1cIix3aWR0aCkpO1xuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiRmluaXNoTGluZTogezB9XCIsU2hhcmVkQ29uZmlndXJhdGlvbi5GaW5pc2hMaW5lKSk7XG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJUYXBDb3VudDogezB9XCIsdGhpcy5fdGFwQ291bnQpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuRmluaXNoZWQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oXCJlXCIsIGUsIG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgUmVzZXRUZWFtcygpXG4gICAgICAgIHtcblN5c3RlbS5BcnJheUV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPikoZiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGYuUGxheWVycy5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgICAgICBmLlNjb3JlLlNlbGYoMCk7XG4gICAgICAgICAgICAgICAgZi5Jc1dpbm5lci5TZWxmKGZhbHNlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uVGFwQ291bnRSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxpbnQsIEd1aWQ+IGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5HZXRUZWFtQnlJZChlLkl0ZW0yKTtcbiAgICAgICAgICAgIHRlYW0uU2NvcmUuU2VsZihlLkl0ZW0xKnRoaXMuX3RhcENvdW50KTtcblN5c3RlbS5BcnJheUV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KFxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KShmID0+IGYuSXNXaW5uZXIuU2VsZihmYWxzZSkpKTtcblN5c3RlbS5MaW5xLkVudW1lcmFibGUuT3JkZXJCeURlc2NlbmRpbmc8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsLGRvdWJsZT4oICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsLCBkb3VibGU+KShvID0+IG8uU2NvcmUuU2VsZigpKSkuRmlyc3QoKS5Jc1dpbm5lci5TZWxmKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHVibGljIHZvaWQgUmVTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlJlU3RhcnRHYW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uTmV3UGxheWVySm9pbmVkICs9IHRoaXMuR2FtZUh1Yk9uT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVGFwQ291bnRSZWNlaXZlZCArPSB0aGlzLkdhbWVIdWJPbk9uVGFwQ291bnRSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Ub29NYW55UGxheWVycyArPSB0aGlzLk9uVG9vTWFueVBsYXllcnM7XG5cbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RhcnQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gdGhpcy5fZ2FtZUh1Yi5Ob3RpZnlJQW1UaGVBZG1pbigpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgT25Ub29NYW55UGxheWVycyhvYmplY3Qgc2VuZGVyLCBFdmVudEFyZ3MgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoXCJUcm9wcGkgdXRlbnRpLi4gZ2lvY2F0b3JlIGVzY2x1c28uIDooXCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25OZXdQbGF5ZXJKb2luZWQgLT0gdGhpcy5HYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25QbGF5ZXJMZWF2ZWQgLT0gdGhpcy5HYW1lSHViT25PblBsYXllckxlYXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRvb01hbnlQbGF5ZXJzIC09IHRoaXMuT25Ub29NYW55UGxheWVycztcblxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PcGVuUmVnaXN0cmF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wR2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuU3RvcEdhbWUoKTtcbiAgICAgICAgfVxucHJpdmF0ZSBUZWFtVmlld01vZGVsIEdldFRlYW1CeUlkKEd1aWQgaWQpXHJcbntcclxuICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgYm9vbD4pKHMgPT4gcy5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpKSkpO1xyXG59cHJpdmF0ZSBJRW51bWVyYWJsZTxQbGF5ZXI+IEFMbFBsYXllcnNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsZ2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4+KShzbSA9PiBzbS5QbGF5ZXJzLlNlbGYoKSkpO1xyXG4gICAgfVxyXG59ICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXG4gICAge1xuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9tb3ZlSXQuaHRtbFwiLCBcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5Nb3ZlSXRJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPE1vdmVJdFZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvc3RhcnRHYW1lLmh0bWxcIiwgXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuU3RhcnRHYW1lSWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxTdGFydEdhbWVWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cblxuICAgIFxucHJpdmF0ZSBqUXVlcnkgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JvZHk9alF1ZXJ5LlNlbGVjdChcIiNwYWdlQm9keVwiKTtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fSG9tZUlkPVNwYWZBcHAuTW92ZUl0SWQ7cHJpdmF0ZSBib29sIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19EaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZT10cnVlO31cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzLkltcGw7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5EYXRhU291cmNlcztcbnVzaW5nIEJyaWRnZTtcbnVzaW5nIEJyaWRnZS5Jb2M7XG51c2luZyBCcmlkZ2UuTWVzc2VuZ2VyO1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG51c2luZyBCcmlkZ2UuU3BhZi5BdHRyaWJ1dGVzO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBwdWJsaWMgY2xhc3MgU3BhZkFwcFxuICAgIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBJSW9jIENvbnRhaW5lcjtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lciA9IG5ldyBCcmlkZ2VJb2MoKTtcbiAgICAgICAgICAgIENvbnRhaW5lckNvbmZpZygpOyAvLyBjb25maWcgY29udGFpbmVyXG4gICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIENvbnRhaW5lckNvbmZpZygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIG5hdmlnYXRvclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU5hdmlnYXRvciwgQnJpZGdlTmF2aWdhdG9yV2l0aFJvdXRpbmc+KCk7XG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBRdWVyeVBhcmFtZXRlck5hdmlnYXRpb25IaXN0b3J5PigpO1xuLy8gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBDb21wbGV4T2JqZWN0TmF2aWdhdGlvbkhpc3Rvcnk+KCk7IC8vIGlmIHlvdSBkb24ndCBuZWVkIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcjxJTmF2aWdhdG9yQ29uZmlndXJhdG9yLCBDdXN0b21Sb3V0ZXNDb25maWc+KCk7IFxuXG4gICAgICAgICAgICAvLyBtZXNzZW5nZXJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNZXNzZW5nZXIsIE1lc3Nlbmdlci5NZXNzZW5nZXI+KCk7XG5cbiAgICAgICAgICAgIC8vIHZpZXdtb2RlbHNcbiAgICAgICAgICAgIFJlZ2lzdGVyQWxsVmlld01vZGVscygpO1xuXG4gICAgICAgICAgICAvLyByZWdpc3RlciBjdXN0b20gcmVzb3VyY2UsIHNlcnZpY2VzLi5cbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElNb3ZlSXRIdWIsIE1vdmVJdEh1Yj4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElHYW1lSHViLCBHYW1lSHViPigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbXNEYXRhU291cmNlLCBUZWFtc0RhdGFTb3VyY2U+KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SVRlYW1SZXBvc2l0b3J5LCBUZWFtUmVwb3NpdG9yeT4oKTtcbiAgICAgICAgfVxuI3JlZ2lvbiBQQUdFUyBJRFNcclxuLy8gc3RhdGljIHBhZ2VzIGlkXHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIEhvbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJob21lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBNb3ZlSXRJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJtb3ZlSXRcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFN0YXJ0R2FtZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInN0YXJ0R2FtZVwiO1xyXG4gICAgfVxyXG59XG4gICAgICAgICNlbmRyZWdpb25cblxuICAgICAgICAjcmVnaW9uIE1FU1NBR0VTXG4gICAgICAgIC8vIG1lc3NlbmdlciBoZWxwZXIgZm9yIGdsb2JhbCBtZXNzYWdlcyBhbmQgbWVzc2FnZXMgaWRzXG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjbGFzcyBNZXNzYWdlc1xuICAgICAgICB7XG4gICAgICAgICAgICBwdWJsaWMgY2xhc3MgR2xvYmFsU2VuZGVyIHsgfTtcblxuICAgICAgICAgICAgcHVibGljIHN0YXRpYyBHbG9iYWxTZW5kZXIgU2VuZGVyID0gbmV3IEdsb2JhbFNlbmRlcigpO1xuXG4gICAgICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc3RyaW5nIExvZ2luRG9uZSA9PiBcIkxvZ2luRG9uZVwiO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgICNlbmRyZWdpb25cblxuICAgICAgICAvLy8gPHN1bW1hcnk+XG4gICAgICAgIC8vLyBSZWdpc3RlciBhbGwgdHlwZXMgdGhhdCBlbmQgd2l0aCBcInZpZXdtb2RlbFwiLlxuICAgICAgICAvLy8gWW91IGNhbiByZWdpc3RlciBhIHZpZXdtb2RlIGFzIFNpbmdsciBJbnN0YW5jZSBhZGRpbmcgXCJTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZVwiIHRvIHRoZSBjbGFzc1xuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIFJlZ2lzdGVyQWxsVmlld01vZGVscygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0eXBlcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OlN5c3RlbS5SZWZsZWN0aW9uLkFzc2VtYmx5LGdsb2JhbDo6U3lzdGVtLlR5cGU+KEFwcERvbWFpbi5DdXJyZW50RG9tYWluLkdldEFzc2VtYmxpZXMoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlN5c3RlbS5SZWZsZWN0aW9uLkFzc2VtYmx5LCBnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLklFbnVtZXJhYmxlPGdsb2JhbDo6U3lzdGVtLlR5cGU+PikocyA9PiBzLkdldFR5cGVzKCkpKVxuICAgICAgICAgICAgICAgIC5XaGVyZSgoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlN5c3RlbS5UeXBlLCBib29sPikodyA9PiB3Lk5hbWUuVG9Mb3dlcigpLkVuZHNXaXRoKFwidmlld21vZGVsXCIpKSkuVG9MaXN0KCk7XG5cbiAgICAgICAgICAgIHR5cGVzLkZvckVhY2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OlN5c3RlbS5UeXBlPikoZiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZi5HZXRDdXN0b21BdHRyaWJ1dGVzKHR5cGVvZihTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZSksIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PG9iamVjdD4oYXR0cmlidXRlcykpXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlKGYpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyKGYpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuRGF0YVNvdXJjZXM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcy5JbXBsXG57XG4gICAgY2xhc3MgVGVhbVJlcG9zaXRvcnkgOiBJVGVhbVJlcG9zaXRvcnlcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1zRGF0YVNvdXJjZSBfdGVhbXNEYXRhU291cmNlO1xuXG4gICAgICAgIHB1YmxpYyBUZWFtUmVwb3NpdG9yeShJVGVhbXNEYXRhU291cmNlIHRlYW1zRGF0YVNvdXJjZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGVhbXNEYXRhU291cmNlID0gdGVhbXNEYXRhU291cmNlO1xuICAgICAgICB9ICAgIFxuICAgICAgICBcbiAgICAgICAgcHVibGljIFRlYW0gR2V0VGVhbUJ5SWQoR3VpZCBpZClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW1zID0gdGhpcy5HZXRUZWFtcygpO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbT4odGVhbXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLCBib29sPikoc2QgPT4gc2QuSWQuVG9TdHJpbmcoKS5FcXVhbHMoaWQuVG9TdHJpbmcoKSxTdHJpbmdDb21wYXJpc29uLkludmFyaWFudEN1bHR1cmVJZ25vcmVDYXNlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPFRlYW0+IEdldFRlYW1zKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlYW1zRGF0YVNvdXJjZS5HZXRUZWFtcygpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5EYXRhU291cmNlc1xue1xuICAgIGNsYXNzIFRlYW1zRGF0YVNvdXJjZSA6IElUZWFtc0RhdGFTb3VyY2VcbiAgICB7XG4gICAgICAgIHB1YmxpYyBJRW51bWVyYWJsZTxUZWFtPiBHZXRUZWFtcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtMSA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIkZhbGNvblwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcblxuICAgICAgICAgICAgdmFyIHRlYW0yID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RTZBRjJGNy02MTg0LTREQTAtQjJFNC05NzhFREIzRjQzRDFcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiRHJhZ29uXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0yO1xuXG4gICAgICAgICAgICB2YXIgdGVhbTMgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhENzI0RjAxLUM5RUUtNEYzMS1BODY1LUFGQkQ2QTJEMkJEQVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJSb2Fkc3RlclwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMztcblxuICAgICAgICAgICAgdmFyIHRlYW00ID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiU3BhY2VYXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBHYW1lSHViIDogSUdhbWVIdWJcbiAgICB7XG4gICAgICAgIHByaXZhdGUgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8R2FtZVN0YXRlPiBPbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uUGxheWVyTGVhdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPGludCwgR3VpZD4+IE9uVGFwQ291bnRSZWNlaXZlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPblRvb01hbnlQbGF5ZXJzO1xuXG4gICAgICAgIHB1YmxpYyBHYW1lSHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL3BsYXlcIikuQnVpbGQoKTtcblxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcImdhbWVTdGF0ZU1vZGVcIixuZXcgQWN0aW9uPEdhbWVTdGF0ZT4oKGdhbWVTdGF0ZSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZC5JbnZva2UodGhpcyxnYW1lU3RhdGUpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwibmV3UGxheWVySm9pbmVkXCIsbmV3IEFjdGlvbjxQbGF5ZXIsR3VpZD4oKG5hbWUsdGVhbSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySm9pbmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcixnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInBsYXllckxlYXZlZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblBsYXllckxlYXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblBsYXllckxlYXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ0YXBDb3VudFwiLG5ldyBBY3Rpb248aW50LEd1aWQ+KChuYW1lLHRlYW0pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblRhcENvdW50UmVjZWl2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25UYXBDb3VudFJlY2VpdmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxpbnQsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ0b29NYW55UGxheWVyc1wiLG5ldyBBY3Rpb24oKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uVG9vTWFueVBsYXllcnMhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Ub29NYW55UGxheWVycy5JbnZva2UodGhpcyxudWxsKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKS5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG9uQ29ubmVjdGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vbkNvbm5lY3RlZC5JbnZva2UoKSk6bnVsbCksIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiB7fSkpXG4gICAgICAgICAgICAgICAgLkNhdGNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiBHbG9iYWwuQWxlcnQoby5Ub1N0cmluZygpKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzdGFydEdhbWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJvcGVuUmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgTm90aWZ5SUFtVGhlQWRtaW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInNldFVwQWRtaW5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHRvZG9cbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwicmVzdGFydCFcIik7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInJlU3RhcnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wR2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwiU3RvcEdhbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcbntcbiAgICBjbGFzcyBNb3ZlSXRIdWIgOiBJTW92ZUl0SHViXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25MZWZ0Q2hhbmdlZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uVG9wQ2hhbmdlZDtcblxuICAgICAgICBwdWJsaWMgTW92ZUl0SHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKFwiL21vdmVJdFwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZVRvcFwiLG5ldyBBY3Rpb248aW50PigodG9wKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Ub3BDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9wQ2hhbmdlZC5JbnZva2UodGhpcyx0b3ApKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZUxlZnRcIixuZXcgQWN0aW9uPGludD4oKGxlZnQpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkxlZnRDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTGVmdENoYW5nZWQuSW52b2tlKHRoaXMsbGVmdCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KEFjdGlvbiBvbkNvbm5lY3RlZCA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRUb3AoaW50IHRvcClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwic2VuZFRvcFwiLCB0b3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU2VuZExlZnQoaW50IGxlZnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRMZWZ0XCIsIGxlZnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59Il0KfQo=
