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
                        this._tapCount = width / AzureDay.Rome.Remote.SharedConfiguration.FinishLine;
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
                team.Score(Bridge.Int.clip32(e.Item1 * this._tapCount));
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
                    this.MaxPlayers = 60;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL01vZGVscy9UZWFtVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9Nb3ZlSXRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1N0YXJ0R2FtZVZpZXdNb2RlbC5jcyIsIkN1c3RvbVJvdXRlc0NvbmZpZy5jcyIsIlNwYWZBcHAuY3MiLCJSZXBvc2l0b3JpZXMvSW1wbC9UZWFtUmVwb3NpdG9yeS5jcyIsIi4uL0F6dXJlRGF5LlJvbWUuU2hhcmVkL0RhdGFTb3VyY2VzL1RlYW1zRGF0YVNvdXJjZS5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIiwiSHVicy9JbXBsL01vdmVJdEh1Yi5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWlCUUEsT0FBT0E7Ozs7OztpQ0FUK0NBLElBQUlBOzs4QkFZekNBLEtBQU9BOztnQkFFcEJBLGVBQWVBLEtBQUtBOzs0QkFHUEEsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0EsVUFBaUJBOzs7O2lDQUdsQkEsS0FBT0E7Z0JBRTFCQSxZQUFZQTtnQkFDWkEsa0JBQWtCQSw2QkFBT0EsV0FBWUE7Z0JBQ3JDQSxJQUFJQSxtQkFBbUJBO29CQUNuQkEsTUFBTUEsSUFBSUEscUNBQXVCQSw0RUFBb0VBLFdBQVVBLEFBQU9BOztnQkFDMUhBLGlCQUFpQkEsc0RBQXVDQTs7Z0JBRXhEQSxJQUFJQSxjQUFjQTtvQkFDZEEsTUFBTUEsSUFBSUE7OztnQkFFZEEsZ0JBQWdCQSxpQ0FBMENBLFlBQU5BO2dCQUNwREEsNENBQWdDQSxLQUFLQTs7a0NBR2pCQSxRQUFlQTtnQkFFbkNBLDJDQUFtQ0EsV0FBV0E7Z0JBQzlDQSw0QkFBNEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQzlCWEE7O2dCQUVqQkEsVUFBVUE7Z0JBQ1ZBLFlBQVlBO2dCQUNaQSxnQkFBZ0JBOztnQkFFaEJBLGFBQWFBO2dCQUNiQSxlQUFlQTtnQkFDZkEsc0JBQXNCQTtnQkFDdEJBLGdCQUFnQkE7Z0JBQ2hCQSxlQUFlQTs7Z0JBRWZBLHFCQUFxQkEsQUFBb0VBO29CQUFTQSxvQkFBeUJBLCtCQUFzQkE7O2dCQUNqSkEsdUJBQXVCQSxBQUFxR0E7b0JBQVNBLGFBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQ1ZwSUE7OztnQkFFbkJBLGtCQUFrQkE7Z0JBQ2xCQSxXQUFXQSxjQUFvQ0EsK0JBQXNCQTtnQkFDckVBLFlBQVlBLGNBQW9DQSwrQkFBc0JBOztnQkFFdEVBLHNFQUFpQ0E7Z0JBQ2pDQSxxRUFBZ0NBOzs7OztnQkFmeENBLE9BQU9BOzsrQ0FrQmtDQSxRQUFlQTtnQkFFaERBLFlBQVlBO2dCQUNaQSxTQUFjQSwrQkFBc0JBOztnREFHRkEsUUFBZUE7Z0JBRWpEQSxhQUFhQTtnQkFDYkEsVUFBZUEsK0JBQXNCQTs7OEJBR2JBO2dCQUV4QkE7Z0JBQ0FBLDBEQUFZQTs7O2dCQUtaQTtnQkFDQUE7OztnQkFLQUE7Z0JBQ0FBLDZEQUF3QkE7Z0JBQ3hCQSx5QkFBa0JBLGtDQUF5QkE7OztnQkFLM0NBO2dCQUNBQSw4REFBeUJBO2dCQUN6QkEseUJBQWtCQSxtQ0FBMEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JDbUdoREEsT0FBT0EsNEJBQW9JQSxrQ0FBMkJBLEFBQXlLQTttQ0FBTUE7Ozs7Ozs7Ozs7NEJBckkzVEEsU0FBa0JBOzs7Z0JBRXhDQSxnQkFBZ0JBO2dCQUNoQkEsdUJBQXVCQTs7Z0JBRXZCQSxZQUFZQSw0QkFBOEhBLDBGQUFnQ0EsQUFBdUhBOytCQUFLQSxJQUFJQSxxREFBY0E7O2dCQUN4VEEsc0JBQXNCQTs7Z0JBRXRCQSxvREFBeUJBO2dCQUN6QkEsYUFBYUE7Ozs7O2dCQWZyQkEsT0FBT0E7OytDQW1Ca0NBLFFBQWVBO2dCQUVoREEsa0JBQWtCQSw0QkFBNEVBLGlDQUFnQkEsQUFBaUVBOytCQUFNQSx5Q0FBb0JBOztnQkFDek1BLElBQUlBLGVBQWVBO29CQUFNQTs7O2dCQUV6QkEsV0FBV0EsbUZBQWlDQTs7Z0JBRTVDQSx5SEFBcUJBLDBGQUFrRkEsa0JBQWlCQSxRQUFNQSxPQUFLQSxZQUFVQSxBQUFRQTs7a0RBR2pIQSxRQUFlQTtnQkFFbkRBLFdBQVdBLGlCQUFpQkE7Z0JBQzVCQSxrQkFBa0JBOztnQkFFbEJBLHlIQUFxQkEsOERBQXNEQSxrQkFBaUJBLFFBQU1BLE9BQUtBLFlBQVVBLEFBQVFBOztvREFHbkZBLFFBQWVBO2dCQUVyREEsV0FBZ0JBOztnQkFFaEJBLFFBQVFBO29CQUVKQSxLQUFLQTt3QkFDREE7d0JBQ0FBO29CQUNKQSxLQUFLQTt3QkFDREE7b0JBQ0pBLEtBQUtBO3dCQUNEQSxZQUFZQSxrRUFBc0RBLDRFQUFpQkE7d0JBQ25GQSxpQkFBaUJBLEFBQVFBLFFBQVFBLEFBQVFBO3dCQUN6Q0EseUJBQWtCQSxvQ0FBMkJBO3dCQUM3Q0EseUJBQWtCQSx5Q0FBZ0NBO3dCQUNsREEseUJBQWtCQSx1Q0FBOEJBO3dCQUNoREE7b0JBQ0pBLEtBQUtBO3dCQUNEQTtvQkFDSkE7d0JBQ0lBLE1BQU1BLElBQUlBLCtDQUFpQ0EsdUdBQUdBOzs7OztnQkFPbEVBLEFBQXlHQSw4QkFBMkJBLEFBQXNGQTt3QkFFMU1BO3dCQUNBQTt3QkFDQUE7OzttREFLaUNBLFFBQWVBO2dCQUVwREEsV0FBV0EsaUJBQWlCQTtnQkFDNUJBLFdBQWdCQSxrQkFBS0EsQUFBQ0EsVUFBUUE7Z0JBQzFDQSxBQUNZQSw4QkFBMkJBLEFBQXNGQTt3QkFBS0E7O2dCQUNsSUEsNEJBQTBIQSx5Q0FBMkJBLEFBQTRGQTsrQkFBS0E7Ozs7Z0JBSzFPQTs7O2dCQUtBQTs7OEJBR3dCQTtnQkFFeEJBLDBEQUFZQTs7Z0JBRVpBLHdFQUFxQ0E7Z0JBQ3JDQSxzRUFBbUNBO2dCQUNuQ0EsbUVBQWdDQTtnQkFDaENBLHVFQUFvQ0E7Z0JBQ3BDQSxxRUFBa0NBOztnQkFFbENBLHVEQUFvQkEsQUFBd0JBO29CQUFNQTs7O3dDQUd4QkEsUUFBZUE7Z0JBRXpDQTs7O2dCQU1BQSwyRUFBcUNBO2dCQUNyQ0EseUVBQW1DQTtnQkFDbkNBLHNFQUFnQ0E7Z0JBQ2hDQSwwRUFBb0NBO2dCQUNwQ0Esd0VBQWtDQTs7Z0JBRWxDQTs7O2dCQUtBQTs7O2dCQUtBQTs7bUNBRXNCQTtnQkFFOUJBLE9BQU9BLDRCQUE0RkEsOEJBQTJCQSxBQUEwRkE7K0JBQUtBLHNDQUF1QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkM3SDNNQTs4QkFBMEVBOzs7Ozs7Z0JBeEIzR0EsT0FBT0EsQUFBMERBLFVBQUNBOzt3QkFBT0EsUUFBUUEsVUFBSUEseURBRTNEQTs7NkNBQ0hBOztvQ0FDVEEsa0RBQ1dBO21DQUFNQTs7d0JBQ3hCQSxRQUFRQSxVQUFJQSx5REFFT0E7OzZDQUNIQTs7b0NBQ1RBLHFEQUNXQTttQ0FBTUE7O3dCQUN4QkEsT0FBT0E7c0JBWnVCQSxLQUFJQTs7Ozs7OztZQ1d6Q0EsZ0NBQVlBLElBQUlBO1lBQ2hCQTtZQUNBQTs7Ozs7Ozs7Ozt3QkFpQ0pBOzs7Ozt3QkFNQUE7Ozs7O3dCQU1BQTs7Ozs7O29CQXRDSUE7b0JBQ0FBO29CQUVBQTs7b0JBR0FBOztvQkFHQUE7O29CQUdBQTtvQkFDQUE7O29CQUVBQTs7O29CQUdBQTs7Ozs7Ozs7Ozs7OztvQkErQ0FBLFlBQVlBLDRCQUEwRkEsNkNBQXdDQSxBQUErSEE7bUNBQUtBO2lDQUN2UUEsQUFBaURBOytCQUFLQTs7O29CQUVqRUEsY0FBY0EsQUFBNkNBO3dCQUV2REEsaUJBQWlCQSxtQ0FBc0JBLEFBQU9BOzt3QkFFOUNBLElBQUlBLDRCQUFtQ0E7NEJBQ25DQSxxRUFBaUNBOzs0QkFFakNBLHVEQUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQXpCU0EsSUFBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNyRXRCQTs7Z0JBRWxCQSx3QkFBd0JBOzs7O21DQUdKQTtnQkFFcEJBLFlBQVlBO2dCQUNaQSxPQUFPQSw0QkFBMEVBLHVCQUFNQSxBQUErREE7K0JBQU1BLHVDQUF3QkEsZUFBY0E7Ozs7Z0JBS2xNQSxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0NDZlBBLFFBQVlBLFVBQUlBLHFDQUVQQTs0Q0FHVEEsc0JBQWFBOzs7Ozt3Q0FFYkEsUUFBWUEsVUFBSUEscUNBRVBBOzRDQUdUQSxzQkFBYUE7Ozs7O3dDQUViQSxRQUFZQSxVQUFJQSxxQ0FFUEE7NENBR1RBLHNCQUFhQTs7Ozs7d0NBRWJBLFFBQVlBLFVBQUlBLHFDQUVQQTs0Q0FHVEEsc0JBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDakJiQSxtQkFBb0JBLElBQUlBO2dCQUN4QkEseUJBQXlCQSxBQUE4Q0E7b0JBQVNBOzs7Z0JBRWhGQSxxQ0FBb0NBLEFBQXNCQSwrQkFBQ0E7b0JBRXZEQSwrQ0FBMEJBLFFBQUtBLEFBQXFDQSx5QkFBZ0NBLE1BQUtBLGFBQVlBOzs7Z0JBR3pIQSx1Q0FBc0NBLEFBQXdCQSwrQkFBQ0EsTUFBS0E7b0JBRWhFQSw2Q0FBd0JBLFFBQUtBLEFBQXFDQSx1QkFBOEJBLE1BQUtBLFNBQXNFQSxhQUFLQSxVQUFRQTs7O2dCQUc1TEEsb0NBQW1DQSxBQUF3QkEsK0JBQUNBLE1BQUtBO29CQUU3REEsMENBQXFCQSxRQUFLQSxBQUFxQ0Esb0JBQTJCQSxNQUFLQSxTQUFzRUEsYUFBS0EsVUFBUUE7OztnQkFHdExBLGdDQUErQkEsQUFBcUJBLCtCQUFDQSxNQUFLQTtvQkFFdERBLDhDQUF5QkEsUUFBS0EsQUFBcUNBLHdCQUErQkEsTUFBS0EsU0FBc0NBLGFBQUtBLFVBQVFBOzs7Z0JBRzlKQSxzQ0FBcUNBLEFBQVdBO29CQUU1Q0EsNENBQXVCQSxRQUFLQSxBQUFxQ0Esc0JBQTZCQSxNQUFLQSxRQUFPQTs7Ozs7NkJBSWhHQTs7Z0JBRWRBLDhCQUE4QkEsQUFBd0JBO29CQUFNQSxrQ0FBYUEsUUFBS0EsQUFBcUNBLGdCQUFzQkE7bUJBQU9BLEFBQWdDQSx3QkFDcktBLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs3REE7OztnQkFLQUE7OztnQkFLQUE7OztnQkFLQUE7OztnQkFNQUE7Z0JBQ0FBOzs7Z0JBS0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDckVBQSxtQkFBb0JBLElBQUlBO2dCQUN4QkEsaUNBQWdDQSxBQUFnQkEsK0JBQUNBO29CQUU3Q0Esd0NBQW1CQSxRQUFLQSxBQUFxQ0Esa0JBQXlCQSxNQUFLQSxPQUFNQTs7Z0JBRXJHQSxrQ0FBaUNBLEFBQWdCQSwrQkFBQ0E7b0JBRTlDQSx5Q0FBb0JBLFFBQUtBLEFBQXFDQSxtQkFBMEJBLE1BQUtBLFFBQU9BOzs7Ozs2QkFJMUZBOztnQkFFZEE7OztnQkFLQUE7OytCQUdnQkE7Z0JBRWhCQSxpQ0FBaUNBOztnQ0FHaEJBO2dCQUVqQkEsa0NBQWtDQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLkNsaWVudC5DbGFzc2VzXG57XG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4gX2NvbXBsZXRlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPigpO1xuXG4gICAgICAgIHByaXZhdGUgRXZlbnRJbmZvIF9ldmVudEluZm87XG4gICAgICAgIHByaXZhdGUgVCBfb2JqO1xuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xucHVibGljIFRhc2s8VEs+IFRhc2tcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlLlRhc2s7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgc3RyaW5nIGV2ZW50TkFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudE5BbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgRnVuYzxULCBzdHJpbmc+IGV2ZW50bmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE51bGxSZWZlcmVuY2VFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV2ZW50IHdpdGggbmFtZSB7MH0gbm90IGZvdW5kIG9uIG9iamVjdCBvZiB0eXBlIHsxfVwiLGV2ZW50TmFtZSx0eXBlb2YoVCkpKTtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcblxuICAgICAgICAgICAgdGhpcy5faGFuZGxlciA9IERlbGVnYXRlLkNyZWF0ZURlbGVnYXRlKHR5cGVvZihUSyksIHRoaXMsIG1ldGhvZEluZm8pO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLlJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9vYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xudXNpbmcgUmV0eXBlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFRlYW1WaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHB1YmxpYyBHdWlkIElkIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIHN0cmluZyBOYW1lIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIHN0cmluZyBDc3NDbGFzcyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8ZG91YmxlPiBTY29yZSB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8aW50PiBIb3dNYW55IHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBTY3JlZW5Qb3NpdGlvbiB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGVBcnJheTxQbGF5ZXI+IFBsYXllcnMgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPGJvb2w+IElzV2lubmVyIHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMgVGVhbVZpZXdNb2RlbChUZWFtIHRlYW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuSWQgPSB0ZWFtLklkO1xuICAgICAgICAgICAgdGhpcy5OYW1lID0gdGVhbS5OYW1lO1xuICAgICAgICAgICAgdGhpcy5Dc3NDbGFzcyA9IHRoaXMuTmFtZS5SZXBsYWNlKFwiIFwiLCBcIl9cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuU2NvcmUgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8ZG91YmxlPigpO1xuICAgICAgICAgICAgdGhpcy5Ib3dNYW55ID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPGludD4oKTtcbiAgICAgICAgICAgIHRoaXMuU2NyZWVuUG9zaXRpb24gPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPigpO1xuICAgICAgICAgICAgdGhpcy5Jc1dpbm5lciA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxib29sPigpO1xuICAgICAgICAgICAgdGhpcy5QbGF5ZXJzID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZUFycmF5LlNlbGY8UGxheWVyPigpO1xuXG4gICAgICAgICAgICB0aGlzLlNjb3JlLnN1YnNjcmliZSgoZ2xvYmFsOjpSZXR5cGVkLmtub2Nrb3V0Lktub2Nrb3V0U3Vic2NyaWJhYmxlPGRvdWJsZT4uc3Vic2NyaWJlRm4pKHZhbHVlID0+IHRoaXMuU2NyZWVuUG9zaXRpb24uU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix2YWx1ZSkpKSk7XG4gICAgICAgICAgICB0aGlzLlBsYXllcnMuc3Vic2NyaWJlKChnbG9iYWw6OlJldHlwZWQua25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXI+LnN1YnNjcmliZUZuMikodmFsdWUgPT4gdGhpcy5Ib3dNYW55LlNlbGYodGhpcy5QbGF5ZXJzLlNlbGYoKS5MZW5ndGgpKSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBNb3ZlSXRWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTW92ZUl0SHViIF9tb3ZlSXRIdWI7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLk1vdmVJdElkO1xyXG59XG4gICAgICAgIHByaXZhdGUgaW50IF90b3AgPSAwO1xuICAgICAgICBwcml2YXRlIGludCBfbGVmdCA9IDA7XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gVG9wIHsgZ2V0OyBzZXQ7IH1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+IExlZnQgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBNb3ZlSXRWaWV3TW9kZWwoSU1vdmVJdEh1YiBtb3ZlSXRIdWIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1YiA9IG1vdmVJdEh1YjtcbiAgICAgICAgICAgIHRoaXMuVG9wID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPHN0cmluZz4oc3RyaW5nLkZvcm1hdChcInswfXB4XCIsdGhpcy5fdG9wKSk7XG4gICAgICAgICAgICB0aGlzLkxlZnQgPSBrbm9ja291dC5rby5vYnNlcnZhYmxlLlNlbGY8c3RyaW5nPihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIix0aGlzLl9sZWZ0KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5PbkxlZnRDaGFuZ2VkICs9IHRoaXMuTW92ZUl0SHViT25PbkxlZnRDaGFuZ2VkO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUl0SHViLk9uVG9wQ2hhbmdlZCArPSB0aGlzLk1vdmVJdEh1Yk9uT25Ub3BDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE1vdmVJdEh1Yk9uT25Ub3BDaGFuZ2VkKG9iamVjdCBzZW5kZXIsIGludCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90b3AgPSBlO1xuICAgICAgICAgICAgdGhpcy5Ub3AuU2VsZihzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZUl0SHViT25PbkxlZnRDaGFuZ2VkKG9iamVjdCBzZW5kZXIsIGludCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gZTtcbiAgICAgICAgICAgIHRoaXMuTGVmdC5TZWxmKHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU3RhcnQoKTtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgT25MZWF2ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVJdEh1Yi5TdG9wKCk7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZFRlbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcCs9MTA7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZFRvcCh0aGlzLl90b3ApO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlRvcDogezB9XCIsdGhpcy5fdG9wKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRUZW5MZWZ0KClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fbGVmdCs9MTA7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlSXRIdWIuU2VuZExlZnQodGhpcy5fbGVmdCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiTGVmdDogezB9XCIsdGhpcy5fbGVmdCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50LkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xudXNpbmcgQnJpZGdlO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBTdGFydEdhbWVWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgRmluaXNoTGluZU9mZnNldCA9IDE3MDtcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgU3BhY2VTaGlwV2lkdGggPSAxNzg7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElHYW1lSHViIF9nYW1lSHViO1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElUZWFtUmVwb3NpdG9yeSBfdGVhbVJlcG9zaXRvcnk7XG4gICAgICAgIHByaXZhdGUgZG91YmxlIF90YXBDb3VudDtcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgRWxlbWVudElkKClcclxue1xyXG4gICAgcmV0dXJuIFNwYWZBcHAuU3RhcnRHYW1lSWQ7XHJcbn1cbiAgICAgICAgcHVibGljIGtub2Nrb3V0Lktub2Nrb3V0T2JzZXJ2YWJsZTxHYW1lU3RhdGU+IFN0YXRlIHsgZ2V0OyBzZXQ7IH1cblxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8VGVhbVZpZXdNb2RlbD4gVGVhbVZpZXdNb2RlbHMgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBTdGFydEdhbWVWaWV3TW9kZWwoSUdhbWVIdWIgZ2FtZUh1YiwgSVRlYW1SZXBvc2l0b3J5IHRlYW1SZXBvc2l0b3J5KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcbiAgICAgICAgICAgIHRoaXMuX3RlYW1SZXBvc2l0b3J5ID0gdGVhbVJlcG9zaXRvcnk7XG5cbiAgICAgICAgICAgIHZhciB0ZWFtcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuVGVhbSxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KHRoaXMuX3RlYW1SZXBvc2l0b3J5LkdldFRlYW1zKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtLCBnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWw+KShzID0+IG5ldyBUZWFtVmlld01vZGVsKHMpKSkuVG9BcnJheSgpO1xuICAgICAgICAgICAgdGhpcy5UZWFtVmlld01vZGVscyA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGVBcnJheS5TZWxmPFRlYW1WaWV3TW9kZWw+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuVGVhbVZpZXdNb2RlbHMucHVzaCh0ZWFtcyk7XG4gICAgICAgICAgICB0aGlzLlN0YXRlID0ga25vY2tvdXQua28ub2JzZXJ2YWJsZS5TZWxmPEdhbWVTdGF0ZT4oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uUGxheWVyTGVhdmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBsYXllciA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPih0aGlzLkFMbFBsYXllcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpID09IHR1cGxlLkl0ZW0xLklkLlRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5fdGVhbVJlcG9zaXRvcnkuR2V0VGVhbUJ5SWQodHVwbGUuSXRlbTIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhzdHJpbmcuRm9ybWF0KFwiSWwgZ2lvY2F0b3JlIHswfSBkZWxsYSBzcXVhZHJhIHsxfSBjaSBoYSBsYXNjaWF0byBwcmVtYXR1cmFtZW50ZS5cIix0dXBsZS5JdGVtMS5OYW1lLHRlYW0hPW51bGw/dGVhbS5OYW1lOihzdHJpbmcpbnVsbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkKG9iamVjdCBzZW5kZXIsIFR1cGxlPFBsYXllciwgR3VpZD4gdHVwbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ZWFtID0gdGhpcy5HZXRUZWFtQnlJZCh0dXBsZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlBsYXllcnMucHVzaCh0dXBsZS5JdGVtMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5TdWNjZXNzKHN0cmluZy5Gb3JtYXQoXCJOdW92byBnaW9jYXRvcmUgezB9IGRlbGxhIHNxdWFkcmEgezF9XCIsdHVwbGUuSXRlbTEuTmFtZSx0ZWFtIT1udWxsP3RlYW0uTmFtZTooc3RyaW5nKW51bGwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkKG9iamVjdCBzZW5kZXIsIEdhbWVTdGF0ZSBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLlN0YXRlLlNlbGYoZSk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5DbG9zZWQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUmVzZXRUZWFtcygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5SZWdpc3RlcjpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IEdsb2JhbC5Eb2N1bWVudC5HZXRFbGVtZW50QnlJZChcImdhbWVEaXZcIikuT2Zmc2V0V2lkdGgtRmluaXNoTGluZU9mZnNldC1TcGFjZVNoaXBXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFwQ291bnQgPSAoZG91YmxlKXdpZHRoIC8gKGRvdWJsZSlTaGFyZWRDb25maWd1cmF0aW9uLkZpbmlzaExpbmU7XG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJXaWR0aDogezB9XCIsd2lkdGgpKTtcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIkZpbmlzaExpbmU6IHswfVwiLFNoYXJlZENvbmZpZ3VyYXRpb24uRmluaXNoTGluZSkpO1xuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVGFwQ291bnQ6IHswfVwiLHRoaXMuX3RhcENvdW50KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkZpbmlzaGVkOlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwiZVwiLCBlLCBudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFJlc2V0VGVhbXMoKVxuICAgICAgICB7XG5TeXN0ZW0uQXJyYXlFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsPiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmLlBsYXllcnMucmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICAgICAgZi5TY29yZS5TZWxmKDApO1xuICAgICAgICAgICAgICAgIGYuSXNXaW5uZXIuU2VsZihmYWxzZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBHYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQob2JqZWN0IHNlbmRlciwgVHVwbGU8aW50LCBHdWlkPiBlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbSA9IHRoaXMuR2V0VGVhbUJ5SWQoZS5JdGVtMik7XG4gICAgICAgICAgICB0ZWFtLlNjb3JlLlNlbGYoKGludCkoZS5JdGVtMSp0aGlzLl90YXBDb3VudCkpO1xuU3lzdGVtLkFycmF5RXh0ZW5zaW9ucy5Gb3JFYWNoPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4oXG4gICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4pKGYgPT4gZi5Jc1dpbm5lci5TZWxmKGZhbHNlKSkpO1xuU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5PcmRlckJ5RGVzY2VuZGluZzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsZG91YmxlPiggICAgICAgICAgICB0aGlzLlRlYW1WaWV3TW9kZWxzLlNlbGYoKSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuQ2xpZW50LlZpZXdNb2RlbHMuTW9kZWxzLlRlYW1WaWV3TW9kZWwsIGRvdWJsZT4pKG8gPT4gby5TY29yZS5TZWxmKCkpKS5GaXJzdCgpLklzV2lubmVyLlNlbGYodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgdm9pZCBSZVN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuUmVTdGFydEdhbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcblxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25OZXdQbGF5ZXJKb2luZWQgKz0gdGhpcy5HYW1lSHViT25Pbk5ld1BsYXllckpvaW5lZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25QbGF5ZXJMZWF2ZWQgKz0gdGhpcy5HYW1lSHViT25PblBsYXllckxlYXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25UYXBDb3VudFJlY2VpdmVkICs9IHRoaXMuR2FtZUh1Yk9uT25UYXBDb3VudFJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRvb01hbnlQbGF5ZXJzICs9IHRoaXMuT25Ub29NYW55UGxheWVycztcblxuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdGFydCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB0aGlzLl9nYW1lSHViLk5vdGlmeUlBbVRoZUFkbWluKCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBPblRvb01hbnlQbGF5ZXJzKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBOb3RpZmljYXRpb24uV2FybmluZyhcIlRyb3BwaSB1dGVudGkuLiBnaW9jYXRvcmUgZXNjbHVzby4gOihcIik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgLT0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5Pbk5ld1BsYXllckpvaW5lZCAtPSB0aGlzLkdhbWVIdWJPbk9uTmV3UGxheWVySm9pbmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblBsYXllckxlYXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uUGxheWVyTGVhdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PblRhcENvdW50UmVjZWl2ZWQgLT0gdGhpcy5HYW1lSHViT25PblRhcENvdW50UmVjZWl2ZWQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uVG9vTWFueVBsYXllcnMgLT0gdGhpcy5PblRvb01hbnlQbGF5ZXJzO1xuXG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE9wZW5SZWdpc3RyYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9wZW5SZWdpc3RyYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3BHYW1lKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5TdG9wR2FtZSgpO1xuICAgICAgICB9XG5wcml2YXRlIFRlYW1WaWV3TW9kZWwgR2V0VGVhbUJ5SWQoR3VpZCBpZClcclxue1xyXG4gICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbD4odGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsLCBib29sPikocyA9PiBzLklkLlRvU3RyaW5nKCkuRXF1YWxzKGlkLlRvU3RyaW5nKCkpKSk7XHJcbn1wcml2YXRlIElFbnVtZXJhYmxlPFBsYXllcj4gQUxsUGxheWVyc1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscy5Nb2RlbHMuVGVhbVZpZXdNb2RlbCxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlBsYXllcj4odGhpcy5UZWFtVmlld01vZGVscy5TZWxmKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpBenVyZURheS5Sb21lLkNsaWVudC5WaWV3TW9kZWxzLk1vZGVscy5UZWFtVmlld01vZGVsLCBnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLklFbnVtZXJhYmxlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyPj4pKHNtID0+IHNtLlBsYXllcnMuU2VsZigpKSk7XHJcbiAgICB9XHJcbn0gICAgfVxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5DbGllbnQuVmlld01vZGVscztcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIGNsYXNzIEN1c3RvbVJvdXRlc0NvbmZpZyA6IEJyaWRnZU5hdmlnYXRvckNvbmZpZ0Jhc2VcbiAgICB7XG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IENyZWF0ZVJvdXRlcygpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxJUGFnZURlc2NyaXB0b3I+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FuQmVEaXJlY3RMb2FkID0gKCk9PnRydWUsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL21vdmVJdC5odG1sXCIsIFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLk1vdmVJdElkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8TW92ZUl0Vmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy9zdGFydEdhbWUuaHRtbFwiLCBcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5TdGFydEdhbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPFN0YXJ0R2FtZVZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO3JldHVybiBfbzE7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgalF1ZXJ5IEJvZHkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBIb21lSWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cblxuXG4gICAgXG5wcml2YXRlIGpRdWVyeSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQm9keT1qUXVlcnkuU2VsZWN0KFwiI3BhZ2VCb2R5XCIpO3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ib21lSWQ9U3BhZkFwcC5Nb3ZlSXRJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5IdWJzLkltcGw7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXM7XG51c2luZyBBenVyZURheS5Sb21lLkNsaWVudC5SZXBvc2l0b3JpZXMuSW1wbDtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzO1xudXNpbmcgQnJpZGdlO1xudXNpbmcgQnJpZGdlLklvYztcbnVzaW5nIEJyaWRnZS5NZXNzZW5nZXI7XG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcbnVzaW5nIEJyaWRnZS5TcGFmLkF0dHJpYnV0ZXM7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIHB1YmxpYyBjbGFzcyBTcGFmQXBwXG4gICAge1xuICAgICAgICBwdWJsaWMgc3RhdGljIElJb2MgQ29udGFpbmVyO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcbiAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyID0gbmV3IEJyaWRnZUlvYygpO1xuICAgICAgICAgICAgQ29udGFpbmVyQ29uZmlnKCk7IC8vIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZXNvbHZlPElOYXZpZ2F0b3I+KCkuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXG5cbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcblxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1vdmVJdEh1YiwgTW92ZUl0SHViPigpO1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUdhbWVIdWIsIEdhbWVIdWI+KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElUZWFtc0RhdGFTb3VyY2UsIFRlYW1zRGF0YVNvdXJjZT4oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJVGVhbVJlcG9zaXRvcnksIFRlYW1SZXBvc2l0b3J5PigpO1xuICAgICAgICB9XG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgSG9tZUlkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcImhvbWVcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIE1vdmVJdElkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIm1vdmVJdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgU3RhcnRHYW1lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwic3RhcnRHYW1lXCI7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXG4gICAgICAgIHtcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xuXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFJlZ2lzdGVyIGFsbCB0eXBlcyB0aGF0IGVuZCB3aXRoIFwidmlld21vZGVsXCIuXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXG4gICAgICAgICAgICAgICAgLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlR5cGUsIGJvb2w+KSh3ID0+IHcuTmFtZS5Ub0xvd2VyKCkuRW5kc1dpdGgoXCJ2aWV3bW9kZWxcIikpKS5Ub0xpc3QoKTtcblxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8b2JqZWN0PihhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXIoZik7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5EYXRhU291cmNlcztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuU2hhcmVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuUmVwb3NpdG9yaWVzLkltcGxcbntcbiAgICBjbGFzcyBUZWFtUmVwb3NpdG9yeSA6IElUZWFtUmVwb3NpdG9yeVxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJVGVhbXNEYXRhU291cmNlIF90ZWFtc0RhdGFTb3VyY2U7XG5cbiAgICAgICAgcHVibGljIFRlYW1SZXBvc2l0b3J5KElUZWFtc0RhdGFTb3VyY2UgdGVhbXNEYXRhU291cmNlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90ZWFtc0RhdGFTb3VyY2UgPSB0ZWFtc0RhdGFTb3VyY2U7XG4gICAgICAgIH0gICAgXG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgVGVhbSBHZXRUZWFtQnlJZChHdWlkIGlkKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdGVhbXMgPSB0aGlzLkdldFRlYW1zKCk7XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5UZWFtPih0ZWFtcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkF6dXJlRGF5LlJvbWUuU2hhcmVkLlRlYW0sIGJvb2w+KShzZCA9PiBzZC5JZC5Ub1N0cmluZygpLkVxdWFscyhpZC5Ub1N0cmluZygpLFN0cmluZ0NvbXBhcmlzb24uSW52YXJpYW50Q3VsdHVyZUlnbm9yZUNhc2UpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8VGVhbT4gR2V0VGVhbXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVhbXNEYXRhU291cmNlLkdldFRlYW1zKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLlNoYXJlZDtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkRhdGFTb3VyY2VzXG57XG4gICAgY2xhc3MgVGVhbXNEYXRhU291cmNlIDogSVRlYW1zRGF0YVNvdXJjZVxuICAgIHtcbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPFRlYW0+IEdldFRlYW1zKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRlYW0xID0gbmV3IFRlYW1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJZCA9IEd1aWQuUGFyc2UoXCI3NERCODAwMy0yMzQ4LTQ5OEYtQjc3My0xQzRDRTBGRDY5QTJcIiksXG4gICAgICAgICAgICAgICAgTmFtZSA9IFwiRmFsY29uXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0xO1xuXG4gICAgICAgICAgICB2YXIgdGVhbTIgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjhFNkFGMkY3LTYxODQtNERBMC1CMkU0LTk3OEVEQjNGNDNEMVwiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJEcmFnb25cIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTI7XG5cbiAgICAgICAgICAgIHZhciB0ZWFtMyA9IG5ldyBUZWFtXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSWQgPSBHdWlkLlBhcnNlKFwiOEQ3MjRGMDEtQzlFRS00RjMxLUE4NjUtQUZCRDZBMkQyQkRBXCIpLFxuICAgICAgICAgICAgICAgIE5hbWUgPSBcIlJvYWRzdGVyXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeWllbGQgcmV0dXJuIHRlYW0zO1xuXG4gICAgICAgICAgICB2YXIgdGVhbTQgPSBuZXcgVGVhbVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElkID0gR3VpZC5QYXJzZShcIjBEMkMzN0Y3LTQ5RkUtNDhEOS1BMUQzLTFBOTBFNzk0OEJDQ1wiKSxcbiAgICAgICAgICAgICAgICBOYW1lID0gXCJTcGFjZVhcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gdGVhbTQ7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5TaGFyZWQ7XG51c2luZyBCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcblxubmFtZXNwYWNlIEF6dXJlRGF5LlJvbWUuQ2xpZW50Lkh1YnMuSW1wbFxue1xuICAgIGNsYXNzIEdhbWVIdWIgOiBJR2FtZUh1YlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBIdWJDb25uZWN0aW9uIF9jb25uZWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxHYW1lU3RhdGU+IE9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25OZXdQbGF5ZXJKb2luZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8UGxheWVyLCBHdWlkPj4gT25QbGF5ZXJMZWF2ZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8VHVwbGU8aW50LCBHdWlkPj4gT25UYXBDb3VudFJlY2VpdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uVG9vTWFueVBsYXllcnM7XG5cbiAgICAgICAgcHVibGljIEdhbWVIdWIoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gIG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvcGxheVwiKS5CdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbkNsb3NlKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuRXJyb3I+KShlcnJvciA9PiBHbG9iYWwuQWxlcnQoXCJEaXNjb25uZWN0ZWQhXCIpKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJnYW1lU3RhdGVNb2RlXCIsbmV3IEFjdGlvbjxHYW1lU3RhdGU+KChnYW1lU3RhdGUpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uR2FtZVN0YXRlUmVjZWl2ZWQuSW52b2tlKHRoaXMsZ2FtZVN0YXRlKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckpvaW5lZFwiLG5ldyBBY3Rpb248UGxheWVyLEd1aWQ+KChuYW1lLHRlYW0pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5Pbk5ld1BsYXllckpvaW5lZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5Pbk5ld1BsYXllckpvaW5lZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8Z2xvYmFsOjpBenVyZURheS5Sb21lLlNoYXJlZC5QbGF5ZXIsZ2xvYmFsOjpTeXN0ZW0uR3VpZD4obmFtZSx0ZWFtKSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJwbGF5ZXJMZWF2ZWRcIixuZXcgQWN0aW9uPFBsYXllcixHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25QbGF5ZXJMZWF2ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25QbGF5ZXJMZWF2ZWQuSW52b2tlKHRoaXMsVHVwbGUuQ3JlYXRlPGdsb2JhbDo6QXp1cmVEYXkuUm9tZS5TaGFyZWQuUGxheWVyLGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidGFwQ291bnRcIixuZXcgQWN0aW9uPGludCxHdWlkPigobmFtZSx0ZWFtKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25UYXBDb3VudFJlY2VpdmVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVGFwQ291bnRSZWNlaXZlZC5JbnZva2UodGhpcyxUdXBsZS5DcmVhdGU8aW50LGdsb2JhbDo6U3lzdGVtLkd1aWQ+KG5hbWUsdGVhbSkpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwidG9vTWFueVBsYXllcnNcIixuZXcgQWN0aW9uKCgpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PblRvb01hbnlQbGF5ZXJzIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uVG9vTWFueVBsYXllcnMuSW52b2tlKHRoaXMsbnVsbCkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCkuVGhlbigoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBvbkNvbm5lY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+b25Db25uZWN0ZWQuSW52b2tlKCkpOm51bGwpLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4ge30pKVxuICAgICAgICAgICAgICAgIC5DYXRjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0R2FtZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwic3RhcnRHYW1lXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgT3BlblJlZ2lzdHJhdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uSW52b2tlKFwib3BlblJlZ2lzdHJhdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE5vdGlmeUlBbVRoZUFkbWluKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJzZXRVcEFkbWluXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgUmVTdGFydEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyB0b2RvXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcInJlc3RhcnQhXCIpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5JbnZva2UoXCJyZVN0YXJ0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEdhbWUoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLkludm9rZShcIlN0b3BHYW1lXCIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIEJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50O1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5DbGllbnQuSHVicy5JbXBsXG57XG4gICAgY2xhc3MgTW92ZUl0SHViIDogSU1vdmVJdEh1YlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBIdWJDb25uZWN0aW9uIF9jb25uZWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxpbnQ+IE9uTGVmdENoYW5nZWQ7XG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8aW50PiBPblRvcENoYW5nZWQ7XG5cbiAgICAgICAgcHVibGljIE1vdmVJdEh1YigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSAgbmV3IEh1YkNvbm5lY3Rpb25CdWlsZGVyKCkuV2l0aFVybChcIi9tb3ZlSXRcIikuQnVpbGQoKTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ1cGRhdGVUb3BcIixuZXcgQWN0aW9uPGludD4oKHRvcCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uVG9wQ2hhbmdlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PblRvcENoYW5nZWQuSW52b2tlKHRoaXMsdG9wKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ1cGRhdGVMZWZ0XCIsbmV3IEFjdGlvbjxpbnQ+KChsZWZ0KSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25MZWZ0Q2hhbmdlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkxlZnRDaGFuZ2VkLkludm9rZSh0aGlzLGxlZnQpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25Db25uZWN0ZWQgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kVG9wKGludCB0b3ApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInNlbmRUb3BcIiwgdG9wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRMZWZ0KGludCBsZWZ0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJzZW5kTGVmdFwiLCBsZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFxufSJdCn0K
