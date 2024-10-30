namespace AutoPalyApp.Core.Jobs
{
    public class TempTestJob : MyBaseJob
    {
        protected override async Task DoWork()
        {
            //TODO...

            //实现前后端通讯
            Form1.SendMessageToWebView(new Dto.WebViewMessageDto(_jobKey, new { _triggerName, Arg1, Arg2, Arg3 }));

            await Task.CompletedTask;
        }
    }
}
