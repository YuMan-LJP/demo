using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using System.Diagnostics;

namespace AutoPalyApp.Core
{
    public class MyWorkProgramManager : IMyWorkProgramManager
    {
        private string? _fileName;

        private readonly IMyCommandGroupManager _myCommandGroupManager;

        public MyWorkProgramManager(IMyCommandGroupManager myCommandGroupManager)
        {
            _myCommandGroupManager = myCommandGroupManager;
        }

        public void RunCommand(string fileName)
        {
            var rootPath = _myCommandGroupManager.GetFileUrl();

            _fileName = fileName;

            var json = MyFileHelper.ReadJsonFile<CommandGroup>(_fileName, rootPath);
            if (json == null)
            {
                MyLogHelper.Log($"【{_fileName}】未找到命令");
                return;
            }

            MyLogHelper.Log($"【{_fileName}】命令开始");

            var commands = json.Commands.OrderBy(o => o.MyIndex).ToList();
            foreach (var command in commands)
            {
                _fileName = json.Name;
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} 开始执行");

                for (int i = 0; i < command.Count; i++)
                {
                    DoCommand(command, i);
                }

                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} 结束执行");
            }

            MyLogHelper.Log($"【{_fileName}】命令结束");
        }

        private void DoCommand(Command command, int index)
        {
            if (command.Operate == OperateEnum.WaitToClick)
            {
                WaitToClick(command, index);
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 点击 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Sleep)
            {
                Thread.Sleep(command.Interval);
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 休眠 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Break)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 开始循环 {index + 1}次");
                Stopwatch stopwatch = new Stopwatch();
                stopwatch.Start();
                while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0)
                {
                    var commands = command.Commands.OrderBy(o => o.MyIndex).ToList();
                    for (var itemIndex = 0; itemIndex < commands.Count; itemIndex++)
                    {
                        var childCommand = commands[itemIndex];
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

                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 结束循环 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Continue)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 开始循环 {index + 1}次");
                Stopwatch stopwatch = new Stopwatch();
                stopwatch.Start();
                while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0)
                {
                    var commands = command.Commands.OrderBy(o => o.MyIndex).ToList();
                    for (var itemIndex = 0; itemIndex < commands.Count; itemIndex++)
                    {
                        var childCommand = commands[itemIndex];
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
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 结束循环 {index + 1}次");
            }
            else
            {
                throw new Exception($"Operate 未定义实现");
            }
        }

        private Point? FindContentAndGetPoint(Command command, int index = 0)
        {
            Point? point;

            if (command.Type == CommandTypeEnum.Text)
            {
                //使用adb识别文字取得x，y
                point = MyAdbHelper.GetInstance().GetPointByTextAsync(command.Content, command.GetIndex).Result;
            }
            else if (command.Type == CommandTypeEnum.Image)
            {
                //使用opencv识别图片取得x，y
                point = MyAdbHelper.GetInstance().GetPointByImageAsync($"{Path.GetFileNameWithoutExtension(_fileName)}\\{command.Content}").Result;
            }
            else
            {
                throw new Exception($"Type 未定义实现");
            }

            if (point != null)
            {
                MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 取得坐标：{point?.X}|{point?.Y}");
                MyFileHelper.WriteMessageTxt("HonkaiStarRail_Records.txt", $"【ParentIndex:{command.ParentIndex}-Index:{command.MyIndex}】X:{point?.X}|Y:{point?.Y}");
            }

            return point;
        }

        private void WaitToClick(Command command, int index)
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
                    Form1.SendMessageToWebView(new Dto.WebViewMessageDto(MyConsts.CommandLog, new { _fileName, command.ParentIndex, command.MyIndex, message = $"{command.Content}未找到该内容" }));
                    throw new Exception($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} {command.Content}未找到该内容");
                }
                else
                {
                    return;
                }
            }

            //使用adb点击即可
            MyAdbHelper.GetInstance().InputTap((Point)point);
            MyLogHelper.Log($"【{_fileName}】-- {command.ParentIndex}-{command.MyIndex} -- 点击 成功 【{command.Content}】");
            Form1.SendMessageToWebView(new Dto.WebViewMessageDto(MyConsts.CommandLog, new { _fileName, command.ParentIndex, command.MyIndex, message = $"点击【{command.Content}】" }));
        }
    }
}
