namespace AzureDay.Rome.Remote
{
    public static class Configuration
    {
        #if DEBUG
        public static string GameServer { get; } = "http://localhost:5000/play";
        #else
        public static string GameServer { get; } = "https://ad-rome-admin.azurewebsites.net/play";
        #endif
    }
}