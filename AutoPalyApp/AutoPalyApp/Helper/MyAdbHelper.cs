using AdvancedSharpAdbClient;
using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient.Models;
using AdvancedSharpAdbClient.Receivers;

namespace AutoPalyApp.Helper
{
    public sealed class MyAdbHelper
    {
        private static MyAdbHelper? _instance;
        private static readonly object _lock = new object();
        private MyAdbHelper() { }
        public static MyAdbHelper GetInstance()
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        InitAdbClient();
                        _instance = new MyAdbHelper();
                    }
                }
            }
            return _instance;
        }

        private static AdbClient? _adbClient;
        private static readonly object _lock2 = new object();
        private static DeviceClient? _deviceClient;
        private static readonly object _lock3 = new object();

        private static AdbClient GetAdbClientInstance()
        {
            if (_adbClient == null)
            {
                lock (_lock2)
                {
                    if (_adbClient == null)
                    {
                        _adbClient = InitAdbClient();
                    }
                }
            }
            return _adbClient;
        }

        private static DeviceClient GetDeviceClientInstance()
        {
            if (_deviceClient == null)
            {
                lock (_lock3)
                {
                    if (_deviceClient == null)
                    {
                        _deviceClient = InitDeviceClient(GetAdbClientInstance());
                    }
                }
            }
            return _deviceClient;
        }

        private static AdbClient InitAdbClient()
        {
            MyLogHelper.Debug($"[{DateTime.Now}] 类：{nameof(MyAdbHelper)} AdbClient初始化");

            if (!AdbServer.Instance.GetStatus().IsRunning)
            {
                var server = new AdbServer();
                StartServerResult result = server.StartServer($"{Environment.CurrentDirectory}\\Helper\\adb\\adb.exe", false);
                if (result == StartServerResult.Started)
                {
                    MyLogHelper.Log($"adb服务启动");
                    Console.WriteLine("adb服务启动");
                }
            }

            var adbClient = new AdbClient();
            adbClient.Connect("127.0.0.1:16384");
            return adbClient;
        }

        private static DeviceClient InitDeviceClient(AdbClient adbClient)
        {
            MyLogHelper.Debug($"[{DateTime.Now}] 类：{nameof(MyAdbHelper)} DeviceClient初始化");

            var device = adbClient.GetDevices().FirstOrDefault();
            return new DeviceClient(adbClient, device);
        }

        public async Task<string> GetCurrentRunningAppAsync()
        {
            var receiver = new ConsoleOutputReceiver
            {
                ParsesErrors = false
            };
            //pm list package  查看测试机所有包名
            //pm list package -3  查看第三方软件包名
            //dumpsys window | grep mCurrentFocus   查看前台显示的Activity界面
            await GetDeviceClientInstance().AdbClient.ExecuteShellCommandAsync(GetDeviceClientInstance().Device, "dumpsys window | grep mCurrentFocus", receiver).ConfigureAwait(continueOnCapturedContext: false);
            return receiver.ToString().Trim();//启动游戏中心输出的结果：mCurrentFocus=Window{59bb4a u0 com.mumu.store/com.mumu.store.MainActivity}
        }

        public async Task StartAppAsync(string appName)
        {
            //adb shell am start -n com.miHoYo.hkrpg/com.mihoyo.combosdk.ComboSDKActivity
            //deviceClient.StartApp(appName);//这个方法没效果

            var receiver = new ConsoleOutputReceiver
            {
                ParsesErrors = false
            };
            await GetDeviceClientInstance().AdbClient.ExecuteShellCommandAsync(GetDeviceClientInstance().Device, $"am start -n {appName}", receiver).ConfigureAwait(continueOnCapturedContext: false);
            Console.WriteLine(receiver.ToString().Trim());
        }

        public void StopApp(string appName)
        {
            //adb shell am force-stop 应用包名
            GetDeviceClientInstance().StopApp(appName);
        }

        public async Task<string> ScreencapAsync()
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\Temp";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            var receiver = new ConsoleOutputReceiver
            {
                ParsesErrors = false
            };
            //adb shell screencap -p /sdcard/图片名称.png
            //adb pull /sdcard/图片名称.png D:\Image
            var imageName = $"Adb_{DateTime.Now:yyyyMMddHHmmssffff}.png";
            await GetDeviceClientInstance().AdbClient.ExecuteShellCommandAsync(GetDeviceClientInstance().Device, $"screencap -p /sdcard/{imageName}", receiver).ConfigureAwait(continueOnCapturedContext: false);
            var result = receiver.ToString().Trim();

            var outputPath = $"{rootPath}\\{imageName}";
            var fileStream = new FileStream(outputPath, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            await GetAdbClientInstance().PullAsync(GetDeviceClientInstance().Device, $"/sdcard/{imageName}", fileStream);
            fileStream.Close();
            fileStream.Dispose();

            try
            {
                var receiver2 = new ConsoleOutputReceiver
                {
                    ParsesErrors = false
                };
                await GetDeviceClientInstance().AdbClient.ExecuteShellCommandAsync(GetDeviceClientInstance().Device, $"rm /sdcard/{imageName}", receiver2).ConfigureAwait(continueOnCapturedContext: false);
                var result2 = receiver2.ToString().Trim();
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }

            return outputPath;
        }

        public async Task<string> GetScreenResolutionAsync()
        {
            var receiver = new ConsoleOutputReceiver
            {
                ParsesErrors = false
            };
            //adb shell wm size
            await GetDeviceClientInstance().AdbClient.ExecuteShellCommandAsync(GetDeviceClientInstance().Device, "wm size", receiver).ConfigureAwait(continueOnCapturedContext: false);
            return receiver.ToString().Trim();//Physical size: 2160x3840
        }

        public async Task InputKeyAsync(string value)
        {
            //adb shell input keyevent 键值
            //如：adb shell input keyevent 3表示按下HOME键，其他键值对应键位可网上搜索
            await GetDeviceClientInstance().SendKeyEventAsync(value);
        }

        public async Task InputTextAsync(string value)
        {
            //adb shell input text 字符
            //如：adb shell input text test则表示输入了test字符串
            //ps：字符不支持中文
            await GetDeviceClientInstance().SendTextAsync(value);
        }

        public async Task InputTapAsync(int x, int y)
        {
            //adb shell input tap X Y
            //X Y分别为当前屏幕下的x和y轴坐标值
            await GetDeviceClientInstance().ClickAsync(x, y);
        }

        public async Task InputTapAsync(Point point)
        {
            //adb shell input tap X Y
            //X Y分别为当前屏幕下的x和y轴坐标值
            await GetDeviceClientInstance().ClickAsync(point);
        }

        public void InputTap(Point point)
        {
            //adb shell input tap X Y
            //X Y分别为当前屏幕下的x和y轴坐标值
            GetDeviceClientInstance().Click(point);
        }

        public async Task InputSwipeAsync(int x1, int y1, int x2, int y2)
        {
            //adb shell input swipe X1 Y1 X2 Y2
            //X1 Y1 和X2 Y2分别为滑动起始点的坐标
            await GetDeviceClientInstance().SwipeAsync(x1, y1, x2, y2, 1000 * 1);
        }

        public async Task InputSwipeAsync(Point first, Point second)
        {
            //adb shell input swipe X1 Y1 X2 Y2
            //X1 Y1 和X2 Y2分别为滑动起始点的坐标
            await GetDeviceClientInstance().SwipeAsync(first, second, 1000 * 1);
        }

        public async Task PullAsync(string path, FileStream fileStream)
        {
            //adb pull /data/test.apk C:\ 
            await GetAdbClientInstance().PullAsync(GetDeviceClientInstance().Device, path, fileStream);
        }

        public async Task<Point?> GetPointByTextAsync(string text, int index = 0)
        {
            var tempImagePath = await ScreencapAsync();

            var result = MyPaddleOCRHelper.GetInstance().GetOcrResultByPath(tempImagePath, text, index);
            if (result == null)
            {
                return null;
            }

            try
            {
                if (File.Exists(tempImagePath))
                {
                    File.Delete(tempImagePath);
                }
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }

            return result;
        }

        public async Task<Point?> GetPointByImagePathAsync(string imageName, bool isShowMat = false)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\Temp";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            var tempImagePath = await ScreencapAsync();
            var result = MyOpenCvHelper.GetPointByImagePath(tempImagePath, $"{rootPath}\\{imageName}", isShowMat);

            try
            {
                if (File.Exists(tempImagePath))
                {
                    File.Delete(tempImagePath);
                }
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }

            return result;
        }

        public async Task<Point?> GetPointByImageBase64Async(string imageBase64, bool isShowMat = false)
        {
            var tempImagePath = await ScreencapAsync();
            var result = MyOpenCvHelper.GetPointByImageBase64(tempImagePath, imageBase64, isShowMat);

            try
            {
                if (File.Exists(tempImagePath))
                {
                    File.Delete(tempImagePath);
                }
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }

            return result;
        }
    }
}
