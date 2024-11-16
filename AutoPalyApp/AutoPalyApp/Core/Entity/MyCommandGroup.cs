using AutoPalyApp.Core.Dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPalyApp.Core.Entity
{
    [Table("CommandGroup_Main")]
    public class MyCommandGroup
    {
        /// <summary>
        /// 【唯一Id】可以用GUID，对应定时任务
        /// </summary>
        public string Id { get; set; } = "";

        /// <summary>
        /// 【命名】用户自定义
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// 【应用程序名称】如果模拟器没有正在运行该程序，会自动启动并激活窗口
        /// </summary>
        public string AppName { get; set; } = "";

        /// <summary>
        /// 【备注】
        /// </summary>
        public string Remark { get; set; } = "";
    }
}
