using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core.Dto
{
    public class MyCommandGroupDto : MyCommandGroup
    {
        /// <summary>
        /// 【命令脚本】
        /// </summary>
        public List<MyCommandDto> Commands { get; set; } = new List<MyCommandDto>();
    }
}
