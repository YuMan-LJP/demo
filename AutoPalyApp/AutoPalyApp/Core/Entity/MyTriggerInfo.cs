using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPalyApp.Core.Entity
{
    [Table("TaskScheduler_Trigger")]
    public class MyTriggerInfo
    {
        public string JobId { get; set; } = "";

        public string Id { get; set; } = "";

        public string Key { get; set; } = "";

        public string Group { get; set; } = "";

        public string Description { get; set; } = "";

        public string Cron { get; set; } = "";

        public string CommandGroupId { get; set; } = "";
    }
}
