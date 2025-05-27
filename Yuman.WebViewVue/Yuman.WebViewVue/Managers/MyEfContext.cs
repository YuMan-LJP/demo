using Microsoft.EntityFrameworkCore;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Managers.SystemSetting.Entity;

namespace Yuman.WebViewVue.Managers
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

        public DbSet<MyJobInfo> MyJobInfos { get; set; }
        public DbSet<MyTriggerInfo> MyTriggerInfos { get; set; }
        public DbSet<MySystemSetting> MySystemSettings { get; set; }
    }
}
