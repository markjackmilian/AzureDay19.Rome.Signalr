using System;
using AzureDay.Rome.Web.Model;
using LiteDB;

namespace AzureDay.Rome.Web
{
    public interface ILiteDbWrapper
    {
        LiteDatabase Database { get; }
    }

    public class LiteDbWrapper : IDisposable, ILiteDbWrapper
    {
        public LiteDatabase Database { get; }

        public LiteDbWrapper()
        {
            this.Database = new LiteDatabase("filename=../LiteDb/game.db; mode=Exclusive");
        }

        public void EnsureDb()
        {
            var gameRepo = this.Database.GetCollection<Game>(typeof(Game).Name);
            if (gameRepo.Count() != 0)
                return;

            gameRepo.Insert(new Game());
        }

        public void Dispose()
        {
            this.Database?.Dispose();
        }
    }
}