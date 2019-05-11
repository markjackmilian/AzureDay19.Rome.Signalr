using System;
using Bridge;

namespace AzureDay.Rome.Remote.Models
{
    [Convention(Notation.LowerCase)]
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }
    }
}