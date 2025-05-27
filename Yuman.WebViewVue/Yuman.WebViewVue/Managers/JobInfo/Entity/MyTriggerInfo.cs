using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Yuman.WebViewVue.Helper;

namespace Yuman.WebViewVue.Managers.JobInfo.Entity
{
    [Table("Yuman_TriggerInfo")]
    public class MyTriggerInfo
    {
        /// <summary>
        /// 关联JobInfo的Id
        /// </summary>
        [MyRequired]
        public string JobInfoId { get; set; } = "";

        /// <summary>
        /// GUID
        /// </summary>
        [MyRequired(TranslationKey = "TriggerInfo.Id")]
        public string Id { get; set; } = "";

        /// <summary>
        /// 分组
        /// </summary>
        [MyRequired(TranslationKey = "TriggerInfo.Group")]
        public string Group { get; set; } = "";

        /// <summary>
        /// 名称
        /// </summary>
        [MyRequired(TranslationKey = "TriggerInfo.Name")]
        public string Name { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// 触发器类型
        /// </summary>
        public MyTriggerTypeEnum TriggerType { get; set; }

        /// <summary>
        /// Cron触发器时配置Cron表达式
        /// </summary>
        public string? Cron { get; set; }

        /// <summary>
        /// Sample触发器时配置间隔时间
        /// </summary>
        public string? Interval { get; set; }

        /// <summary>
        /// 间隔时间的单位
        /// </summary>
        public MyIntervalUnitEnum? IntervalUnit { get; set; }

        /// <summary>
        /// Sample触发器时配置执行次数
        /// 如果是-1，表示无限执行
        /// </summary>
        public int? RunCount { get; set; }
    }

    public enum MyTriggerTypeEnum
    {
        /// <summary>
        /// 简单触发器
        /// </summary>
        [Description("TriggerInfo.MyTriggerTypeEnum.Sample")]
        Sample = 0,

        /// <summary>
        /// Cron触发器
        /// </summary>
        [Description("TriggerInfo.MyTriggerTypeEnum.Cron")]
        Cron = 1,
    }

    public enum MyIntervalUnitEnum
    {
        /// <summary>
        /// 毫秒
        /// </summary>
        [Description("TriggerInfo.MyIntervalUnitEnum.Milliseconds")]
        Milliseconds = 0,

        /// <summary>
        /// 秒
        /// </summary>
        [Description("TriggerInfo.MyIntervalUnitEnum.Seconds")]
        Seconds = 1,

        /// <summary>
        /// 分钟
        /// </summary>
        [Description("TriggerInfo.MyIntervalUnitEnum.Minutes")]
        Minutes = 2,

        /// <summary>
        /// 小时
        /// </summary>
        [Description("TriggerInfo.MyIntervalUnitEnum.Hours")]
        Hours = 3,

        /// <summary>
        /// 天数
        /// </summary>
        [Description("TriggerInfo.MyIntervalUnitEnum.Days")]
        Days = 4
    }
}
