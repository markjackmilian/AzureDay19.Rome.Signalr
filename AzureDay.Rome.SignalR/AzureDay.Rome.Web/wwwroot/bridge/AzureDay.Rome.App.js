/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("AzureDay.Rome.App", function ($asm, globals) {
    "use strict";

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
                this.HomeId = Bridge.Spaf.SpafApp.HomeId;
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
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Spaf.ViewModels.ChatViewModel);
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
                }
            },
            methods: {
                ContainerConfig: function () {
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.INavigator, Bridge.Navigation.BridgeNavigatorWithRouting);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.IBrowserHistoryManager, Bridge.Navigation.QueryParameterNavigationHistory);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register$4(Bridge.Navigation.INavigatorConfigurator, Bridge.Spaf.CustomRoutesConfig);

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Messenger.IMessenger, Bridge.Messenger.Messenger);

                    Bridge.Spaf.SpafApp.RegisterAllViewModels();


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
            props: {
                LoginDone: {
                    get: function () {
                        return "LoginDone";
                    }
                }
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

    Bridge.define("Bridge.Spaf.ViewModels.ChatViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            Message: null
        },
        alias: ["OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"],
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.HomeId;
            },
            OnLoad: function (parameters) {
                System.Console.WriteLine("Ciao!");

                this.Message = ko.observable();

                // var hubConnection = new                 signalR.HubConnectionBuilder()
                //     .withUrl("/chat")
                //     .configureLogging(signalR.LogLevel.Information)
                //     .build();
                //
                // hubConnection.on("Send", function (data) {
                //     System.Console.WriteLine(data);
                // });
                //
                // hubConnection.onclose(function (error) {
                //     System.Console.WriteLine(error.Message);
                // });
                //
                //
                //
                // hubConnection.start().then(function () {
                //     System.Console.WriteLine("started");
                //
                //     //hubConnection.invoke("send", "Hello");
                // }, null);
                //
                // hubConnection.stop();


                Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
            },
            Send: function () {
                Bridge.global.alert(this.Message());
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLkFwcC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIlZpZXdNb2RlbHMvQ2hhdFZpZXdNb2RlbC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBMEI2Q0E7OEJBQTBFQTs7Ozs7O2dCQWYzR0EsT0FBT0EsQUFBMERBLFVBQUNBOzt3QkFBT0EsUUFBUUEsVUFBSUEseURBRTNEQTs7NkNBQ0hBOztvQ0FDVEEsZ0RBQ1dBO21DQUFNQTs7d0JBQ3hCQSxPQUFPQTtzQkFOdUJBLEtBQUlBOzs7Ozs7O1lDTXpDQSxnQ0FBWUEsSUFBSUE7WUFDaEJBO1lBQ0FBOzs7Ozs7Ozs7O3dCQTJCSkE7Ozs7OztvQkFwQklBO29CQUNBQTtvQkFFQUE7O29CQUdBQTs7b0JBR0FBOzs7Ozs7Ozs7Ozs7Ozs7b0JBMENBQSxZQUFZQSw0QkFBMEZBLDZDQUF3Q0EsQUFBK0hBO21DQUFLQTtpQ0FDdlFBLEFBQWlEQTsrQkFBS0E7OztvQkFFakVBLGNBQWNBLEFBQTZDQTt3QkFFdkRBLGlCQUFpQkEsbUNBQXNCQSxBQUFPQTs7d0JBRTlDQSxJQUFJQSw0QkFBbUNBOzRCQUNuQ0EscUVBQWlDQTs7NEJBRWpDQSx1REFBbUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBeEIvQkE7Ozs7OztrQ0FMd0NBLElBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDOUNoREEsT0FBT0E7OzhCQUt5QkE7Z0JBRXhCQTs7Z0JBRUFBLGVBQWVBOztnQkFFZkEsb0JBQW9CQSxJQUFJQTs7Z0JBR3hCQSx5QkFBeUJBLEFBQW1CQSxVQUFDQTtvQkFHekNBLHlCQUFrQkE7OztnQkFJdEJBLHNCQUFzQkEsQUFBOENBLFVBQUNBO29CQUdqRUEseUJBQWtCQTs7O2dCQUl0QkEsMkJBQ2lCQSxBQUF3QkE7b0JBR2pDQTttQkFFUUEsQUFBOEZBOztnQkFHOUdBOzs7Z0JBR0FBLDBEQUFZQTs7O2dCQUtaQSxvQkFBYUEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xyXG51c2luZyBCcmlkZ2UuTmF2aWdhdGlvbjtcclxudXNpbmcgQnJpZGdlLlNwYWYuVmlld01vZGVscztcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxyXG57XHJcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxJUGFnZURlc2NyaXB0b3I+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBQYWdlRGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2NoYXQuaHRtbFwiLCAvLyB5b3V0IGh0bWwgbG9jYXRpb25cclxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkhvbWVJZCxcclxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8Q2hhdFZpZXdNb2RlbD4oKVxyXG4gICAgICAgICAgICAgICAgfSk7cmV0dXJuIF9vMTt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBqUXVlcnkgQm9keSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBIb21lSWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cclxuICAgIFxucHJpdmF0ZSBqUXVlcnkgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JvZHk9alF1ZXJ5LlNlbGVjdChcIiNwYWdlQm9keVwiKTtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fSG9tZUlkPVNwYWZBcHAuSG9tZUlkO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGlzYWJsZUF1dG9TcGFmQW5jaG9yc09uTmF2aWdhdGU9dHJ1ZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLklvYztcclxudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcclxudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XHJcbnVzaW5nIEJyaWRnZS5TcGFmLkF0dHJpYnV0ZXM7XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwYWZBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIElJb2MgQ29udGFpbmVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb250YWluZXIgPSBuZXcgQnJpZGdlSW9jKCk7XHJcbiAgICAgICAgICAgIENvbnRhaW5lckNvbmZpZygpOyAvLyBjb25maWcgY29udGFpbmVyXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZXNvbHZlPElOYXZpZ2F0b3I+KCkuSW5pdE5hdmlnYXRpb24oKTsgLy8gaW5pdCBuYXZpZ2F0aW9uXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBDb250YWluZXJDb25maWcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXHJcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElOYXZpZ2F0b3IsIEJyaWRnZU5hdmlnYXRvcldpdGhSb3V0aW5nPigpO1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyLCBRdWVyeVBhcmFtZXRlck5hdmlnYXRpb25IaXN0b3J5PigpO1xyXG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXI8SU5hdmlnYXRvckNvbmZpZ3VyYXRvciwgQ3VzdG9tUm91dGVzQ29uZmlnPigpOyBcclxuXHJcbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxyXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTWVzc2VuZ2VyLCBNZXNzZW5nZXIuTWVzc2VuZ2VyPigpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xyXG4gICAgICAgICAgICBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxyXG5cclxuICAgICAgICB9XHJcbiNyZWdpb24gUEFHRVMgSURTXHJcbi8vIHN0YXRpYyBwYWdlcyBpZFxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBIb21lSWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiaG9tZVwiO1xyXG4gICAgfVxyXG59ICAgICAgIFxyXG4gICAgICAgICNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgI3JlZ2lvbiBNRVNTQUdFU1xyXG4gICAgICAgIC8vIG1lc3NlbmdlciBoZWxwZXIgZm9yIGdsb2JhbCBtZXNzYWdlcyBhbmQgbWVzc2FnZXMgaWRzXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTWVzc2FnZXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xyXG5cclxuICAgICAgICAgICAgcHVibGljIHN0YXRpYyBHbG9iYWxTZW5kZXIgU2VuZGVyID0gbmV3IEdsb2JhbFNlbmRlcigpO1xyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBMb2dpbkRvbmVcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiTG9naW5Eb25lXCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUmVnaXN0ZXIgYWxsIHR5cGVzIHRoYXQgZW5kIHdpdGggXCJ2aWV3bW9kZWxcIi5cclxuICAgICAgICAvLy8gWW91IGNhbiByZWdpc3RlciBhIHZpZXdtb2RlIGFzIFNpbmdsciBJbnN0YW5jZSBhZGRpbmcgXCJTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZVwiIHRvIHRoZSBjbGFzc1xyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSZWdpc3RlckFsbFZpZXdNb2RlbHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXHJcbiAgICAgICAgICAgICAgICAuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpTeXN0ZW0uVHlwZSwgYm9vbD4pKHcgPT4gdy5OYW1lLlRvTG93ZXIoKS5FbmRzV2l0aChcInZpZXdtb2RlbFwiKSkpLlRvTGlzdCgpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZi5HZXRDdXN0b21BdHRyaWJ1dGVzKHR5cGVvZihTaW5nbGVJbnN0YW5jZUF0dHJpYnV0ZSksIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxvYmplY3Q+KGF0dHJpYnV0ZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlKGYpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlcihmKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgUmV0eXBlZDtcclxuXHJcbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZi5WaWV3TW9kZWxzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDaGF0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcclxuICAgIHtcclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5Ib21lSWQ7XHJcbn0gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBrbm9ja291dC5Lbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiBNZXNzYWdlIHsgZ2V0OyBzZXQ7IH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJDaWFvIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuTWVzc2FnZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgaHViQ29ubmVjdGlvbiA9IG5ldyBIdWJDb25uZWN0aW9uKFwiL3Rlc3RcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXR1cCBvbiBkYXRhIHJlY2VpdmVkIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICAgICAgaHViQ29ubmVjdGlvbi5PbihcIlNlbmRcIiwgbmV3IEFjdGlvbjxzdHJpbmc+KChkYXRhKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb2cgdGhlIHJlY2VpdmVkIGRhdGEgdG8gdGhlIGNvbnNvbGVcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKGRhdGEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXR1cCBvbiBjb25uZWN0aW9uIGNsb3NlIGhhbmRsZXJcclxuICAgICAgICAgICAgaHViQ29ubmVjdGlvbi5PbkNsb3NlKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuRXJyb3I+KSgoZXJyb3IpID0+IFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb2cgdGhlIGVycm9yXHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShlcnJvci5NZXNzYWdlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RhcnQgdGhlIGNvbm5lY3Rpb25cclxuICAgICAgICAgICAgaHViQ29ubmVjdGlvbi5TdGFydCgpLlRoZW4oXHJcbiAgICAgICAgICAgICAgICBvbmZ1bGZpbGxlZDogKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIGEgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgIGh1YkNvbm5lY3Rpb24uSW52b2tlKFwic2VuZFwiLCBcIkhlbGxvXCIpO1xyXG4gICAgICAgICAgICAgICAgfSksIFxyXG4gICAgICAgICAgICAgICAgb25yZWplY3RlZDogKGdsb2JhbDo6U3lzdGVtLkZ1bmM8b2JqZWN0LCBnbG9iYWw6OkJyaWRnZS5Bc3BOZXRDb3JlLlNpZ25hbFIuQ2xpZW50LlRocmVhZGluZy5JUHJvbWlzZUxpa2U+KW51bGwpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RvcCB0aGUgY29ubmVjdGlvblxyXG4gICAgICAgICAgICBodWJDb25uZWN0aW9uLlN0b3AoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBiYXNlLk9uTG9hZChwYXJhbWV0ZXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KHRoaXMuTWVzc2FnZS5TZWxmKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdCn0K
