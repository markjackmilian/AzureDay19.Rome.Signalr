using System;
using System.Collections.Generic;
using Bridge;

namespace AzureDay.Rome.Remote.Models
{
    [Convention(Notation.LowerCase)]
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

    }
}