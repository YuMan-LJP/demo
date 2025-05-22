using System.ComponentModel.DataAnnotations.Schema;

namespace Yuman.WebViewVue.Managers.JobInfo.Entity
{
    [Table("Yuman_TriggerInfo")]
    public class MyTriggerInfo
    {
        /// <summary>
        /// 关联JobInfo的Id
        /// </summary>
        public string JobInfoId { get; set; } = "";

        /// <summary>
        /// GUID
        /// </summary>
        public string Id { get; set; } = "";

        /// <summary>
        /// 分组
        /// </summary>
        public string Group { get; set; } = "";

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; } = "";

        /// <summary>
        /// 是否的简单触发器
        /// </summary>
        public bool IsSimple { get; set; }

        /// <summary>
        /// 非简单触发器时配置Cron表达式
        /// </summary>
        public string Cron { get; set; } = "";

        /// <summary>
        /// 简单触发器时配置间隔时间
        /// </summary>
        public string Interval { get; set; } = "";

        /// <summary>
        /// 见到那触发器时配置执行次数
        /// 如果是-1，表示无限执行
        /// </summary>
        public int RunCount { get; set; }
    }
}
