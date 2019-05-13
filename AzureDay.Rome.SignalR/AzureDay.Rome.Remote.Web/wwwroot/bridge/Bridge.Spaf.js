/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("Bridge.Spaf", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.Spaf.Attributes.SingleInstanceAttribute", {
        inherits: [System.Attribute]
    });

    Bridge.define("Bridge.Spaf.IViewModelLifeCycle", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Spaf.ViewModelBase", {
        fields: {
            _pageNode: null
        },
        props: {
            PageNode: {
                get: function () {
                    return this._pageNode || ((this._pageNode = document.getElementById(this.ElementId())));
                }
            }
        },
        methods: {
            ApplyBindings: function () {
                ko.applyBindings(this, this.PageNode);
            },
            RemoveBindings: function () {
                ko.removeNode(this.PageNode);
            }
        }
    });

    Bridge.define("Bridge.Spaf.LoadableViewModel", {
        inherits: [Bridge.Spaf.ViewModelBase,Bridge.Navigation.IAmLoadable],
        fields: {
            Partials: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            init: function () {
                this.Partials = new (System.Collections.Generic.List$1(Bridge.Spaf.IViewModelLifeCycle)).ctor();
            }
        },
        methods: {
            OnLoad: function (parameters) {
                var $t;
                this.ApplyBindings();
                ($t = this.Partials) != null ? $t.ForEach(function (f) {
                        f.Bridge$Spaf$IViewModelLifeCycle$Init(parameters);
                    }) : null;
            },
            OnLeave: function () {
                var $t;
                ($t = this.Partials) != null ? $t.ForEach(function (f) {
                        f.Bridge$Spaf$IViewModelLifeCycle$DeInit();
                    }) : null;
                this.RemoveBindings();
            }
        }
    });

    Bridge.define("Bridge.Spaf.PartialModel", {
        inherits: [Bridge.Spaf.IViewModelLifeCycle],
        fields: {
            _partialElement: null
        },
        alias: [
            "Init", "Bridge$Spaf$IViewModelLifeCycle$Init",
            "DeInit", "Bridge$Spaf$IViewModelLifeCycle$DeInit"
        ],
        methods: {
            /**
             * Init partial
             *
             * @instance
             * @public
             * @this Bridge.Spaf.PartialModel
             * @memberof Bridge.Spaf.PartialModel
             * @param   {System.Collections.Generic.Dictionary$2}    parameters    data for init the partials
             * @return  {void}
             */
            Init: function (parameters) {

                $.get(this.HtmlUrl, null, Bridge.fn.bind(this, function (o, s, arg3) {
                    var $t;
                    this._partialElement = ($t = document.createElement("div"), $t.innerHTML = Bridge.toString(o), $t);
                    var node = document.getElementById(this.ElementId());
                    node.appendChild(this._partialElement);
                    ko.applyBindings(this, this._partialElement);
                }));
            },
            DeInit: function () {
                if (this._partialElement == null) {
                    return;
                }
                var data = ko.dataFor(this._partialElement);
                if (data == null) {
                    return;
                }

                ko.removeNode(this._partialElement);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJCcmlkZ2UuU3BhZi5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiVmlld01vZGVsQmFzZS5jcyIsIkxvYWRhYmxlVmlld01vZGVsLmNzIiwiUGFydGlhbE1vZGVsLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFpQlFBLE9BQU9BLGtCQUFhQSxDQUFDQSxrQkFBaUJBLHdCQUE0QkE7Ozs7OztnQkFLOURBLGlCQUEwQkEsTUFBTUE7OztnQkFLaENBLGNBQXVCQTs7Ozs7Ozs7Ozs7Ozs7OztnQ0NMaUNBLEtBQUlBOzs7OzhCQWJyQ0E7O2dCQUV2QkE7Z0JBQ0FBLE1BQW9DQSxrQkFBZ0JBLE9BQUtBLEFBQXFDQSxXQUEwRUEsQUFBaUVBO3dCQUFJQSx1Q0FBT0E7eUJBQWVBOzs7O2dCQUtuUUEsTUFBb0NBLGtCQUFnQkEsT0FBS0EsQUFBcUNBLFdBQTBFQSxBQUFpRUE7d0JBQUdBO3lCQUFjQTtnQkFDMVBBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQ1NxQkE7O2dCQUdyQkEsTUFBV0EsY0FBY0EsTUFBTUEsQUFBc0VBLCtCQUFDQSxHQUFHQSxHQUFHQTs7b0JBRXhHQSx1QkFBdUJBLG9EQUVQQTtvQkFFaEJBLFdBQVdBLHdCQUE0QkE7b0JBQ3ZDQSxpQkFBcURBO29CQUNyREEsaUJBQTBCQSxNQUFNQTs7OztnQkFPcENBLElBQUlBLHdCQUF3QkE7b0JBQU1BOztnQkFDbENBLFdBQVdBLFdBQW9CQTtnQkFDL0JBLElBQUlBLFFBQVFBO29CQUFNQTs7O2dCQUVsQkEsY0FBdUJBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFJldHlwZWQ7XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIFZpZXdNb2RlbEJhc2VcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGRvbS5IVE1MRWxlbWVudCBfcGFnZU5vZGU7XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gRWxlbWVudCBpZCBvZiB0aGUgcGFnZSBcclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHN0cmluZyBFbGVtZW50SWQoKTtcclxucHVibGljIGRvbS5IVE1MRWxlbWVudCBQYWdlTm9kZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gX3BhZ2VOb2RlID8/ICh0aGlzLl9wYWdlTm9kZSA9IGRvbS5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChFbGVtZW50SWQoKSkpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIHZvaWQgQXBwbHlCaW5kaW5ncygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBrbm9ja291dC5rby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMuUGFnZU5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQmluZGluZ3MoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAga25vY2tvdXQua28ucmVtb3ZlTm9kZSh0aGlzLlBhZ2VOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xyXG5cclxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXHJcbntcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBMb2FkYWJsZVZpZXdNb2RlbCA6IFZpZXdNb2RlbEJhc2UsIElBbUxvYWRhYmxlXHJcbiAgICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8SVZpZXdNb2RlbExpZmVDeWNsZT4gUGFydGlhbHMgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgT25Mb2FkKERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHBhcmFtZXRlcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLkFwcGx5QmluZGluZ3MoKTtcclxuICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIix0aGlzLlBhcnRpYWxzKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPExpc3Q8SVZpZXdNb2RlbExpZmVDeWNsZT4+KFwia2V5MVwiKS5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuU3BhZi5JVmlld01vZGVsTGlmZUN5Y2xlPikoZj0+IGYuSW5pdChwYXJhbWV0ZXJzKSkpKTpudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBPbkxlYXZlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkyXCIsdGhpcy5QYXJ0aWFscykhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pmdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxMaXN0PElWaWV3TW9kZWxMaWZlQ3ljbGU+PihcImtleTJcIikuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLlNwYWYuSVZpZXdNb2RlbExpZmVDeWNsZT4pKGY9PmYuRGVJbml0KCkpKSk6bnVsbDtcclxuICAgICAgICAgICAgYmFzZS5SZW1vdmVCaW5kaW5ncygpO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIExpc3Q8SVZpZXdNb2RlbExpZmVDeWNsZT4gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX1BhcnRpYWxzPW5ldyBMaXN0PElWaWV3TW9kZWxMaWZlQ3ljbGU+KCk7fVxyXG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBCcmlkZ2UuU3BhZlxue1xuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBQYXJ0aWFsTW9kZWwgOiAgSVZpZXdNb2RlbExpZmVDeWNsZVxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSBkb20uSFRNTERpdkVsZW1lbnQgX3BhcnRpYWxFbGVtZW50O1xuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIEVsZW1lbnQgaWQgb2YgdGhlIHBhZ2UgXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBzdHJpbmcgRWxlbWVudElkKCk7XG4gICAgICAgIFxuICAgICAgICAvLy8gPHN1bW1hcnk+XG4gICAgICAgIC8vLyBIdG1sTG9jYXRpb25cbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IHN0cmluZyBIdG1sVXJsIHsgZ2V0OyB9XG5cblxuICAgICAgICAvLy8gPHN1bW1hcnk+XG4gICAgICAgIC8vLyBJbml0IHBhcnRpYWxcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGFyYW1ldGVyc1wiPmRhdGEgZm9yIGluaXQgdGhlIHBhcnRpYWxzPC9wYXJhbT5cbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBJbml0KERpY3Rpb25hcnk8c3RyaW5nLG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuXG4gICAgICAgICAgICBqUXVlcnkuR2V0KHRoaXMuSHRtbFVybCwgbnVsbCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxvYmplY3QsIHN0cmluZywgZ2xvYmFsOjpCcmlkZ2UualF1ZXJ5Mi5qcVhIUj4pKChvLCBzLCBhcmczKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpYWxFbGVtZW50ID0gbmV3IGRvbS5IVE1MRGl2RWxlbWVudFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJIVE1MID0gby5Ub1N0cmluZygpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGRvbS5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChFbGVtZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZDxnbG9iYWw6OlJldHlwZWQuZG9tLkhUTUxEaXZFbGVtZW50Pih0aGlzLl9wYXJ0aWFsRWxlbWVudCk7XG4gICAgICAgICAgICAgICAga25vY2tvdXQua28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLl9wYXJ0aWFsRWxlbWVudCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIERlSW5pdCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGtvIGNvbnRhaW5zIHRoaXMgbm9kZVxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRpYWxFbGVtZW50ID09IG51bGwpIHJldHVybjtcbiAgICAgICAgICAgIHZhciBkYXRhID0ga25vY2tvdXQua28uZGF0YUZvcih0aGlzLl9wYXJ0aWFsRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGtub2Nrb3V0LmtvLnJlbW92ZU5vZGUodGhpcy5fcGFydGlhbEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGludGVyZmFjZSBJVmlld01vZGVsTGlmZUN5Y2xlXG4gICAge1xuICAgICAgICB2b2lkIEluaXQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycyk7XG4gICAgICAgIHZvaWQgRGVJbml0KCk7XG4gICAgfVxufVxuXG5cblxuIl0KfQo=
