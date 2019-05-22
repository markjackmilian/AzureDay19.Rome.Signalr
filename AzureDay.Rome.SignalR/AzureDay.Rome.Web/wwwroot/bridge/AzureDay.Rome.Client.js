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
                        return Bridge.referenceEquals(sd.id.toString(), tuple.Item1.id.toString());
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
                    this.FinishLine = 1000;
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
                this._connection.onclose(function (error) {
                    Bridge.global.alert("Disconnected!");
                });

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vZGVscy9UZWFtVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1N0YXJ0R2FtZVZpZXdNb2RlbC5jcyIsIkN1c3RvbVJvdXRlc0NvbmZpZy5jcyIsIlNwYWZBcHAuY3MiLCJSZXBvc2l0b3JpZXMvSW1wbC9UZWFtUmVwb3NpdG9yeS5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIiwiSHVicy9JbXBsL01vdmVJdEh1Yi5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzlCWEE7O2dCQUVq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bUJBQU9BLEFBQWdDQSx3QkFDcktBLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs3REE7OztnQkFLQUE7OztnQkFLQUE7OztnQkFLQUE7OztnQkFNQUE7Z0JBQ0FBOzs7Z0JBS0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDckVBQSxtQkFBb0JBLElBQUlBO2dCQUN4QkEsaUNBQWdDQSxBQUFnQkEsK0JBQUNBO29CQUU3Q0Esd0NBQW1CQSxRQUFLQSxBQUFxQ0Esa0JBQXlCQSxNQUFLQSxPQUFNQTs7Z0JBRXJHQSxrQ0FBaUNBLEFBQWdCQSwrQkFBQ0E7b0JBRTlDQSx5Q0FBb0JBLFFBQUtBLEFBQXFDQSxtQkFBMEJBLE1BQUtBLFFBQU9BOzs7Ozs2QkFJMUZBOztnQkFFZEE7OztnQkFLQUE7OytCQUdnQkE7Z0JBRWhCQSxpQ0FBaUNBOztnQ0FHaEJBO2dCQUVqQkEsa0NBQWtDQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8VEs+IF9jb21wbGV0ZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFdmVudEluZm8gX2V2ZW50SW5mbztcclxuICAgICAgICBwcml2YXRlIFQgX29iajtcclxuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xyXG5wdWJsaWMgVGFzazxUSz4gVGFza1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUuVGFzaztcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBXYWl0Rm9yTWUoVCBvYmosIHN0cmluZyBldmVudE5BbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN1YnNjcmliZShvYmosIGV2ZW50TkFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgV2FpdEZvck1lKFQgb2JqLCBGdW5jPFQsIHN0cmluZz4gZXZlbnRuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iaiA9IG9iajtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOdWxsUmVmZXJlbmNlRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJFdmVudCB3aXRoIG5hbWUgezB9IG5vdCBmb3VuZCBvbiBvYmplY3Qgb2YgdHlwZSB7MX1cIixldmVudE5hbWUsdHlwZW9mKFQpKSk7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2RJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXIgPSBEZWxlZ2F0ZS5DcmVhdGVEZWxlZ2F0ZSh0eXBlb2YoVEspLCB0aGlzLCBtZXRob2RJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SW5mby5SZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fb2JqLCB0aGlzLl9oYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRlYW1WaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgR3VpZCBJZCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBOYW1lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIENzc0NsYXNzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGRvdWJsZT4gU2NvcmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8aW50PiBIb3dNYW55IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gU2NyZWVuUG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxQbGF5ZXI+IFBsYXllcnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8Ym9vbD4gSXNXaW5uZXIgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVGVhbVZpZXdNb2RlbChUZWFtIHRlYW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLklkID0gdGVhbS5JZDtcclxuICAgICAgICAgICAgdGhpcy5OYW1lID0gdGVhbS5OYW1lO1xyXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzID0gdGhpcy5OYW1lLlJlcGxhY2UoXCIgXCIsIFwiX1wiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuU2NvcmUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8ZG91YmxlPigpO1xyXG4gICAgICAgICAgICB0aGlzLkhvd01hbnkgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8aW50PigpO1xyXG4gICAgICAgICAgICB0aGlzLlNjcmVlblBvc2l0aW9uID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oKTtcclxuICAgICAgICAgICAgdGhpcy5Jc1dpbm5lciA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxib29sPigpO1xyXG4gICAgICAgICAgICB0aGlzLlBsYXllcnMgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlQXJyYXkuU2VsZjxQbGF5ZXI+KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLlNjb3JlLnN1YnNjcmliZSgoZ2xvYmFsOjpSZXR5cGVkLmtub2Nrb3V0Lktub2Nrb3V0U3Vic2NyaWJhYmxlPGRvdWJsZT4uc3Vic2NyaWJlRm4pKHZhbHVlID0+IHRoaXMuU2NyZWVuUG9zaXRpb24uU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix2YWx1ZSkpKSk7XHJcbiAgICAgICAgICAgIHRoaXMuUGxheWVycy5zdWJzY3JpYmUoKGdsb2JhbDo6UmV0eXBlZC5rbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4uc3Vic2NyaWJlRm4yKSh2YWx1ZSA9PiB0aGlzLkhvd01hbnkuU2VsZih0aGlzLlBsYXllcnMuU2VsZigpLkxlbmd0aCkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xyXG51c2luZyBCcmlkZ2UuU3BhZjtcclxudXNpbmcgUmV0eXBlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3ZlSXRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU1vdmVJdEh1YiBfbW92ZUl0SHViO1xyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLk1vdmVJdElkO1xyXG59XHJcbiAgICAgICAgcHJpdmF0ZSBpbnQgX3RvcCA9IDA7XHJcbiAgICAgICAgcHJpdmF0ZSBpbnQgX2xlZnQgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBUb3AgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBMZWZ0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIE1vdmVJdFZpZXdNb2RlbChJTW92ZUl0SHViIG1vdmVJdEh1YilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1YiA9IG1vdmVJdEh1YjtcclxuICAgICAgICAgICAgdGhpcy5Ub3AgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl90b3ApKTtcclxuICAgICAgICAgICAgdGhpcy5MZWZ0ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fbGVmdCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uTGVmdENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uTGVmdENoYW5nZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PblRvcENoYW5nZWQgKz0gdGhpcy5Nb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBNb3ZlSXRIdWJPbk9uVG9wQ2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGU7XHJcbiAgICAgICAgICAgIHRoaXMuVG9wLlNlbGYoc3RyaW5nLkZvcm1hdChcInswfXB4XCIsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25MZWZ0Q2hhbmdlZChvYmplY3Qgc2VuZGVyLCBpbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBlO1xyXG4gICAgICAgICAgICB0aGlzLkxlZnQuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdGFydCgpO1xyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlN0b3AoKTtcclxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fdG9wKz0xMDtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLlNlbmRUb3AodGhpcy5fdG9wKTtcclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlRvcDogezB9XCIsdGhpcy5fdG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW5MZWZ0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQrPTEwO1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZExlZnQodGhpcy5fbGVmdCk7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJMZWZ0OiB7MH1cIix0aGlzLl9sZWZ0KSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuQ2xhc3NlcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGU7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLlNwYWY7XHJcbnVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3RhcnRHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBGaW5pc2hMaW5lT2Zmc2V0ID0gMTcwO1xyXG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IFNwYWNlU2hpcFdpZHRoID0gMTc4O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJVGVhbVJlcG9zaXRvcnkgX3RlYW1SZXBvc2l0b3J5O1xyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIF90YXBDb3VudDtcclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5TdGFydEdhbWVJZDtcclxufVxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8R2FtZVN0YXRlPiBTdGF0ZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxUZWFtVmlld01vZGVsPiBUZWFtVmlld01vZGVscyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTdGFydEdhbWVWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSVRlYW1SZXBvc2l0b3J5IHRlYW1SZXBvc2l0b3J5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XHJcbiAgICAgICAgICAgIHRoaXMuX3RlYW1SZXBvc2l0b3J5ID0gdGVhbVJlcG9zaXRvcnk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sZ2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPih0aGlzLl90ZWFtUmVwb3NpdG9yeS5HZXRUZWFtcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSwgZ2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPikocyA9PiBuZXcgVGVhbVZpZXdNb2RlbChzKSkpLlRvQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFRlYW1WaWV3TW9kZWw+KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLnB1c2godGVhbXMpO1xyXG4gICAgICAgICAgICB0aGlzLlN0YXRlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPEdhbWVTdGF0ZT4oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8UGxheWVyLCBHdWlkPiB0dXBsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBsYXllciA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPih0aGlzLkFMbFBsYXllcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpID09IHR1cGxlLkl0ZW0xLklkLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoc3RyaW5nLkZvcm1hdChcIklsIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX0gY2kgaGEgbGFzY2lhdG8gcHJlbWF0dXJhbWVudGUuXCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZChvYmplY3Qgc2VuZGVyLCBUdXBsZTxQbGF5ZXIsIEd1aWQ+IHR1cGxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKHR1cGxlLkl0ZW0yKTtcclxuICAgICAgICAgICAgdGVhbS5QbGF5ZXJzLnB1c2godHVwbGUuSXRlbTEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLlN1Y2Nlc3Moc3RyaW5nLkZvcm1hdChcIk51b3ZvIGdpb2NhdG9yZSB7MH0gZGVsbGEgc3F1YWRyYSB7MX1cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgR2FtZVN0YXRlIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlN0YXRlLlNlbGYoZSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkNsb3NlZDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlc2V0VGVhbXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlJlZ2lzdGVyOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gR2xvYmFsLkRvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKS5PZmZzZXRXaWR0aC1GaW5pc2hMaW5lT2Zmc2V0LVNwYWNlU2hpcFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhcENvdW50ID0gd2lkdGggLyBTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIldpZHRoOiB7MH1cIix3aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJGaW5pc2hMaW5lOiB7MH1cIixTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmUpKTtcclxuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVGFwQ291bnQ6IHswfVwiLHRoaXMuX3RhcENvdW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5GaW5pc2hlZDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUV4Y2VwdGlvbihcImVcIiwgZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVzZXRUZWFtcygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZi5QbGF5ZXJzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgICAgICAgICAgZi5TY29yZS5TZWxmKDApO1xyXG4gICAgICAgICAgICAgICAgZi5Jc1dpbm5lci5TZWxmKGZhbHNlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0gPSB0aGlzLkdldFRlYW1CeUlkKGUuSXRlbTIpO1xyXG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoZS5JdGVtMSp0aGlzLl90YXBDb3VudCk7XHJcblN5c3RlbS5BcnJheUV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KFxyXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT4gZi5Jc1dpbm5lci5TZWxmKGZhbHNlKSkpO1xyXG5TeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk9yZGVyQnlEZXNjZW5kaW5nPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCxkb3VibGU+KCAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgZG91YmxlPikobyA9PiBvLlNjb3JlLlNlbGYoKSkpLkZpcnN0KCkuSXNXaW5uZXIuU2VsZih0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0R2FtZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlJlU3RhcnRHYW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCArPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgKz0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB0aGlzLl9nYW1lSHViLk5vdGlmeUlBbVRoZUFkbWluKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBPblRvb01hbnlQbGF5ZXJzKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uLldhcm5pbmcoXCJUcm9wcGkgdXRlbnRpLi4gZ2lvY2F0b3JlIGVzY2x1c28uIDooXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCAtPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uUGxheWVyTGVhdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgLT0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBPcGVuUmVnaXN0cmF0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT3BlblJlZ2lzdHJhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdG9wR2FtZSgpO1xyXG4gICAgICAgIH1cclxucHJpdmF0ZSBUZWFtVmlld01vZGVsIEdldFRlYW1CeUlkKEd1aWQgaWQpXHJcbntcclxuICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgYm9vbD4pKHMgPT4gcy5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpKSkpO1xyXG59cHJpdmF0ZSBJRW51bWVyYWJsZTxQbGF5ZXI+IEFMbFBsYXllcnNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0TWFueTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsZ2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+KHRoaXMuVGVhbVZpZXdNb2RlbHMuU2VsZigpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCwgZ2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JRW51bWVyYWJsZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4+KShzbSA9PiBzbS5QbGF5ZXJzLlNlbGYoKSkpO1xyXG4gICAgfVxyXG59ICAgIH1cclxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzO1xyXG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcclxue1xyXG4gICAgY2xhc3MgQ3VzdG9tUm91dGVzQ29uZmlnIDogQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IENyZWF0ZVJvdXRlcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9tb3ZlSXQuaHRtbFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLk1vdmVJdElkLFxyXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxNb3ZlSXRWaWV3TW9kZWw+KClcclxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvc3RhcnRHYW1lLmh0bWxcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5TdGFydEdhbWVJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8U3RhcnRHYW1lVmlld01vZGVsPigpXHJcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5Nb3ZlSXRJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xyXG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGw7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlJlcG9zaXRvcmllcztcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzLkltcGw7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5Jb2M7XHJcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XHJcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xyXG51c2luZyBCcmlkZ2UuU3BhZi5BdHRyaWJ1dGVzO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJSW9jIENvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29udGFpbmVyID0gbmV3IEJyaWRnZUlvYygpO1xyXG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIG5hdmlnYXRvclxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUJyb3dzZXJIaXN0b3J5TWFuYWdlciwgUXVlcnlQYXJhbWV0ZXJOYXZpZ2F0aW9uSGlzdG9yeT4oKTtcclxuLy8gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBDb21wbGV4T2JqZWN0TmF2aWdhdGlvbkhpc3Rvcnk+KCk7IC8vIGlmIHlvdSBkb24ndCBuZWVkIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXHJcblxyXG4gICAgICAgICAgICAvLyBtZXNzZW5nZXJcclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZpZXdtb2RlbHNcclxuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XHJcblxyXG4gICAgICAgICAgICAvLyByZWdpc3RlciBjdXN0b20gcmVzb3VyY2UsIHNlcnZpY2VzLi5cclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1vdmVJdEh1YiwgTW92ZUl0SHViPigpO1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJR2FtZUh1YiwgR2FtZUh1Yj4oKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtc0RhdGFTb3VyY2UsIFRlYW1zRGF0YVNvdXJjZT4oKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbVJlcG9zaXRvcnksIFRlYW1SZXBvc2l0b3J5PigpO1xyXG4gICAgICAgIH1cclxuI3JlZ2lvbiBQQUdFUyBJRFNcclxuLy8gc3RhdGljIHBhZ2VzIGlkXHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIEhvbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJob21lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBNb3ZlSXRJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJtb3ZlSXRcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFN0YXJ0R2FtZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInN0YXJ0R2FtZVwiO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgI2VuZHJlZ2lvblxyXG5cclxuICAgICAgICAjcmVnaW9uIE1FU1NBR0VTXHJcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjbGFzcyBNZXNzYWdlc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIGNsYXNzIEdsb2JhbFNlbmRlciB7IH07XHJcblxyXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc3RyaW5nIExvZ2luRG9uZSA9PiBcIkxvZ2luRG9uZVwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cclxuICAgICAgICAvLy8gWW91IGNhbiByZWdpc3RlciBhIHZpZXdtb2RlIGFzIFNpbmdsciBJbnN0YW5jZSBhZGRpbmcgXCJTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZVwiIHRvIHRoZSBjbGFzc1xyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXHJcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZi5HZXRDdXN0b21BdHRyaWJ1dGVzKHR5cGVvZihTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZSksIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlKGYpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xyXG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbFxyXG57XHJcbiAgICBjbGFzcyBUZWFtUmVwb3NpdG9yeSA6IElUZWFtUmVwb3NpdG9yeVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVRlYW1zRGF0YVNvdXJjZSBfdGVhbXNEYXRhU291cmNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgVGVhbVJlcG9zaXRvcnkoSVRlYW1zRGF0YVNvdXJjZSB0ZWFtc0RhdGFTb3VyY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl90ZWFtc0RhdGFTb3VyY2UgPSB0ZWFtc0RhdGFTb3VyY2U7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgVGVhbSBHZXRUZWFtQnlJZChHdWlkIGlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW1zID0gdGhpcy5HZXRUZWFtcygpO1xyXG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtPih0ZWFtcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpLFN0cmluZ0NvbXBhcmlzb24uSW52YXJpYW50Q3VsdHVyZUlnbm9yZUNhc2UpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlYW1zRGF0YVNvdXJjZS5HZXRUZWFtcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xyXG5cclxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzXHJcbntcclxuICAgIGNsYXNzIFRlYW1zRGF0YVNvdXJjZSA6IElUZWFtc0RhdGFTb3VyY2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiNzREQjgwMDMtMjM0OC00OThGLUI3NzMtMUM0Q0UwRkQ2OUEyXCIpLFxyXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiRmFsY29uXCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiB0ZWFtMTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZWFtMiA9IG5ldyBUZWFtXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcclxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIkRyYWdvblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTI7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbTMgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI4RDcyNEYwMS1DOUVFLTRGMzEtQTg2NS1BRkJENkEyRDJCREFcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJSb2Fkc3RlclwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTM7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVhbTQgPSBuZXcgVGVhbVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCIwRDJDMzdGNy00OUZFLTQ4RDktQTFEMy0xQTkwRTc5NDhCQ0NcIiksXHJcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJTcGFjZVhcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW00O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XHJcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXHJcbntcclxuICAgIGNsYXNzIEdhbWVIdWIgOiBJR2FtZUh1YlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPEdhbWVTdGF0ZT4gT25HYW1lU3RhdGVSZWNlaXZlZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPFR1cGxlPFBsYXllciwgR3VpZD4+IE9uTmV3UGxheWVySm9pbmVkO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25QbGF5ZXJMZWF2ZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxUdXBsZTxpbnQsIEd1aWQ+PiBPblRhcENvdW50UmVjZWl2ZWQ7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPblRvb01hbnlQbGF5ZXJzO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZUh1YigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvcGxheVwiKS5CdWlsZCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uQ2xvc2UoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKGVycm9yID0+IEdsb2JhbC5BbGVydChcIkRpc2Nvbm5lY3RlZCFcIikpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkLkludm9rZSh0aGlzLGdhbWVTdGF0ZSkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJuZXdQbGF5ZXJKb2luZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uTmV3UGxheWVySm9pbmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTmV3UGxheWVySm9pbmVkLkludm9rZSh0aGlzLFR1cGxlLkNyZWF0ZTxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcixnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInBsYXllckxlYXZlZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT25QbGF5ZXJMZWF2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25QbGF5ZXJMZWF2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidGFwQ291bnRcIixuZXcgQWN0aW9uPGludCxHdWlkPigobmFtZSx0ZWFtKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uVGFwQ291bnRSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRhcENvdW50UmVjZWl2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGludCxnbG9iYWw6OlN5c3RlbS5HdWlkPihuYW1lLHRlYW0pKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInRvb01hbnlQbGF5ZXJzXCIsbmV3IEFjdGlvbigoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uVG9vTWFueVBsYXllcnMhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25Ub29NYW55UGxheWVycy5JbnZva2UodGhpcyxudWxsKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKS5UaGVuKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG9uQ29ubmVjdGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5vbkNvbm5lY3RlZC5JbnZva2UoKSk6bnVsbCksIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248b2JqZWN0PikobyA9PiB7fSkpXHJcbiAgICAgICAgICAgICAgICAuQ2F0Y2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3Q+KShvID0+IEdsb2JhbC5BbGVydChvLlRvU3RyaW5nKCkpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnRHYW1lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic3RhcnRHYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgT3BlblJlZ2lzdHJhdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcIm9wZW5SZWdpc3RyYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBOb3RpZnlJQW1UaGVBZG1pbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcInNldFVwQWRtaW5cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyB0b2RvXHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwicmVzdGFydCFcIik7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwicmVTdGFydFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3BHYW1lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwiU3RvcEdhbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcclxuXHJcbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGxcclxue1xyXG4gICAgY2xhc3MgTW92ZUl0SHViIDogSU1vdmVJdEh1YlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSHViQ29ubmVjdGlvbiBfY29ubmVjdGlvbjtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25MZWZ0Q2hhbmdlZDtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyPGludD4gT25Ub3BDaGFuZ2VkO1xyXG5cclxuICAgICAgICBwdWJsaWMgTW92ZUl0SHViKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9tb3ZlSXRcIikuQnVpbGQoKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInVwZGF0ZVRvcFwiLG5ldyBBY3Rpb248aW50PigodG9wKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk9uVG9wQ2hhbmdlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRvcENoYW5nZWQuSW52b2tlKHRoaXMsdG9wKSk6bnVsbDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidXBkYXRlTGVmdFwiLG5ldyBBY3Rpb248aW50PigobGVmdCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PbkxlZnRDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uTGVmdENoYW5nZWQuSW52b2tlKHRoaXMsbGVmdCkpOm51bGw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoQWN0aW9uIG9uQ29ubmVjdGVkID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU3RhcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kVG9wKGludCB0b3ApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kVG9wXCIsIHRvcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kTGVmdChpbnQgbGVmdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRMZWZ0XCIsIGxlZnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxufSJdCn0K
