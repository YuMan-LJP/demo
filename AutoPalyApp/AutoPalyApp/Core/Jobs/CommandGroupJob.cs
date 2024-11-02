using AutoPalyApp.Helper;
using NetAutoGUI;

namespace AutoPalyApp.Core.Jobs
{
    public class CommandGroupJob : MyBaseJob
    {
        private readonly IMyWorkProgramManager _myWorkProgramManager;

        public CommandGroupJob(IMyWorkProgramManager myWorkProgramManager)
        {
            _myWorkProgramManager = myWorkProgramManager;
        }

        protected override async Task DoWork()
        {
            await Task.Factory.StartNew(() =>
            {
                try
                {
                    //后续试验其他模拟器适配情况，改成动态传入模拟器，现在是写死用MuMu模拟器12
                    //https://www.cnblogs.com/sunhouzi/p/17954576
                    var (exepath, exename) = GetPlayerInfo(Arg1);//MuMu模拟器12
                    if (!GUI.Application.IsApplicationRunning(exename))
                    {
                        GUI.Application.LaunchApplication(exepath);
                    }
                    var window = GUI.Application.WaitForWindowByTitle(Arg1, 60 * 10);

                    window.Activate();

                    //一定要固定窗体大小，最大化或固定大小都可以，因为截图大小与窗体的图片大小不一样也识别不了
                    window.Maximize();

                    Form1.SendMessageToWebView(new Dto.WebViewMessageDto(MyConsts.CommandLog, new { _jobKey, _triggerName, Arg1, Arg2, Arg3, message = "开始执行" }));

                    _myWorkProgramManager.RunCommand(Arg2);

                    Form1.SendMessageToWebView(new Dto.WebViewMessageDto(MyConsts.CommandLog, new { _jobKey, _triggerName, Arg1, Arg2, Arg3, message = "完成" }));
                }
                catch (Exception ex)
                {
                    MyLogHelper.Error(ex);
                    Form1.SendMessageToWebView(new Dto.WebViewMessageDto(MyConsts.CommandLog, new { _jobKey, _triggerName, Arg1, Arg2, Arg3, message = $"执行发生异常：{ex.Message}" }));
                }
            });
        }

        private (string exepath, string exename) GetPlayerInfo(string name)
        {
            if (name == "MuMu模拟器12")
            {
                return (@"C:\Program Files\Netease\MuMuPlayer-12.0\shell\MuMuPlayer.exe", "MuMuPlayer.exe");
            }
            throw new Exception($"目前不支持{name}");
        }
    }
}
