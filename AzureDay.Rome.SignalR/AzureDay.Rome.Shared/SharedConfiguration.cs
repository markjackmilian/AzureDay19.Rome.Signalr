namespace AzureDay.Rome.Remote
{
    public static class SharedConfiguration
    {
        #if DEBUG
        public static int FinishLine = 20;
        public static int MaxPlayers = 3;
        #else
        public static int FinishLine = 1000;
        public static int MaxPlayers = 60;
        #endif

    }
}