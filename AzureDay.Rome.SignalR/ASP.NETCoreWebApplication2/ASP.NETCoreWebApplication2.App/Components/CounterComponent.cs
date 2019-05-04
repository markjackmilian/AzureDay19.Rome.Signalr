using System;
using Microsoft.AspNetCore.Blazor.Components;

namespace ASP.NETCoreWebApplication2.App.Components
{
    public class CounterComponent : BlazorComponent
    {
        public int Counter { get; set; }

        public void Increment()
        {
            Console.WriteLine("Prova!");
            this.Counter++;
        }
    }
}