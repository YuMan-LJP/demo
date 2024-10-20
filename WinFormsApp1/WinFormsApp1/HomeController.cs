using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient.Models;
using AdvancedSharpAdbClient;
using Microsoft.AspNetCore.Mvc;
using AdvancedSharpAdbClient.Receivers;
using PaddleOCRJson;
using Newtonsoft.Json;
using WinFormsApp1.Helper.Dto;

namespace WinFormsApp1
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        public async Task<bool> ShowMessageBoxAsync(string msg)
        {
            var result = MessageBox.Show(msg, "标题", MessageBoxButtons.OKCancel, MessageBoxIcon.Information, MessageBoxDefaultButton.Button1, MessageBoxOptions.ServiceNotification);
            if (result == DialogResult.OK)
            {
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<string> GetCurrentRunningAppAsync()
        {
            //初始化Adb服务
            if (!AdbServer.Instance.GetStatus().IsRunning)
            {
                AdbServer server = new AdbServer();
                StartServerResult result = server.StartServer($"{Environment.CurrentDirectory}\\Helper\\adb\\adb.exe", false);//注意这里会读取adb的SDK
                if (result == StartServerResult.Started)
                {
                    Console.WriteLine("adb服务启动");
                }
            }

            //初始化连接模拟器
            var adbClient = new AdbClient();
            adbClient.Connect("127.0.0.1:16384");//MuMu模拟器12的链接端口
            var device = adbClient.GetDevices().FirstOrDefault();
            var deviceClient = new DeviceClient(adbClient, device);

            //AdbClient和DeviceClient提供了很多方法，这里测试访问模拟器读取当前正在运行的app名称
            //如果本身类库没有提供我们需要的方法，可以使用ExecuteShellCommand方法来直接执行adb本身的命令
            ConsoleOutputReceiver receiver = new ConsoleOutputReceiver
            {
                ParsesErrors = false
            };
            await deviceClient.AdbClient.ExecuteShellCommandAsync(deviceClient.Device, "dumpsys window | grep mCurrentFocus", receiver).ConfigureAwait(continueOnCapturedContext: false);
            return receiver.ToString().Trim();
        }

        public async Task<int[][]> SearchTextByOcrAsync(string text)
        {
            //读取执行文件，启动ocr引擎
            var _enginePath = $"{Environment.CurrentDirectory}\\Helper\\PaddleOCR-json_v1.4.1\\PaddleOCR-json.exe";
            var startupArgs = OcrEngineStartupArgs.WithPipeMode(_enginePath);
            var engine = new OcrEngine(startupArgs);
            var ocrClient = engine.CreateClient();

            //需要识别的测试图片
            var imagePath = $"{Environment.CurrentDirectory}\\wwwroot\\image\\img_mumu_test.png";
            var result = ocrClient.FromImageFile(imagePath);
            var ocr = JsonConvert.DeserializeObject<OcrResult>(result);
            if (ocr == null)
            {
                return null;
            }
            if (ocr.OcrData == null)
            {
                return null;
            }
            if (ocr.OcrData.Length == 0)
            {
                return null;
            }
            var matchData = ocr.OcrData.Where(w => w.Text == text).FirstOrDefault();
            if (matchData == null)
            {
                return null;
            }
            return await Task.FromResult(matchData.Box);
        }
    }
}
