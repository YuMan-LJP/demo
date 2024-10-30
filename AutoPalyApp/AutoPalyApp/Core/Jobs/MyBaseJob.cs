using AutoPalyApp.Helper;
using Quartz;

namespace AutoPalyApp.Core.Jobs
{
    public abstract class MyBaseJob : IJob
    {
        /// <summary>
        /// CommandGroup：默认传入模拟器名称
        /// </summary>
        protected string Arg1 { get; set; } = "";

        /// <summary>
        /// CommandGroup：默认传入命令组文件名，即 GUID +.json
        /// </summary>
        protected string Arg2 { get; set; } = "";

        protected string Arg3 { get; set; } = "";

        protected string _jobKey { get; set; } = "";
        protected string _jobGroup { get; set; } = "";
        protected string _jobDescription { get; set; } = "";
        protected string _triggerName { get; set; } = "";
        protected string _triggerGroup { get; set; } = "";
        protected string _triggerDescription { get; set; } = "";

        public async Task Execute(IJobExecutionContext context)
        {
            _jobKey = context.JobDetail.Key.Name;
            _jobGroup = context.JobDetail.Key.Group;
            _jobDescription = context.JobDetail.Description;
            _triggerName = context.Trigger.Key.Name;
            _triggerGroup = context.Trigger.Key.Group;
            _triggerDescription = context.Trigger.Description;

            MyLogHelper.Info($"[{DateTime.Now}] 正在执行 【{_jobGroup}】{_jobKey}（{_jobDescription}） | 【{_triggerGroup}】{_triggerName}（{_triggerDescription}）| Arg1:{Arg1}|Arg2:{Arg2}|Arg3:{Arg3}");

            //执行任务前

            await DoWork();

            //执行任务后

            //实现前后端通讯
            //Form1.SendMessageToWebView(new Dto.WebViewMessageDto(jobKey, new { triggerName, Arg1, Arg2, Arg3 }));
        }

        protected abstract Task DoWork();
    }
}
