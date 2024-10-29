using AutoPalyApp.Helper;
using Quartz;

namespace AutoPalyApp.Core
{
    public class TempTestJob : IJob
    {
        public string Arg1 { get; set; } = "";
        public string Arg2 { get; set; } = "";
        public string Arg3 { get; set; } = "";

        public async Task Execute(IJobExecutionContext context)
        {
            var jobKey = context.JobDetail.Key.Name;
            var jobGroup = context.JobDetail.Key.Group;
            var jobDescription = context.JobDetail.Description;
            var triggerName = context.Trigger.Key.Name;
            var triggerGroup = context.Trigger.Key.Group;
            var triggerDescription = context.Trigger.Description;

            MyLogHelper.Info($"[{DateTime.Now}] 正在执行 【{jobGroup}】{jobKey}（{jobDescription}） | 【{triggerGroup}】{triggerName}（{triggerDescription}）| Arg1:{Arg1}|Arg2:{Arg2}|Arg3:{Arg3}");

            //启动模拟器

            //启动App

            //运行命令


            await Task.CompletedTask;
        }
    }
}
