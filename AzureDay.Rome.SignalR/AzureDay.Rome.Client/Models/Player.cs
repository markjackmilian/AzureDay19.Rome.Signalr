using System;

namespace AzureDay.Rome.Client.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }
    }
}