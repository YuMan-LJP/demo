using AutoPalyApp.Helper;
using AutoPalyApp.Helper.JobHelper;

namespace AutoPalyApp.Core
{
    public static class MyTaskSchedulerManager
    {
        public static void TaskStart()
        {
            string job;
            string trigger;
            MyJobHelper.TempStartJob<TempTestJob>("0/10 * * * * ?", out job, out trigger);
            MyLogHelper.Info($"临时测试：job：{job}|trigger：{trigger}");

            MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key", "job组别", "job描述", "触发器唯一Key", "触发器组别", "触发器描述", "0/2 * * * * ?", "test111", "test222");
            MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key_2", "job组别", "job描述_2", "触发器唯一Key_2", "触发器组别", "触发器描述_2", "0/2 * * * * ?", "test333", "test444");
        }
    }
}
