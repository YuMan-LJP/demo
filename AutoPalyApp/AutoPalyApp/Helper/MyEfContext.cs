using AutoPalyApp.Core.Entity;
using Microsoft.EntityFrameworkCore;

namespace AutoPalyApp.Helper
{
    public class MyEfContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
#if DEBUG
            optionsBuilder.UseSqlite($"Data Source={Environment.CurrentDirectory}\\MyDatabase.db");
#else
            optionsBuilder.UseSqlite($"Data Source={AppDomain.CurrentDomain.BaseDirectory}\\MyDatabase.db");
#endif
        }

        public DbSet<MyCommandGroup> MyCommandGroups { get; set; }
        public DbSet<MyJobInfo> MyJobInfos { get; set; }
        public DbSet<MyTriggerInfo> MyTriggerInfos { get; set; }
    }
}
