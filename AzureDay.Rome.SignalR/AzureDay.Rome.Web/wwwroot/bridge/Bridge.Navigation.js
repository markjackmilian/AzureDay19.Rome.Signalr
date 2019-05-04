/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("Bridge.Navigation", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.Navigation.INavigator", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Navigation.INavigatorConfigurator", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Navigation.IBrowserHistoryManager", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Navigation.IAmLoadable", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Navigation.IPageDescriptor", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Navigation.Model.UrlDescriptor", {
        props: {
            PageId: null,
            Parameters: null
        }
    });

    Bridge.define("Bridge.Navigation.NavigationUtility", {
        statics: {
            fields: {
                /**
                 * Define virtual directory for something like:
                 protocol://awesomesite.io/somedirectory
                 *
                 * @static
                 * @public
                 * @memberof Bridge.Navigation.NavigationUtility
                 * @type string
                 */
                VirtualDirectory: null
            },
            methods: {
                /**
                 * Get parameter key from parameters dictionary
                 *
                 * @static
                 * @public
                 * @this Bridge.Navigation.NavigationUtility
                 * @memberof Bridge.Navigation.NavigationUtility
                 * @param   {Function}                                   T             
                 * @param   {System.Collections.Generic.Dictionary$2}    parameters    
                 * @param   {string}                                     paramKey
                 * @return  {T}
                 */
                GetParameter: function (T, parameters, paramKey) {
                    if (parameters == null) {
                        throw new System.Exception("Parameters is null!");
                    }

                    if (!parameters.containsKey(paramKey)) {
                        throw new System.Exception(System.String.format("No parameter with key {0} found!", [paramKey]));
                    }

                    var value = parameters.get(paramKey);

                    var parseMethod = Bridge.Reflection.getMembers(T, 8, 284, "Parse", System.Array.init([System.String], Function));

                    if (parseMethod != null) {
                        return Bridge.cast(Bridge.unbox(Bridge.Reflection.midel(parseMethod, null).apply(null, Bridge.unbox(System.Array.init([value], System.Object))), T), T);
                    }

                    return Bridge.cast(Bridge.unbox(value, T), T);
                },
                /**
                 * Build base url using page id and virtual directory
                 *
                 * @static
                 * @public
                 * @this Bridge.Navigation.NavigationUtility
                 * @memberof Bridge.Navigation.NavigationUtility
                 * @param   {string}    pageId
                 * @return  {string}
                 */
                BuildBaseUrl: function (pageId) {
                    var baseUrl = System.String.format("{0}//{1}", window.location.protocol, window.location.host);
                    baseUrl = System.String.isNullOrEmpty(Bridge.Navigation.NavigationUtility.VirtualDirectory) ? System.String.format("{0}#{1}", baseUrl, pageId) : System.String.format("{0}/{1}#{2}", baseUrl, Bridge.Navigation.NavigationUtility.VirtualDirectory, pageId);
                    return baseUrl;
                }
            }
        }
    });

    Bridge.define("Bridge.Navigation.Utility", {
        statics: {
            methods: {
                /**
                 * Load script sequentially
                 *
                 * @static
                 * @public
                 * @this Bridge.Navigation.Utility
                 * @memberof Bridge.Navigation.Utility
                 * @param   {System.Collections.Generic.List$1}    scripts
                 * @return  {void}
                 */
                SequentialScriptLoad: function (scripts) {
                    if (!System.Linq.Enumerable.from(scripts).any()) {
                        return;
                    }
                    var toLoad = System.Linq.Enumerable.from(scripts).first();
                    $.getScript(toLoad, function (o, s, arg3) {
                        scripts.remove(toLoad);
                        Bridge.Navigation.Utility.SequentialScriptLoad(scripts);
                    });
                }
            }
        }
    });

    /** @namespace Bridge.Navigation */

    /**
     * INavigator implementation
     *
     * @public
     * @class Bridge.Navigation.BridgeNavigator
     * @implements  Bridge.Navigation.INavigator
     */
    Bridge.define("Bridge.Navigation.BridgeNavigator", {
        inherits: [Bridge.Navigation.INavigator],
        statics: {
            fields: {
                _actualController: null
            }
        },
        fields: {
            Configuration: null
        },
        events: {
            OnNavigated: null
        },
        props: {
            LastNavigateController: {
                get: function () {
                    return Bridge.Navigation.BridgeNavigator._actualController;
                }
            }
        },
        alias: [
            "EnableSpafAnchors", "Bridge$Navigation$INavigator$EnableSpafAnchors",
            "Navigate", "Bridge$Navigation$INavigator$Navigate",
            "addOnNavigated", "Bridge$Navigation$INavigator$addOnNavigated",
            "removeOnNavigated", "Bridge$Navigation$INavigator$removeOnNavigated",
            "LastNavigateController", "Bridge$Navigation$INavigator$LastNavigateController",
            "InitNavigation", "Bridge$Navigation$INavigator$InitNavigation"
        ],
        ctors: {
            ctor: function (configuration) {
                this.$initialize();
                this.Configuration = configuration;
            }
        },
        methods: {
            EnableSpafAnchors: function () {
                var allAnchors = $("a");
                allAnchors.off(System.Enum.toString(System.String, "click"));
                allAnchors.click(Bridge.fn.bind(this, $asm.$.Bridge.Navigation.BridgeNavigator.f1));
            },
            /**
             * Navigate to a page ID.
             The ID must be registered.
             *
             * @instance
             * @public
             * @this Bridge.Navigation.BridgeNavigator
             * @memberof Bridge.Navigation.BridgeNavigator
             * @param   {string}                                     pageId        
             * @param   {System.Collections.Generic.Dictionary$2}    parameters
             * @return  {void}
             */
            Navigate: function (pageId, parameters) {
                var $t;
                if (parameters === void 0) { parameters = null; }
                var page = this.Configuration.Bridge$Navigation$INavigatorConfigurator$GetPageDescriptorByKey(pageId);
                if (page == null) {
                    throw new System.Exception(System.String.format("Page not found with ID {0}", [pageId]));
                }

                // check redirect rule
                var redirectKey = !Bridge.staticEquals(($t = page.Bridge$Navigation$IPageDescriptor$RedirectRules), null) ? $t() : null;
                if (!System.String.isNullOrEmpty(redirectKey)) {
                    this.Navigate(redirectKey, parameters);
                    return;
                }

                var body = this.Configuration.Bridge$Navigation$INavigatorConfigurator$Body;
                if (body == null) {
                    throw new System.Exception("Cannot find navigation body element.");
                }

                // leave actual controlelr
                if (this.LastNavigateController != null) {
                    this.LastNavigateController.Bridge$Navigation$IAmLoadable$OnLeave();
                }

                this.Configuration.Bridge$Navigation$INavigatorConfigurator$Body.load(page.Bridge$Navigation$IPageDescriptor$HtmlLocation(), null, Bridge.fn.bind(this, function (o, s, a) {
                    var $step = 0,
                        $task1, 
                        $taskResult1, 
                        o, 
                        s, 
                        a, 
                        $jumpFromFinally, 
                        scripts, 
                        scriptsTask, 
                        $t1, 
                        enableAnchors, 
                        $t2, 
                        controller, 
                        $asyncBody = Bridge.fn.bind(this, function () {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3], $step);
                                switch ($step) {
                                    case 0: {
                                        // load dependencies
                                        if (!Bridge.staticEquals(page.Bridge$Navigation$IPageDescriptor$DependenciesScripts, null)) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                    }
                                    case 1: {
                                        scripts = System.Linq.Enumerable.from((page.Bridge$Navigation$IPageDescriptor$DependenciesScripts())).toList(System.String);
                                        if (page.Bridge$Navigation$IPageDescriptor$SequentialDependenciesScriptLoad) {
                                            Bridge.Navigation.Utility.SequentialScriptLoad(scripts);
                                        }
                                        // parallel load
                                        scriptsTask = System.Linq.Enumerable.from(scripts).select($asm.$.Bridge.Navigation.BridgeNavigator.f2);
                                        $task1 = System.Threading.Tasks.Task.whenAll(scriptsTask);
                                        $step = 2;
                                        $task1.continueWith($asyncBody, true);
                                        return;
                                    }
                                    case 2: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        $step = 3;
                                        continue;
                                    }
                                    case 3: {
                                        // prepare page
                                        !Bridge.staticEquals(($t1 = page.Bridge$Navigation$IPageDescriptor$PreparePage), null) ? $t1() : null;

                                        // auto enable spaf anchors
                                        if (!this.Configuration.Bridge$Navigation$INavigatorConfigurator$DisableAutoSpafAnchorsOnNavigate) {
                                            enableAnchors = !Bridge.staticEquals(($t2 = page.Bridge$Navigation$IPageDescriptor$AutoEnableSpafAnchors), null) ? $t2() : null;
                                            if (System.Nullable.hasValue(enableAnchors) && System.Nullable.getValue(enableAnchors)) {
                                                this.EnableSpafAnchors();
                                            }
                                        }

                                        if (!Bridge.staticEquals(page.Bridge$Navigation$IPageDescriptor$PageController, null)) {
                                            // load new controller
                                            controller = page.Bridge$Navigation$IPageDescriptor$PageController();
                                            controller.Bridge$Navigation$IAmLoadable$OnLoad(parameters);

                                            Bridge.Navigation.BridgeNavigator._actualController = controller;

                                            !Bridge.staticEquals(this.OnNavigated, null) ? this.OnNavigated(this, controller) : null;
                                        }
                                        return;
                                    }
                                    default: {
                                        return;
                                    }
                                }
                            }
                        }, arguments);

                    $asyncBody();
                }));
            },
            /**
             * Subscribe to anchors click
             *
             * @instance
             * @public
             * @this Bridge.Navigation.BridgeNavigator
             * @memberof Bridge.Navigation.BridgeNavigator
             * @return  {void}
             */
            InitNavigation: function () {
                this.EnableSpafAnchors();

                // go home
                this.Navigate(this.Configuration.Bridge$Navigation$INavigatorConfigurator$HomeId);
            }
        }
    });

    Bridge.ns("Bridge.Navigation.BridgeNavigator", $asm.$);

    Bridge.apply($asm.$.Bridge.Navigation.BridgeNavigator, {
        f1: function (ev) {
            var clickedElement = ev.target;

            if (!Bridge.referenceEquals(Bridge.getType(clickedElement), HTMLAnchorElement)) {
                clickedElement = $(ev.target).parents("a").get(0);
            }

            var href = clickedElement.getAttribute("href");

            if (System.String.isNullOrEmpty(href)) {
                return;
            }

            var isMyHref = System.String.startsWith(href, "spaf:");

            // if is my href
            if (isMyHref) {
                ev.preventDefault();
                var pageId = System.String.replaceAll(href, "spaf:", "");
                this.Navigate(pageId);
            }

            // anchor default behaviour
        },
        f2: function (url) {
        return System.Threading.Tasks.Task.fromPromise($.getScript(url));
    }
    });

    /**
     * INavigatorConfigurator Implementation. Must be extended.
     *
     * @abstract
     * @public
     * @class Bridge.Navigation.BridgeNavigatorConfigBase
     * @implements  Bridge.Navigation.INavigatorConfigurator
     */
    Bridge.define("Bridge.Navigation.BridgeNavigatorConfigBase", {
        inherits: [Bridge.Navigation.INavigatorConfigurator],
        fields: {
            _routes: null
        },
        alias: ["GetPageDescriptorByKey", "Bridge$Navigation$INavigatorConfigurator$GetPageDescriptorByKey"],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._routes = this.CreateRoutes();
            }
        },
        methods: {
            GetPageDescriptorByKey: function (key) {
                return System.Linq.Enumerable.from(this._routes).singleOrDefault(function (s) {
                        return System.String.equals(s.Bridge$Navigation$IPageDescriptor$Key, key, 1);
                    }, null);
            }
        }
    });

    Bridge.define("Bridge.Navigation.ComplexObjectNavigationHistory", {
        inherits: [Bridge.Navigation.IBrowserHistoryManager],
        alias: [
            "PushState", "Bridge$Navigation$IBrowserHistoryManager$PushState",
            "ParseUrl", "Bridge$Navigation$IBrowserHistoryManager$ParseUrl"
        ],
        methods: {
            PushState: function (pageId, parameters) {
                if (parameters === void 0) { parameters = null; }
                var baseUrl = Bridge.Navigation.NavigationUtility.BuildBaseUrl(pageId);

                window.history.pushState(null, "", parameters != null ? System.String.format("{0}={1}", baseUrl, Bridge.global.btoa(JSON.stringify(parameters))) : baseUrl);
            },
            ParseUrl: function () {
                var res = new Bridge.Navigation.Model.UrlDescriptor();

                var hash = window.location.hash;
                hash = System.String.replaceAll(hash, "#", "");

                if (System.String.isNullOrEmpty(hash)) {
                    return res;
                }

                var equalIndex = System.String.indexOf(hash, String.fromCharCode(61));
                if (equalIndex === -1) {
                    res.PageId = hash;
                    return res;
                }

                res.PageId = hash.substr(0, equalIndex);

                var doublePointsIndx = (equalIndex + 1) | 0;
                var parameters = hash.substr(doublePointsIndx, ((hash.length - doublePointsIndx) | 0));

                if (System.String.isNullOrEmpty(parameters)) {
                    return res;
                } // no parameters

                var decoded = Bridge.global.atob(parameters);
                var deserialized = Bridge.merge(Bridge.createInstance(System.Collections.Generic.Dictionary$2(System.String,System.Object)), JSON.parse(decoded));

                res.Parameters = deserialized;

                return res;
            }
        }
    });

    Bridge.define("Bridge.Navigation.PageDescriptor", {
        inherits: [Bridge.Navigation.IPageDescriptor],
        props: {
            Key: null,
            HtmlLocation: null,
            PageController: null,
            CanBeDirectLoad: null,
            PreparePage: null,
            SequentialDependenciesScriptLoad: false,
            RedirectRules: null,
            AutoEnableSpafAnchors: null,
            DependenciesScripts: null
        },
        alias: [
            "Key", "Bridge$Navigation$IPageDescriptor$Key",
            "HtmlLocation", "Bridge$Navigation$IPageDescriptor$HtmlLocation",
            "PageController", "Bridge$Navigation$IPageDescriptor$PageController",
            "CanBeDirectLoad", "Bridge$Navigation$IPageDescriptor$CanBeDirectLoad",
            "PreparePage", "Bridge$Navigation$IPageDescriptor$PreparePage",
            "SequentialDependenciesScriptLoad", "Bridge$Navigation$IPageDescriptor$SequentialDependenciesScriptLoad",
            "RedirectRules", "Bridge$Navigation$IPageDescriptor$RedirectRules",
            "AutoEnableSpafAnchors", "Bridge$Navigation$IPageDescriptor$AutoEnableSpafAnchors",
            "DependenciesScripts", "Bridge$Navigation$IPageDescriptor$DependenciesScripts"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.AutoEnableSpafAnchors = $asm.$.Bridge.Navigation.PageDescriptor.f1;
            }
        }
    });

    Bridge.ns("Bridge.Navigation.PageDescriptor", $asm.$);

    Bridge.apply($asm.$.Bridge.Navigation.PageDescriptor, {
        f1: function () {
            return true;
        }
    });

    Bridge.define("Bridge.Navigation.QueryParameterNavigationHistory", {
        inherits: [Bridge.Navigation.IBrowserHistoryManager],
        alias: [
            "PushState", "Bridge$Navigation$IBrowserHistoryManager$PushState",
            "ParseUrl", "Bridge$Navigation$IBrowserHistoryManager$ParseUrl"
        ],
        methods: {
            PushState: function (pageId, parameters) {
                if (parameters === void 0) { parameters = null; }
                var baseUrl = Bridge.Navigation.NavigationUtility.BuildBaseUrl(pageId);

                window.history.pushState(null, "", parameters != null ? System.String.format("{0}{1}", baseUrl, this.BuildQueryParameter(parameters)) : baseUrl);
            },
            ParseUrl: function () {
                var res = new Bridge.Navigation.Model.UrlDescriptor();
                res.Parameters = new (System.Collections.Generic.Dictionary$2(System.String,System.Object))();

                var hash = window.location.hash;
                hash = System.String.replaceAll(hash, "#", "");

                if (System.String.isNullOrEmpty(hash)) {
                    return res;
                }

                var equalIndex = System.String.indexOf(hash, String.fromCharCode(63));
                if (equalIndex === -1) {
                    res.PageId = hash;
                    return res;
                }

                res.PageId = hash.substr(0, equalIndex);

                var doublePointsIndx = (equalIndex + 1) | 0;
                var parameters = hash.substr(doublePointsIndx, ((hash.length - doublePointsIndx) | 0));

                if (System.String.isNullOrEmpty(parameters)) {
                    return res;
                } // no parameters


                var splittedByDoubleAnd = System.Linq.Enumerable.from(parameters.split("&")).toList(System.String);
                splittedByDoubleAnd.ForEach(function (f) {
                    var splitted = f.split("=");
                    res.Parameters.add(splitted[System.Array.index(0, splitted)], decodeURIComponent(splitted[System.Array.index(1, splitted)]));
                });

                return res;
            },
            BuildQueryParameter: function (parameters) {
                var $t;
                if (parameters == null || !System.Linq.Enumerable.from(parameters).any()) {
                    return "";
                }

                var strBuilder = new System.Text.StringBuilder("?");
                $t = Bridge.getEnumerator(parameters);
                try {
                    while ($t.moveNext()) {
                        var keyValuePair = $t.Current;
                        strBuilder.append(encodeURIComponent(keyValuePair.key));
                        strBuilder.append("=");
                        strBuilder.append(encodeURIComponent(Bridge.toString(keyValuePair.value)));
                        strBuilder.append("&");
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                var res = System.String.trimEnd(strBuilder.toString(), [38]);

                return res;

            }
        }
    });

    Bridge.define("Bridge.Navigation.BridgeNavigatorWithRouting", {
        inherits: [Bridge.Navigation.BridgeNavigator],
        fields: {
            _browserHistoryManager: null
        },
        alias: [
            "Navigate", "Bridge$Navigation$INavigator$Navigate",
            "InitNavigation", "Bridge$Navigation$INavigator$InitNavigation"
        ],
        ctors: {
            ctor: function (configuration, browserHistoryManager) {
                this.$initialize();
                Bridge.Navigation.BridgeNavigator.ctor.call(this, configuration);
                this._browserHistoryManager = browserHistoryManager;
                window.onpopstate = Bridge.fn.combine(window.onpopstate, Bridge.fn.bind(this, function (e) {
                    var urlInfo = this._browserHistoryManager.Bridge$Navigation$IBrowserHistoryManager$ParseUrl();
                    this.NavigateWithoutPushState(System.String.isNullOrEmpty(urlInfo.PageId) ? configuration.Bridge$Navigation$INavigatorConfigurator$HomeId : urlInfo.PageId, urlInfo.Parameters);
                }));
            }
        },
        methods: {
            NavigateWithoutPushState: function (pageId, parameters) {
                if (parameters === void 0) { parameters = null; }
                Bridge.Navigation.BridgeNavigator.prototype.Navigate.call(this, pageId, parameters);
            },
            Navigate: function (pageId, parameters) {
                if (parameters === void 0) { parameters = null; }
                this._browserHistoryManager.Bridge$Navigation$IBrowserHistoryManager$PushState(pageId, parameters);
                Bridge.Navigation.BridgeNavigator.prototype.Navigate.call(this, pageId, parameters);
            },
            InitNavigation: function () {
                var parsed = this._browserHistoryManager.Bridge$Navigation$IBrowserHistoryManager$ParseUrl();

                if (System.String.isNullOrEmpty(parsed.PageId)) {
                    Bridge.Navigation.BridgeNavigator.prototype.InitNavigation.call(this);
                } else {
                    this.EnableSpafAnchors();

                    var page = this.Configuration.Bridge$Navigation$INavigatorConfigurator$GetPageDescriptorByKey(parsed.PageId);
                    if (page == null) {
                        throw new System.Exception(System.String.format("Page not found with ID {0}", [parsed.PageId]));
                    }

                    // if not null and evaluation is false fallback to home
                    if (!Bridge.staticEquals(page.Bridge$Navigation$IPageDescriptor$CanBeDirectLoad, null) && !page.Bridge$Navigation$IPageDescriptor$CanBeDirectLoad()) {
                        this._browserHistoryManager.Bridge$Navigation$IBrowserHistoryManager$PushState(this.Configuration.Bridge$Navigation$INavigatorConfigurator$HomeId, void 0);
                        this.NavigateWithoutPushState(this.Configuration.Bridge$Navigation$INavigatorConfigurator$HomeId);
                    } else {
                        this.Navigate(parsed.PageId, parsed.Parameters);
                    }
                }
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJCcmlkZ2UuTmF2aWdhdGlvbi5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiTmF2aWdhdGlvblV0aWxpdHkuY3MiLCJVdGlsaXR5LmNzIiwiSW1wbC9CcmlkZ2VOYXZpZ2F0b3IuY3MiLCJJbXBsL0JyaWRnZU5hdmlnYXRvckNvbmZpZ0Jhc2UuY3MiLCJJbXBsL0NvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeS5jcyIsIkltcGwvUGFnZURlc2NyaXB0b3IuY3MiLCJJbXBsL1F1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3RvcnkuY3MiLCJJbXBsL0JyaWRnZU5hdmlnYXRvcldpdGhSb3V0aW5nLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0FZZ0RBOzs7Ozs7Ozs7Ozs7Ozs7d0NBVVhBLEdBQUdBLFlBQTRDQTtvQkFFeEVBLElBQUlBLGNBQWNBO3dCQUNkQSxNQUFNQSxJQUFJQTs7O29CQUVkQSxJQUFJQSxDQUFDQSx1QkFBdUJBO3dCQUN4QkEsTUFBTUEsSUFBSUEsaUJBQVVBLDBEQUFpREE7OztvQkFFekVBLFlBQVlBLGVBQVdBOztvQkFFdkJBLGtCQUFrQkEsNkJBQU9BLG9CQUFzQkEsbUJBQWFBLEFBQU9BOztvQkFFbkVBLElBQUlBLGVBQWVBO3dCQUVmQSxPQUFPQSxZQUFHQSxrREFBbUJBLGtCQUFNQSxnQ0FBZUE7OztvQkFHdERBLE9BQU9BLFlBQUlBOzs7Ozs7Ozs7Ozs7d0NBUW1CQTtvQkFFOUJBLGNBQWNBLGlDQUF5QkEsMEJBQXlCQTtvQkFDaEVBLFVBQVVBLDRCQUFxQkEsd0RBQ3pCQSxnQ0FBd0JBLFNBQVFBLFVBQXlCQSxvQ0FBNEJBLFNBQVFBLHNEQUFpQkE7b0JBQ3BIQSxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREN4QzZCQTtvQkFFcENBLElBQUlBLENBQUNBLDRCQUFtQ0E7d0JB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Z0JBRXpIQSw4QkFBeUJBO2dCQUN6QkEseURBQXFCQTtvQkFFakJBLGNBQWNBO29CQUNkQSw4QkFBOEJBLDRCQUFxQkEsa0JBQWtCQSxnRUFBdUJBLGdCQUFnQkE7Ozs7O2dEQUk5RUEsUUFBZUE7O2dCQUVqREEsZ0VBQWNBLFFBQVFBOztnQ0FFSUEsUUFBZUE7O2dCQUV6Q0EsK0VBQWlDQSxRQUFPQTtnQkFDeENBLGdFQUFjQSxRQUFRQTs7O2dCQUt0QkEsYUFBYUE7O2dCQUViQSxJQUFJQSw0QkFBcUJBO29CQUNyQkE7O29CQUdBQTs7b0JBRUFBLFdBQVdBLG1GQUEwQ0E7b0JBQ3JEQSxJQUFJQSxRQUFRQTt3QkFBTUEsTUFBTUEsSUFBSUEsaUJBQVVBLG9EQUEyQ0E7Ozs7b0JBR2pGQSxJQUFJQSw2RUFBd0JBLFNBQVFBLENBQUNBO3dCQUVqQ0EsK0VBQWlDQTt3QkFDakNBLDhCQUE4QkE7O3dCQUc5QkEsY0FBY0EsZUFBY0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuTmF2aWdhdGlvblxue1xuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTmF2aWdhdGlvblV0aWxpdHlcbiAgICB7XG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIERlZmluZSB2aXJ0dWFsIGRpcmVjdG9yeSBmb3Igc29tZXRoaW5nIGxpa2U6XG4gICAgICAgIC8vLyBwcm90b2NvbDovL2F3ZXNvbWVzaXRlLmlvL3NvbWVkaXJlY3RvcnlcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgVmlydHVhbERpcmVjdG9yeSA9IG51bGw7XG5cbiAgICAgICBcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAvLy8gR2V0IHBhcmFtZXRlciBrZXkgZnJvbSBwYXJhbWV0ZXJzIGRpY3Rpb25hcnlcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgLy8vIDx0eXBlcGFyYW0gbmFtZT1cIlRcIj48L3R5cGVwYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGFyYW1ldGVyc1wiPjwvcGFyYW0+XG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInBhcmFtS2V5XCI+PC9wYXJhbT5cbiAgICAgICAgLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEdldFBhcmFtZXRlcjxUPih0aGlzIERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMsIHN0cmluZyBwYXJhbUtleSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMgPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiUGFyYW1ldGVycyBpcyBudWxsIVwiKTtcblxuICAgICAgICAgICAgaWYgKCFwYXJhbWV0ZXJzLkNvbnRhaW5zS2V5KHBhcmFtS2V5KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJObyBwYXJhbWV0ZXIgd2l0aCBrZXkgezB9IGZvdW5kIVwiLHBhcmFtS2V5KSk7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtZXRlcnNbcGFyYW1LZXldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgcGFyc2VNZXRob2QgPSB0eXBlb2YoVCkuR2V0TWV0aG9kKFwiUGFyc2VcIiwgbmV3IFR5cGVbXSB7IHR5cGVvZihzdHJpbmcpIH0gKTtcblxuICAgICAgICAgICAgaWYgKHBhcnNlTWV0aG9kICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChUKXBhcnNlTWV0aG9kLkludm9rZShudWxsLCBuZXcgb2JqZWN0W10geyB2YWx1ZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChUKSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAvLy8gQnVpbGQgYmFzZSB1cmwgdXNpbmcgcGFnZSBpZCBhbmQgdmlydHVhbCBkaXJlY3RvcnlcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGFnZUlkXCI+PC9wYXJhbT5cbiAgICAgICAgLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQnVpbGRCYXNlVXJsKHN0cmluZyBwYWdlSWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBiYXNlVXJsID0gc3RyaW5nLkZvcm1hdChcInswfS8vezF9XCIsV2luZG93LkxvY2F0aW9uLlByb3RvY29sLFdpbmRvdy5Mb2NhdGlvbi5Ib3N0KTtcbiAgICAgICAgICAgIGJhc2VVcmwgPSBzdHJpbmcuSXNOdWxsT3JFbXB0eShWaXJ0dWFsRGlyZWN0b3J5KVxuICAgICAgICAgICAgICAgID8gc3RyaW5nLkZvcm1hdChcInswfSN7MX1cIixiYXNlVXJsLHBhZ2VJZCkgICAgICAgICAgICAgICAgOiBzdHJpbmcuRm9ybWF0KFwiezB9L3sxfSN7Mn1cIixiYXNlVXJsLFZpcnR1YWxEaXJlY3RvcnkscGFnZUlkKTtcbiAgICAgICAgICAgIHJldHVybiBiYXNlVXJsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIEJyaWRnZS5qUXVlcnkyO1xuXG5uYW1lc3BhY2UgQnJpZGdlLk5hdmlnYXRpb25cbntcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFV0aWxpdHlcbiAgICB7XG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIExvYWQgc2NyaXB0IHNlcXVlbnRpYWxseVxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzY3JpcHRzXCI+PC9wYXJhbT5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNlcXVlbnRpYWxTY3JpcHRMb2FkKExpc3Q8c3RyaW5nPiBzY3JpcHRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIVN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PHN0cmluZz4oc2NyaXB0cykpIHJldHVybjtcbiAgICAgICAgICAgIHZhciB0b0xvYWQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0PHN0cmluZz4oc2NyaXB0cyk7XG4gICAgICAgICAgICBqUXVlcnkuR2V0U2NyaXB0KHRvTG9hZCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3QsIHN0cmluZywgZ2xvYmFsOjpCcmlkZ2UualF1ZXJ5Mi5qcVhIUj4pKChvLCBzLCBhcmczKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNjcmlwdHMuUmVtb3ZlKHRvTG9hZCk7XG4gICAgICAgICAgICAgICAgU2VxdWVudGlhbFNjcmlwdExvYWQoc2NyaXB0cyk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcblxubmFtZXNwYWNlIEJyaWRnZS5OYXZpZ2F0aW9uXG57XG4gICAgLy8vIDxzdW1tYXJ5PlxuICAgIC8vLyBJTmF2aWdhdG9yIGltcGxlbWVudGF0aW9uXG4gICAgLy8vIDwvc3VtbWFyeT5cbiAgICBwdWJsaWMgY2xhc3MgQnJpZGdlTmF2aWdhdG9yIDogSU5hdmlnYXRvclxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgSUFtTG9hZGFibGUgX2FjdHVhbENvbnRyb2xsZXI7XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IElOYXZpZ2F0b3JDb25maWd1cmF0b3IgQ29uZmlndXJhdGlvbjtcbiAgICAgICAgcHVibGljIEJyaWRnZU5hdmlnYXRvcihJTmF2aWdhdG9yQ29uZmlndXJhdG9yIGNvbmZpZ3VyYXRpb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHZvaWQgRW5hYmxlU3BhZkFuY2hvcnMoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgYWxsQW5jaG9ycyA9IGpRdWVyeS5TZWxlY3QoXCJhXCIpO1xuICAgICAgICAgICAgYWxsQW5jaG9ycy5PZmYoRXZlbnRUeXBlLkNsaWNrLlRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgYWxsQW5jaG9ycy5DbGljaygoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLmpRdWVyeTIualF1ZXJ5TW91c2VFdmVudD4pKGV2ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZXYuVGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsaWNrZWRFbGVtZW50LkdldFR5cGUoKSAhPSB0eXBlb2YoSFRNTEFuY2hvckVsZW1lbnQpKVxuICAgICAgICAgICAgICAgICAgICBjbGlja2VkRWxlbWVudCA9IGpRdWVyeS5FbGVtZW50KGV2LlRhcmdldCkuUGFyZW50cyhcImFcIikuR2V0KDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBjbGlja2VkRWxlbWVudC5HZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KGhyZWYpKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNNeUhyZWYgPSBocmVmLlN0YXJ0c1dpdGgoXCJzcGFmOlwiKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGlzIG15IGhyZWZcbiAgICAgICAgICAgICAgICBpZiAoaXNNeUhyZWYpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBldi5QcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZUlkID0gaHJlZi5SZXBsYWNlKFwic3BhZjpcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTmF2aWdhdGUocGFnZUlkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhbmNob3IgZGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIE5hdmlnYXRlIHRvIGEgcGFnZSBJRC5cbiAgICAgICAgLy8vIFRoZSBJRCBtdXN0IGJlIHJlZ2lzdGVyZWQuXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInBhZ2VJZFwiPjwvcGFyYW0+XG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgTmF2aWdhdGUoc3RyaW5nIHBhZ2VJZCwgRGljdGlvbmFyeTxzdHJpbmcsb2JqZWN0PiBwYXJhbWV0ZXJzID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLkNvbmZpZ3VyYXRpb24uR2V0UGFnZURlc2NyaXB0b3JCeUtleShwYWdlSWQpO1xuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiUGFnZSBub3QgZm91bmQgd2l0aCBJRCB7MH1cIixwYWdlSWQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY2hlY2sgcmVkaXJlY3QgcnVsZVxuICAgICAgICAgICAgdmFyIHJlZGlyZWN0S2V5ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYWdlLlJlZGlyZWN0UnVsZXMpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxGdW5jPHN0cmluZz4+KFwia2V5MVwiKS5JbnZva2UoKTooc3RyaW5nKW51bGw7XG4gICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPckVtcHR5KHJlZGlyZWN0S2V5KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk5hdmlnYXRlKHJlZGlyZWN0S2V5LHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGJvZHkgPSB0aGlzLkNvbmZpZ3VyYXRpb24uQm9keTtcbiAgICAgICAgICAgIGlmKGJvZHkgPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiQ2Fubm90IGZpbmQgbmF2aWdhdGlvbiBib2R5IGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBsZWF2ZSBhY3R1YWwgY29udHJvbGVsclxuICAgICAgICAgICAgaWYgKHRoaXMuTGFzdE5hdmlnYXRlQ29udHJvbGxlciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuTGFzdE5hdmlnYXRlQ29udHJvbGxlci5PbkxlYXZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuQ29uZmlndXJhdGlvbi5Cb2R5LkxvYWQocGFnZS5IdG1sTG9jYXRpb24uSW52b2tlKCksbnVsbCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIHN0cmluZywgZ2xvYmFsOjpCcmlkZ2UualF1ZXJ5Mi5qcVhIUj4pKGFzeW5jIChvLHMsYSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBsb2FkIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkRlcGVuZGVuY2llc1NjcmlwdHMgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0xpc3Q8c3RyaW5nPigocGFnZS5EZXBlbmRlbmNpZXNTY3JpcHRzLkludm9rZSgpKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhZ2UuU2VxdWVudGlhbERlcGVuZGVuY2llc1NjcmlwdExvYWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsaXR5LlNlcXVlbnRpYWxTY3JpcHRMb2FkKHNjcmlwdHMpO1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXJhbGxlbCBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0c1Rhc2sgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxzdHJpbmcsZ2xvYmFsOjpTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzLlRhc2s8b2JqZWN0W10+PihzY3JpcHRzLChnbG9iYWw6OlN5c3RlbS5GdW5jPHN0cmluZywgZ2xvYmFsOjpTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzLlRhc2s8b2JqZWN0W10+PikodXJsID0+IFRhc2suRnJvbVByb21pc2UoalF1ZXJ5LkdldFNjcmlwdCh1cmwpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGFzay5XaGVuQWxsPG9iamVjdFtdPihzY3JpcHRzVGFzayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHByZXBhcmUgcGFnZVxuICAgICAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkyXCIscGFnZS5QcmVwYXJlUGFnZSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pmdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxBY3Rpb24+KFwia2V5MlwiKS5JbnZva2UoKSk6bnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIGF1dG8gZW5hYmxlIHNwYWYgYW5jaG9yc1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5Db25maWd1cmF0aW9uLkRpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuYWJsZUFuY2hvcnMgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5M1wiLHBhZ2UuQXV0b0VuYWJsZVNwYWZBbmNob3JzKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8RnVuYzxib29sPj4oXCJrZXkzXCIpLkludm9rZSgpOihib29sPyludWxsO1xuICAgICAgICAgICAgICAgICAgICBpZihlbmFibGVBbmNob3JzLkhhc1ZhbHVlICYmIGVuYWJsZUFuY2hvcnMuVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkVuYWJsZVNwYWZBbmNob3JzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuUGFnZUNvbnRyb2xsZXIgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgbmV3IGNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBwYWdlLlBhZ2VDb250cm9sbGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuT25Mb2FkKHBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIF9hY3R1YWxDb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT25OYXZpZ2F0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25OYXZpZ2F0ZWQuSW52b2tlKHRoaXMsY29udHJvbGxlcikpOm51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkpOyBcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8SUFtTG9hZGFibGU+IE9uTmF2aWdhdGVkO1xucHVibGljIElBbUxvYWRhYmxlIExhc3ROYXZpZ2F0ZUNvbnRyb2xsZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIF9hY3R1YWxDb250cm9sbGVyO1xyXG4gICAgfVxyXG59XG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFN1YnNjcmliZSB0byBhbmNob3JzIGNsaWNrXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgSW5pdE5hdmlnYXRpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkVuYWJsZVNwYWZBbmNob3JzKCk7XG5cbiAgICAgICAgICAgIC8vIGdvIGhvbWVcbiAgICAgICAgICAgIHRoaXMuTmF2aWdhdGUodGhpcy5Db25maWd1cmF0aW9uLkhvbWVJZCk7XG4gICAgICAgIH1cblxuICAgICAgIFxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgQnJpZGdlLmpRdWVyeTI7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuTmF2aWdhdGlvblxue1xuICAgIC8vLyA8c3VtbWFyeT5cbiAgICAvLy8gSU5hdmlnYXRvckNvbmZpZ3VyYXRvciBJbXBsZW1lbnRhdGlvbi4gTXVzdCBiZSBleHRlbmRlZC5cbiAgICAvLy8gPC9zdW1tYXJ5PlxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlIDogSU5hdmlnYXRvckNvbmZpZ3VyYXRvclxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTGlzdDxJUGFnZURlc2NyaXB0b3I+IF9yb3V0ZXM7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IElMaXN0PElQYWdlRGVzY3JpcHRvcj4gQ3JlYXRlUm91dGVzKCk7XG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBqUXVlcnkgQm9keSB7IGdldDsgfVxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgc3RyaW5nIEhvbWVJZCB7IGdldDsgfVxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgYm9vbCBEaXNhYmxlQXV0b1NwYWZBbmNob3JzT25OYXZpZ2F0ZSB7IGdldDsgfVxuXG5cblxuICAgICAgICBwcm90ZWN0ZWQgQnJpZGdlTmF2aWdhdG9yQ29uZmlnQmFzZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlcyA9IHRoaXMuQ3JlYXRlUm91dGVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgSVBhZ2VEZXNjcmlwdG9yIEdldFBhZ2VEZXNjcmlwdG9yQnlLZXkoc3RyaW5nIGtleSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PGdsb2JhbDo6QnJpZGdlLk5hdmlnYXRpb24uSVBhZ2VEZXNjcmlwdG9yPih0aGlzLl9yb3V0ZXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpCcmlkZ2UuTmF2aWdhdGlvbi5JUGFnZURlc2NyaXB0b3IsIGJvb2w+KShzPT4gc3RyaW5nLkVxdWFscyhzLktleSwga2V5LCBTdHJpbmdDb21wYXJpc29uLkN1cnJlbnRDdWx0dXJlSWdub3JlQ2FzZSkpKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb24uTW9kZWw7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuTmF2aWdhdGlvblxue1xuICAgIHB1YmxpYyBjbGFzcyBDb21wbGV4T2JqZWN0TmF2aWdhdGlvbkhpc3RvcnkgOiBJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyXG4gICAge1xuICAgICAgICBwdWJsaWMgdm9pZCBQdXNoU3RhdGUoc3RyaW5nIHBhZ2VJZCwgRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycyA9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBiYXNlVXJsID0gTmF2aWdhdGlvblV0aWxpdHkuQnVpbGRCYXNlVXJsKHBhZ2VJZCk7XG5cbiAgICAgICAgICAgIFdpbmRvdy5IaXN0b3J5LlB1c2hTdGF0ZShudWxsLCBzdHJpbmcuRW1wdHksXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycyAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgID8gc3RyaW5nLkZvcm1hdChcInswfT17MX1cIixiYXNlVXJsLEdsb2JhbC5CdG9hKEpTT04uU3RyaW5naWZ5KHBhcmFtZXRlcnMpKSk6IGJhc2VVcmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFVybERlc2NyaXB0b3IgUGFyc2VVcmwoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcmVzID0gbmV3IFVybERlc2NyaXB0b3IoKTtcblxuICAgICAgICAgICAgdmFyIGhhc2ggPSBXaW5kb3cuTG9jYXRpb24uSGFzaDtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoLlJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yRW1wdHkoaGFzaCkpIHJldHVybiByZXM7XG5cbiAgICAgICAgICAgIHZhciBlcXVhbEluZGV4ID0gaGFzaC5JbmRleE9mKCc9Jyk7XG4gICAgICAgICAgICBpZiAoZXF1YWxJbmRleCA9PSAtMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXMuUGFnZUlkID0gaGFzaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXMuUGFnZUlkID0gaGFzaC5TdWJzdHJpbmcoMCwgZXF1YWxJbmRleCk7ICBcblxuICAgICAgICAgICAgdmFyIGRvdWJsZVBvaW50c0luZHggPSBlcXVhbEluZGV4ICsgMTtcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gaGFzaC5TdWJzdHJpbmcoZG91YmxlUG9pbnRzSW5keCwgaGFzaC5MZW5ndGggLSBkb3VibGVQb2ludHNJbmR4KTtcblxuICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KHBhcmFtZXRlcnMpKSByZXR1cm4gcmVzOyAvLyBubyBwYXJhbWV0ZXJzXG5cbiAgICAgICAgICAgIHZhciBkZWNvZGVkID0gR2xvYmFsLkF0b2IocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB2YXIgZGVzZXJpYWxpemVkID0gSlNPTi5QYXJzZTxEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0Pj4oZGVjb2RlZCk7XG5cbiAgICAgICAgICAgIHJlcy5QYXJhbWV0ZXJzID0gZGVzZXJpYWxpemVkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xudXNpbmcgQnJpZGdlLmpRdWVyeTI7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuTmF2aWdhdGlvblxue1xuICAgIHB1YmxpYyBjbGFzcyBQYWdlRGVzY3JpcHRvciA6IElQYWdlRGVzY3JpcHRvclxuICAgIHtcbiAgICAgICAgcHVibGljIFBhZ2VEZXNjcmlwdG9yKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5BdXRvRW5hYmxlU3BhZkFuY2hvcnMgPSAoKSA9PiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0cmluZyBLZXkgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgRnVuYzxzdHJpbmc+IEh0bWxMb2NhdGlvbiB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBGdW5jPElBbUxvYWRhYmxlPiBQYWdlQ29udHJvbGxlciB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBGdW5jPGJvb2w+IENhbkJlRGlyZWN0TG9hZCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBBY3Rpb24gUHJlcGFyZVBhZ2UgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgYm9vbCBTZXF1ZW50aWFsRGVwZW5kZW5jaWVzU2NyaXB0TG9hZCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBGdW5jPHN0cmluZz4gUmVkaXJlY3RSdWxlcyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBGdW5jPGJvb2w+IEF1dG9FbmFibGVTcGFmQW5jaG9ycyB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBGdW5jPElFbnVtZXJhYmxlPHN0cmluZz4+IERlcGVuZGVuY2llc1NjcmlwdHMgeyBnZXQ7IHNldDsgfVxuICAgIH1cblxuICAgIFxufSIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGV4dDtcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uLk1vZGVsO1xuXG5uYW1lc3BhY2UgQnJpZGdlLk5hdmlnYXRpb25cbntcbiAgICBwdWJsaWMgY2xhc3MgUXVlcnlQYXJhbWV0ZXJOYXZpZ2F0aW9uSGlzdG9yeSA6IElCcm93c2VySGlzdG9yeU1hbmFnZXJcbiAgICB7XG4gICAgICAgIHB1YmxpYyB2b2lkIFB1c2hTdGF0ZShzdHJpbmcgcGFnZUlkLCBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGJhc2VVcmwgPSBOYXZpZ2F0aW9uVXRpbGl0eS5CdWlsZEJhc2VVcmwocGFnZUlkKTtcblxuICAgICAgICAgICAgV2luZG93Lkhpc3RvcnkuUHVzaFN0YXRlKG51bGwsIHN0cmluZy5FbXB0eSxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyBzdHJpbmcuRm9ybWF0KFwiezB9ezF9XCIsYmFzZVVybCxCdWlsZFF1ZXJ5UGFyYW1ldGVyKHBhcmFtZXRlcnMpKTogYmFzZVVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgVXJsRGVzY3JpcHRvciBQYXJzZVVybCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBuZXcgVXJsRGVzY3JpcHRvcigpO1xuICAgICAgICAgICAgcmVzLlBhcmFtZXRlcnMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4oKTtcblxuICAgICAgICAgICAgdmFyIGhhc2ggPSBXaW5kb3cuTG9jYXRpb24uSGFzaDtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoLlJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yRW1wdHkoaGFzaCkpIHJldHVybiByZXM7XG5cbiAgICAgICAgICAgIHZhciBlcXVhbEluZGV4ID0gaGFzaC5JbmRleE9mKCc/Jyk7XG4gICAgICAgICAgICBpZiAoZXF1YWxJbmRleCA9PSAtMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXMuUGFnZUlkID0gaGFzaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXMuUGFnZUlkID0gaGFzaC5TdWJzdHJpbmcoMCwgZXF1YWxJbmRleCk7ICBcblxuICAgICAgICAgICAgdmFyIGRvdWJsZVBvaW50c0luZHggPSBlcXVhbEluZGV4ICsgMTtcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gaGFzaC5TdWJzdHJpbmcoZG91YmxlUG9pbnRzSW5keCwgaGFzaC5MZW5ndGggLSBkb3VibGVQb2ludHNJbmR4KTtcblxuICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KHBhcmFtZXRlcnMpKSByZXR1cm4gcmVzOyAvLyBubyBwYXJhbWV0ZXJzXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwbGl0dGVkQnlEb3VibGVBbmQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvTGlzdDxzdHJpbmc+KHBhcmFtZXRlcnMuU3BsaXQoXCImXCIpKTtcbiAgICAgICAgICAgIHNwbGl0dGVkQnlEb3VibGVBbmQuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPHN0cmluZz4pKGYgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgc3BsaXR0ZWQgPSBmLlNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICByZXMuUGFyYW1ldGVycy5BZGQoc3BsaXR0ZWRbMF0sR2xvYmFsLkRlY29kZVVSSUNvbXBvbmVudChzcGxpdHRlZFsxXSkpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgQnVpbGRRdWVyeVBhcmFtZXRlcihEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycyA9PSBudWxsIHx8ICFTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLktleVZhbHVlUGFpcjxzdHJpbmcsIG9iamVjdD4+KHBhcmFtZXRlcnMpKSByZXR1cm4gc3RyaW5nLkVtcHR5O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3RyQnVpbGRlciA9IG5ldyBTdHJpbmdCdWlsZGVyKFwiP1wiKTtcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBrZXlWYWx1ZVBhaXIgaW4gcGFyYW1ldGVycylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdHJCdWlsZGVyLkFwcGVuZChHbG9iYWwuRW5jb2RlVVJJQ29tcG9uZW50KGtleVZhbHVlUGFpci5LZXkpKTtcbiAgICAgICAgICAgICAgICBzdHJCdWlsZGVyLkFwcGVuZChcIj1cIik7XG4gICAgICAgICAgICAgICAgc3RyQnVpbGRlci5BcHBlbmQoR2xvYmFsLkVuY29kZVVSSUNvbXBvbmVudChrZXlWYWx1ZVBhaXIuVmFsdWUuVG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIHN0ckJ1aWxkZXIuQXBwZW5kKFwiJlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlcyA9IHN0ckJ1aWxkZXIuVG9TdHJpbmcoKS5UcmltRW5kKCcmJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiByZXM7XG5cbiAgICAgICAgfVxuXG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb24uTW9kZWw7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuTmF2aWdhdGlvblxue1xuICAgIHB1YmxpYyBjbGFzcyBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZyA6IEJyaWRnZU5hdmlnYXRvclxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJQnJvd3Nlckhpc3RvcnlNYW5hZ2VyIF9icm93c2VySGlzdG9yeU1hbmFnZXI7XG5cbiAgICAgICAgcHVibGljIEJyaWRnZU5hdmlnYXRvcldpdGhSb3V0aW5nKElOYXZpZ2F0b3JDb25maWd1cmF0b3IgY29uZmlndXJhdGlvbiwgSUJyb3dzZXJIaXN0b3J5TWFuYWdlciBicm93c2VySGlzdG9yeU1hbmFnZXIpIDogYmFzZShjb25maWd1cmF0aW9uKVxuICAgICAgICB7XG4gICAgICAgICAgICBfYnJvd3Nlckhpc3RvcnlNYW5hZ2VyID0gYnJvd3Nlckhpc3RvcnlNYW5hZ2VyO1xuICAgICAgICAgICAgV2luZG93Lk9uUG9wU3RhdGUgKz0gZSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB1cmxJbmZvID0gX2Jyb3dzZXJIaXN0b3J5TWFuYWdlci5QYXJzZVVybCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuTmF2aWdhdGVXaXRob3V0UHVzaFN0YXRlKHN0cmluZy5Jc051bGxPckVtcHR5KHVybEluZm8uUGFnZUlkKSA/IGNvbmZpZ3VyYXRpb24uSG9tZUlkIDogdXJsSW5mby5QYWdlSWQsIHVybEluZm8uUGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE5hdmlnYXRlV2l0aG91dFB1c2hTdGF0ZShzdHJpbmcgcGFnZUlkLCBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzID0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgYmFzZS5OYXZpZ2F0ZShwYWdlSWQsIHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE5hdmlnYXRlKHN0cmluZyBwYWdlSWQsIERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBfYnJvd3Nlckhpc3RvcnlNYW5hZ2VyLlB1c2hTdGF0ZShwYWdlSWQscGFyYW1ldGVycyk7XG4gICAgICAgICAgICBiYXNlLk5hdmlnYXRlKHBhZ2VJZCwgcGFyYW1ldGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBJbml0TmF2aWdhdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWQgPSBfYnJvd3Nlckhpc3RvcnlNYW5hZ2VyLlBhcnNlVXJsKCk7XG5cbiAgICAgICAgICAgIGlmIChzdHJpbmcuSXNOdWxsT3JFbXB0eShwYXJzZWQuUGFnZUlkKSlcbiAgICAgICAgICAgICAgICBiYXNlLkluaXROYXZpZ2F0aW9uKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmFzZS5FbmFibGVTcGFmQW5jaG9ycygpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLkNvbmZpZ3VyYXRpb24uR2V0UGFnZURlc2NyaXB0b3JCeUtleShwYXJzZWQuUGFnZUlkKTtcbiAgICAgICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSB0aHJvdyBuZXcgRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJQYWdlIG5vdCBmb3VuZCB3aXRoIElEIHswfVwiLHBhcnNlZC5QYWdlSWQpKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBudWxsIGFuZCBldmFsdWF0aW9uIGlzIGZhbHNlIGZhbGxiYWNrIHRvIGhvbWVcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5DYW5CZURpcmVjdExvYWQgIT0gbnVsbCAmJiAhcGFnZS5DYW5CZURpcmVjdExvYWQuSW52b2tlKCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBfYnJvd3Nlckhpc3RvcnlNYW5hZ2VyLlB1c2hTdGF0ZSh0aGlzLkNvbmZpZ3VyYXRpb24uSG9tZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5OYXZpZ2F0ZVdpdGhvdXRQdXNoU3RhdGUodGhpcy5Db25maWd1cmF0aW9uLkhvbWVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5OYXZpZ2F0ZShwYXJzZWQuUGFnZUlkLHBhcnNlZC5QYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgICBcbiAgICAgICAgXG4gICAgfVxufSJdCn0K
