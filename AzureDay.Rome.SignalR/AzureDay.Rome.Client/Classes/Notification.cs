using Bridge;

namespace AzureDay.Rome.Client.Classes
{
    [External]
    public class Notification
    {
        [Template("$.toast({ heading: 'Info', hideafter: 3500, icon: 'info', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: {text} })")]
        public static void Info(string text)
        {
            return;
        }
        
        [Template("$.toast({ heading: 'Info', hideafter: 3500, icon: 'warning', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: {text} })")]
        public static void Warning(string text)
        {
            return;
        }
        
        [Template("$.toast({ heading: 'Info', hideafter: 3500, icon: 'error', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: {text} })")]
        public static void Error(string text)
        {
            return;
        }
        
        [Template("$.toast({ heading: 'Info', hideafter: 3500, icon: 'success', loaderbg: '#ff6849', position: 'top-right', stack: 6, text: {text} })")]
        public static void Success(string text)
        {
            return;
        }
    }
}