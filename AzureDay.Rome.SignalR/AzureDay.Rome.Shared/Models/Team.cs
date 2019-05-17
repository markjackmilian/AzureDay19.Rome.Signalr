using System;
using System.Collections.Generic;
#if !NETCOREAPP2_2
using Bridge;
#endif

namespace AzureDay.Rome.Shared
{
    #if !NETCOREAPP2_2
    [Convention(Notation.LowerCase)]
    #endif
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public IEnumerable<Player> Players { get; set; }

    }
}