/**
 * A Bridge.Net definition library for the ASP.Net Core SignalR client.
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("Bridge.AspNetCore.SignalR.Client", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.AspNetCore.SignalR.Client.test", {
        ctors: {
            ctor: function () {
                this.$initialize();
                var hubConnection = new signalR.HubConnectionBuilder().withUrl("/test").build();


                hubConnection.on("Send", function (data) {
                    System.Console.WriteLine(data);
                });

                hubConnection.onclose(function (error) {
                    System.Console.WriteLine(error.Message);
                });

                hubConnection.start().then(function () {
                    hubConnection.invoke("send", "Hello");
                }, null);

                hubConnection.stop();
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJCcmlkZ2UuQXNwTmV0Q29yZS5TaWduYWxSLkNsaWVudC5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsidGVzdC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7OztnQkFRWUEsb0JBQW9CQSxJQUFJQTs7O2dCQU14QkEseUJBQXlCQSxBQUFtQkEsVUFBQ0E7b0JBR3pDQSx5QkFBa0JBOzs7Z0JBSXRCQSxzQkFBc0JBLEFBQThDQSxVQUFDQTtvQkFHakVBLHlCQUFrQkE7OztnQkFJdEJBLDJCQUNpQkEsQUFBd0JBO29CQUdqQ0E7bUJBRVFBLEFBQThGQTs7Z0JBRzlHQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnRcclxue1xyXG4gICAgcHVibGljIGNsYXNzIHRlc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdGVzdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaHViQ29ubmVjdGlvbiA9IG5ldyBIdWJDb25uZWN0aW9uQnVpbGRlcigpLldpdGhVcmwoXCIvdGVzdFwiKS5CdWlsZCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ29ubmVjdCB0byBhIGh1YlxyXG4gICAgICAgICAgICAvL3ZhciBodWJDb25uZWN0aW9uID0gbmV3IEh1YkNvbm5lY3Rpb24oXCIvdGVzdFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldHVwIG9uIGRhdGEgcmVjZWl2ZWQgZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAgICBodWJDb25uZWN0aW9uLk9uKFwiU2VuZFwiLCBuZXcgQWN0aW9uPHN0cmluZz4oKGRhdGEpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIExvZyB0aGUgcmVjZWl2ZWQgZGF0YSB0byB0aGUgY29uc29sZVxyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldHVwIG9uIGNvbm5lY3Rpb24gY2xvc2UgaGFuZGxlclxyXG4gICAgICAgICAgICBodWJDb25uZWN0aW9uLk9uQ2xvc2UoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKChlcnJvcikgPT4gXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIExvZyB0aGUgZXJyb3JcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKGVycm9yLk1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdGFydCB0aGUgY29ubmVjdGlvblxyXG4gICAgICAgICAgICBodWJDb25uZWN0aW9uLlN0YXJ0KCkuVGhlbihcclxuICAgICAgICAgICAgICAgIG9uZnVsZmlsbGVkOiAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgYSBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgaHViQ29ubmVjdGlvbi5JbnZva2UoXCJzZW5kXCIsIFwiSGVsbG9cIik7XHJcbiAgICAgICAgICAgICAgICB9KSwgXHJcbiAgICAgICAgICAgICAgICBvbnJlamVjdGVkOiAoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxvYmplY3QsIGdsb2JhbDo6QnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQuVGhyZWFkaW5nLklQcm9taXNlTGlrZT4pbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdG9wIHRoZSBjb25uZWN0aW9uXHJcbiAgICAgICAgICAgIGh1YkNvbm5lY3Rpb24uU3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdCn0K
