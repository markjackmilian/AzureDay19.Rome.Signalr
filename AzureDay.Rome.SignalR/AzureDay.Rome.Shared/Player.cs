using System;

#if !NETCOREAPP2_2
using Bridge;
#endif

namespace AzureDay.Rome.Shared
{
    #if !NETCOREAPP2_2
    [Convention(Notation.LowerCase)]
    #endif
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }
    }
}