using Quartz.Impl;
using Quartz;

namespace AutoPalyApp.Helper
{
    /// <summary>
    /// 封装一个可以随时动态配置的定时任务
    /// </summary>
    public static class JobHelper
    {
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cron">0 0 19 * * ?   设定时间，每天晚上7点</param>
        public static void StartJob<T>(string cron) where T : IJob
        {
            Task<IScheduler> task = StdSchedulerFactory.GetDefaultScheduler();
            IScheduler scheduler = task.Result;
            IJobDetail job = JobBuilder.Create<T>().WithIdentity(nameof(T)).Build();
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity($"{nameof(T)}Trigger")
                .WithCronSchedule(cron)
                .Build() as ITrigger;
            scheduler.ScheduleJob(job, trigger);
            scheduler.Start();

            //scheduler.TriggerJob(new JobKey("GameJob"));//立即触发执行
        }
    }
}
