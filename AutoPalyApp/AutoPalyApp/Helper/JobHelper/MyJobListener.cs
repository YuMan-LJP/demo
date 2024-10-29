using Quartz;

namespace AutoPalyApp.Helper.JobHelper
{
    public class MyJobListener : IJobListener
    {
        public string Name { get; } = nameof(MyJobListener);

        public Task JobToBeExecuted(IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            return Task.Factory.StartNew(() =>
            {
                MyLogHelper.Debug($"[{DateTime.Now}] Job: {context.JobDetail.Key} 即将执行 由Trigger: {context.Trigger.Key}触发");
            });
        }

        public Task JobExecutionVetoed(IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            return Task.Factory.StartNew(() =>
            {
                MyLogHelper.Debug($"[{DateTime.Now}] Job: {context.JobDetail.Key} 被否决执行 由Trigger: {context.Trigger.Key}触发");
            });
        }

        public Task JobWasExecuted(IJobExecutionContext context, JobExecutionException? jobException, CancellationToken cancellationToken = default)
        {
            return Task.Factory.StartNew(() =>
            {
                MyLogHelper.Debug($"[{DateTime.Now}] Job: {context.JobDetail.Key} 执行完成 由Trigger: {context.Trigger.Key}触发");
            });
        }
    }
}
