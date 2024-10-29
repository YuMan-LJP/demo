using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient;
using AdvancedSharpAdbClient.Models;
using AdvancedSharpAdbClient.Receivers;
using OpenCvSharp;

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

        public async Task InputTapAsync(System.Drawing.Point point)
        {
            //adb shell input tap X Y
            //X Y分别为当前屏幕下的x和y轴坐标值
            await GetDeviceClientInstance().ClickAsync(point);
        }

        public void InputTap(System.Drawing.Point point)
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

        public async Task InputSwipeAsync(System.Drawing.Point first, System.Drawing.Point second)
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

        public async Task<System.Drawing.Point?> GetPointByTextAsync(string text, int index = 0)
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

        public async Task<System.Drawing.Point?> GetPointByImageAsync(string imageName, bool isShowMat = false)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\Temp";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            var tempImagePath = await ScreencapAsync();

            //识别目标图片在原图片中的位置
            Mat source = new Mat(tempImagePath, ImreadModes.AnyColor);
            Mat target = new Mat($"{rootPath}\\{imageName}", ImreadModes.AnyColor);
            //Cv2.Resize(target, target, new Size(55, 45));//分辨率不一样时，一定要转换到一样的比例在来比较，不然很难匹配到，图片大小比例影响很大

            Mat result = new Mat();
            Cv2.MatchTemplate(source, target, result, TemplateMatchModes.CCoeffNormed);
            OpenCvSharp.Point minLoc, maxLoc;
            double minValue, maxValue;
            Cv2.MinMaxLoc(result, out minValue, out maxValue, out minLoc, out maxLoc);//68*215  231*267

            if (isShowMat)
            {
                Mat mask = source.Clone();
                //画框显示
                Cv2.Rectangle(mask, maxLoc, new OpenCvSharp.Point(maxLoc.X + target.Cols, maxLoc.Y + target.Rows), Scalar.Green, 2);
                Cv2.ImShow("mask", mask);
                Cv2.WaitKey(0);
                Cv2.DestroyAllWindows();
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

            if (maxValue > 0.9)//匹配精确的至少要7以上
            {
                return new System.Drawing.Point(maxLoc.X, maxLoc.Y);
            }
            return null;
        }
    }
}
