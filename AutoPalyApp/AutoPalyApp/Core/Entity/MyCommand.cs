using AutoPalyApp.Core.Dto;
using LiteDB;

namespace AutoPalyApp.Core.Entity
{
    public class MyCommand
    {
        /// <summary>
        /// 【命令组】ID
        /// </summary>
        public string GroupId { get; set; } = "";

        /// <summary>
        /// 系统使用的GUID
        /// </summary>
        [BsonId]
        public string Id { get; set; } = "";

        /// <summary>
        /// 【序号】命令必须按序号从小到大依次执行
        /// </summary>
        public int MyIndex { get; set; }

        /// <summary>
        /// 【命名】用户自定义
        /// </summary>
        public string Label { get; set; } = "";

        /// <summary>
        /// 【类型】图片地址的方式或文字识别的方式
        /// </summary>
        public CommandTypeEnum Type { get; set; } = CommandTypeEnum.Text;

        /// <summary>
        /// 【时间间隔】单位秒，如果含有子命令就是循环的间隔，如果没有子命令就是每次识别的间隔
        /// </summary>
        public int Interval { get; set; } = 3;//调用adb获取截图之类的，后续测试看看耗时情况如何，进一步调整优化这个时间

        /// <summary>
        /// 【超时时间】单位秒，如果这个命令到超时了直接结束并提示
        /// </summary>
        public int Timeout { get; set; } = 10;//调用adb获取截图之类的，后续测试看看耗时情况如何，进一步调整优化这个时间

        /// <summary>
        /// 【操作指令】
        /// </summary>
        public OperateEnum Operate { get; set; } = OperateEnum.WaitToClick;

        /// <summary>
        /// 【内容】图片相对地址、需要识别的文字内容、休眠等待的时间
        /// 存储到sqlite时直接存base64数据
        /// </summary>
        public string Content { get; set; } = "";

        /// <summary>
        /// 【执行次数】至少1次，至多不限，该条命令执行指定次数
        /// </summary>
        public int Count { get; set; } = 1;

        /// <summary>
        /// 【是否抛出异常如果找不到内容时】不抛异常表示当前命令内容找不到就超时后就跳过了，不会中途结束
        /// </summary>
        public bool IsThrowExceptionIfNoFind { get; set; } = true;

        /// <summary>
        /// 【取值序号】文字识别，如果存在多个时，标记取哪个，顺序从左上到右下
        /// </summary>
        public int GetIndex { get; set; } = 0;

        /// <summary>
        /// 【备注】
        /// </summary>
        public string Remark { get; set; } = "";

        /// <summary>
        /// 嵌套子集
        /// </summary>
        public List<MyCommand>? Children { get; set; }
    }
}
