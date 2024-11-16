using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core.Dto
{
    public class MyCommandDto : MyCommand
    {
        /// <summary>
        /// 嵌套子集
        /// 【命令脚本】可能这一个命令下面包含多个子命令，需要按【特殊指令】进行循环执行
        /// </summary>
        public List<MyCommandDto>? Commands { get; set; } = new List<MyCommandDto>();
    }
}
