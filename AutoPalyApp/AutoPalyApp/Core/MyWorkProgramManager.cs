using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using Newtonsoft.Json;
using System.Diagnostics;

namespace AutoPalyApp.Core
{
    public class MyWorkProgramManager : MyManagerBase, IMyWorkProgramManager
    {
        private readonly IMyCommandGroupManager _myCommandGroupManager;

        public MyWorkProgramManager(IMyCommandGroupManager myCommandGroupManager)
        {
            _myCommandGroupManager = myCommandGroupManager;
        }

        public async Task RunCommandAsync(string commandGroupId)
        {
            var group = await _myCommandGroupManager.GetCommandGroupByIdAsync(commandGroupId, true);
            if (group == null)
            {
                MyLogHelper.Log($"【{commandGroupId}】未找到命令");
                return;
            }

            var resolution = await MyAdbHelper.GetInstance().GetScreenResolutionAsync();

            MyLogHelper.Log($"【{group.Id}】命令开始");

            var commands = group.Commands.OrderBy(o => o.MyIndex).ToList();
            foreach (var command in commands)
            {
                MyLogHelper.Log($"【{group.Id}】-- {command.MyIndex} 开始执行");

                for (int i = 0; i < command.Count; i++)
                {
                    DoCommand(command, i, group.Id);
                }

                MyLogHelper.Log($"【{group.Id}】-- {command.MyIndex} 结束执行");
            }

            MyLogHelper.Log($"【{group.Id}】命令结束");
        }

        private void DoCommand(MyCommandDto command, int index, string groupId)
        {
            if (command.Operate == OperateEnum.WaitToClick)
            {
                WaitToClick(command, index, groupId);
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 点击 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Sleep)
            {
                Thread.Sleep(command.Interval);
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 休眠 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Break && command.Commands != null)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 开始循环 {index + 1}次");
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
                            DoCommand(childCommand, i, groupId);
                        }
                    }

                    Thread.Sleep(1000 * command.Interval);//间隔时间

                    if (FindContentAndGetPoint(command, groupId) != null)//使用adb查询页面是否存在【内容】，出现就跳出
                    {
                        break;
                    }
                }

                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 结束循环 {index + 1}次");
            }
            else if (command.Operate == OperateEnum.Loop_Continue && command.Commands != null)
            {
                command.IsThrowExceptionIfNoFind = false;//循环的这种空不会报错，不然循环就无法判断条件了
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 开始循环 {index + 1}次");
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
                            DoCommand(childCommand, i, groupId);
                        }
                    }

                    Thread.Sleep(1000 * command.Interval);//间隔时间 

                    if (FindContentAndGetPoint(command, groupId) == null)//使用adb查询页面是否存在【内容】，没有就跳出
                    {
                        break;
                    }
                }
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 结束循环 {index + 1}次");
            }
            else
            {
                throw new Exception($"Operate 未定义实现；或者当Operate是Loop_Break或Loop_Continue时，Commands子集合是null");
            }
        }

        private Point? FindContentAndGetPoint(MyCommandDto command, string groupId, int index = 0)
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
                //point = MyAdbHelper.GetInstance().GetPointByImagePathAsync($"{Path.GetFileNameWithoutExtension(groupId)}\\{command.Content}").Result;
                point = MyAdbHelper.GetInstance().GetPointByImageBase64Async(command.Content).Result;
            }
            else
            {
                throw new Exception($"Type 未定义实现");
            }

            if (point != null)
            {
                MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 取得坐标：{point?.X}|{point?.Y}");
            }

            return point;
        }

        private void WaitToClick(MyCommandDto command, int index, string groupId)
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            Point? point = null;
            while ((double)stopwatch.ElapsedMilliseconds < command.Timeout * 1000.0 && point == null)
            {
                Thread.Sleep(1000 * command.Interval);//间隔时间
                point = FindContentAndGetPoint(command, groupId, index);//查询是否存在
            }

            if (point == null)
            {
                if (command.IsThrowExceptionIfNoFind)
                {
                    Form1.SendMessageToWebView(new WebViewMessageDto(MyConsts.CommandLog, new { groupId, command.Id, command.MyIndex, message = $"{command.Content}未找到该内容" }));
                    throw new Exception($"【{groupId}】-- {command.MyIndex} {command.Content}未找到该内容");
                }
                else
                {
                    return;
                }
            }

            //使用adb点击即可
            MyAdbHelper.GetInstance().InputTap((Point)point);
            MyLogHelper.Log($"【{groupId}】-- {command.MyIndex} -- 点击 成功 【{command.Content}】");
            Form1.SendMessageToWebView(new WebViewMessageDto(MyConsts.CommandLog, new { groupId, command.Id, command.MyIndex, message = $"点击【{command.Content}】" }));
        }
    }
}
