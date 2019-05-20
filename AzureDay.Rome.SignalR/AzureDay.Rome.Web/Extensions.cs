using System.Collections.Concurrent;

namespace AzureDay.Rome.Web
{
    public static class Extensions
    {
        public static void Remove<T>(this ConcurrentBag<T> bag, T item)
        {
            while (bag.Count > 0)
            {
                T result;
                bag.TryTake(out result);

                if (result.Equals(item))
                {
                    break; 
                }

                bag.Add(result);
            }

        }
    }
}