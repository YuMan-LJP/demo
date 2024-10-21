using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using System.Diagnostics;

namespace AutoPalyApp.Core
{
    public static class WorkProgram
    {
        private static string? _name;
        private static bool _isRecord = false;

        public static void RunCommand(string name)
        {
            _name = name;

            var json = FileHelper.ReadJsonFile<JsonObject>(name);
            if (json == null)
            {
                LogHelper.Log($"【{_name}】未找到命令");
                return;
            }

            var fileName = Path.GetFileNameWithoutExtension(name);
            var ext = Path.GetExtension(name);
            var recordFileName = $"{fileName}.records{ext}";
            var recordJson = FileHelper.ReadJsonFile<JsonObject>(recordFileName);
            if (recordJson != null)
            {
                json = recordJson;
                _isRecord = true;
            }

            LogHelper.Log($"【{_name}】命令开始");

            foreach (var command in json.Commands)
            {
                _name = json.Name;
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} 开始执行");

                for (int i = 0; i < command.Count; i++)
                {
                    DoCommand(command, i);
                }

                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} 结束执行");
            }

            LogHelper.Log($"【{_name}】命令结束");

            if (!_isRecord)
            {
                try
                {
                    FileHelper.SaveJsonFile(recordFileName, json);
                }
                catch (Exception ex)
                {
                    LogHelper.Error(ex.Message, ex);
                }
            }
        }

        private static void DoCommand(Command command, int index)
        {
            if (command.Operate == OperateEnum.WaitToClick)
            {
                WaitToClick(command, index);
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 点击 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Sleep)
            {
                Thread.Sleep(command.Interval);
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 休眠 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Break)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 开始循环 {index + 1}次");
                Stopwatch stopwatch = new Stopwatch();
                stopwatch.Start();
                while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0)
                {
                    for (var itemIndex = 0; itemIndex < command.Commands.Count; itemIndex++)
                    {
                        var childCommand = command.Commands[itemIndex];
                        for (int i = 0; i < childCommand.Count; i++)
                        {
                            DoCommand(childCommand, i);
                        }
                    }

                    Thread.Sleep(1000 * command.Interval);//间隔时间

                    if (FindContentAndGetPoint(command) != null)//使用adb查询页面是否存在【内容】，出现就跳出
                    {
                        break;
                    }
                }

                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 结束循环 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Continue)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 开始循环 {index + 1}次");
                Stopwatch stopwatch = new Stopwatch();
                stopwatch.Start();
                while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0)
                {
                    for (var itemIndex = 0; itemIndex < command.Commands.Count; itemIndex++)
                    {
                        var childCommand = command.Commands[itemIndex];
                        for (int i = 0; i < childCommand.Count; i++)
                        {
                            DoCommand(childCommand, i);
                        }
                    }

                    Thread.Sleep(1000 * command.Interval);//间隔时间 

                    if (FindContentAndGetPoint(command) == null)//使用adb查询页面是否存在【内容】，没有就跳出
                    {
                        break;
                    }
                }
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 结束循环 {index + 1}次");
            }
            else
            {
                throw new Exception($"Operate 未定义实现");
            }
        }

        private static Point? FindContentAndGetPoint(Command command, int index = 0)
        {
            Point? point;

            if (_isRecord && command.Points != null)
            {
                point = command.Points.Skip(index).FirstOrDefault();
            }
            else
            {
                if (command.Type == CommandTypeEnum.Text)
                {
                    //使用adb识别文字取得x，y
                    point = AdbHelper.GetInstance().GetPointByTextAsync(command.Content, command.GetIndex).Result;
                }
                else if (command.Type ==  CommandTypeEnum.Image)
                {
                    //使用opencv识别图片取得x，y
                    point = AdbHelper.GetInstance().GetPointByImageAsync(command.Content).Result;
                }
                else
                {
                    throw new Exception($"Type 未定义实现");
                }
            }

            if (point != null)
            {
                LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 取得坐标：{point?.X}|{point?.Y}");
                FileHelper.WriteMessageTxt("HonkaiStarRail_Records.txt", $"【ParentIndex:{command.ParentIndex}-Index:{command.Index}】X:{point?.X}|Y:{point?.Y}");

                if (!_isRecord)
                {
                    if (command.Points == null)
                    {
                        command.Points = new List<Point>();
                    }
                    command.Points.Add((Point)point);
                }
            }

            return point;
        }

        private static void WaitToClick(Command command, int index)
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            Point? point = null;
            while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0 && point == null)
            {
                Thread.Sleep(1000 * command.Interval);//间隔时间
                point = FindContentAndGetPoint(command, index);//查询是否存在
            }

            if (point == null)
            {
                if (command.IsThrowExceptionIfNoFind)
                {
                    throw new Exception($"【{_name}】-- {command.ParentIndex}-{command.Index} {command.Content}未找到该内容");
                }
                else
                {
                    return;
                }
            }

            //使用adb点击即可
            AdbHelper.GetInstance().InputTap((Point)point);
            LogHelper.Log($"【{_name}】-- {command.ParentIndex}-{command.Index} -- 点击 成功 【{command.Content}】");
        }
    }
}
