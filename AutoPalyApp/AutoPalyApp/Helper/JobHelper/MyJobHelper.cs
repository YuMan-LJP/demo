using Quartz;
using Quartz.Impl;
using Quartz.Impl.Matchers;

namespace AutoPalyApp.Helper.JobHelper
{
    /// <summary>
    /// 封装一个可以随时动态配置的定时任务
    /// </summary>
    public static class MyJobHelper
    {
        private static IScheduler? _scheduler;
        private static readonly object _lock = new object();
        private static IScheduler GetSchedulerInstance()
        {
            if (_scheduler == null)
            {
                lock (_lock)
                {
                    if (_scheduler == null)
                    {
                        _scheduler = InitScheduler();
                    }
                }
            }
            return _scheduler;
        }

        private static IScheduler InitScheduler()
        {
            MyLogHelper.Debug($"[{DateTime.Now}] 类：{nameof(MyJobHelper)} Scheduler初始化");

            Task<IScheduler> task = StdSchedulerFactory.GetDefaultScheduler();
            IScheduler scheduler = task.Result;
            scheduler.Start();

            scheduler.ListenerManager.AddJobListener(new MyJobListener(), GroupMatcher<JobKey>.AnyGroup());
            scheduler.ListenerManager.AddTriggerListener(new MyTriggerListener(), GroupMatcher<TriggerKey>.AnyGroup());
            scheduler.ListenerManager.AddSchedulerListener(new MySchedulerListener());

            return scheduler;
        }

        public static void AddJobAndTrigger<T>(
            string jobKey,
            string jobGroup,
            string jobDescription,
            string triggerKey,
            string triggerGroup,
            string triggerDescription,
            string cron,
            string arg1 = "",
            string arg2 = "",
            string arg3 = "") where T : IJob
        {
            //创建作业和触发器
            var jobDetail = JobBuilder.Create<T>()
                .SetJobData(new JobDataMap {
                    new KeyValuePair<string, object>("Arg1", arg1),
                    new KeyValuePair<string, object>("Arg2", arg2),
                    new KeyValuePair<string, object>("Arg3", arg3),
                })
                .RequestRecovery(true)//请求恢复，指应用崩溃后再次启动，会重新执行该作业
                .WithIdentity(jobKey, jobGroup)//作业的唯一标识
                .WithDescription(jobDescription)//作业的描述信息
                .Build();
            var trigger = TriggerBuilder.Create()
                .WithIdentity(triggerKey, triggerGroup)
                .WithDescription(triggerDescription)
                //.WithSimpleSchedule(m => {
                //    m.WithRepeatCount(3).WithIntervalInSeconds(1);
                //})
                .WithCronSchedule(cron)
                .Build();

            //添加调度
            GetSchedulerInstance().ScheduleJob(jobDetail, trigger);
        }

        public static void TriggerNow(
            string jobKey,
            string jobGroup,
            string arg1 = "",
            string arg2 = "",
            string arg3 = "")
        {
            //立即触发执行
            GetSchedulerInstance().TriggerJob(
                new JobKey(jobKey, jobGroup),
                new JobDataMap {
                    new KeyValuePair<string, object>("Arg1", arg1),
                    new KeyValuePair<string, object>("Arg2", arg2),
                    new KeyValuePair<string, object>("Arg3", arg3),
                });
        }

        /// <summary>
        /// 开启一个临时job
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cron"></param>
        /// <param name="jobKey"></param>
        /// <param name="triggerKey"></param>
        /// <param name="arg1"></param>
        /// <param name="arg2"></param>
        /// <param name="arg3"></param>
        /// <param name="isTriggerNow"></param>
        public static void StartTempJob<T>(
            string cron,
            out string jobKey,
            out string triggerKey,
            string arg1 = "",
            string arg2 = "",
            string arg3 = "",
            bool isTriggerNow = false) where T : IJob
        {
            jobKey = Guid.NewGuid().ToString();
            triggerKey = Guid.NewGuid().ToString();
            var groupName = "TempGroup";

            Task<IScheduler> task = StdSchedulerFactory.GetDefaultScheduler();
            IScheduler scheduler = task.Result;
            IJobDetail job = JobBuilder.Create<T>()
                .SetJobData(new JobDataMap {
                    new KeyValuePair<string, object>("Arg1", arg1),
                    new KeyValuePair<string, object>("Arg2", arg2),
                    new KeyValuePair<string, object>("Arg3", arg3),
                })
                .WithIdentity(jobKey, groupName)
                .WithDescription("TempJob")
                .Build();
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity(triggerKey, groupName)
                .WithDescription("TempTrigger")
                .WithCronSchedule(cron)
                .Build() as ITrigger;
            scheduler.ScheduleJob(job, trigger);
            scheduler.Start();

            if (isTriggerNow)
            {
                scheduler.TriggerJob(new JobKey(jobKey, groupName));//立即触发执行
            }
        }
    }
}
