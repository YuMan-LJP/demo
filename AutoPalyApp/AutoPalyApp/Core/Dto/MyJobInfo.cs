using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPalyApp.Core.Dto
{
    [Table("TaskScheduler_Job")]
    public class MyJobInfo
    {
        public string Id { get; set; } = "";

        public string Key { get; set; } = "";

        public string Group { get; set; } = "";

        public string Description { get; set; } = "";

        public List<MyTriggerInfo> Triggers { get; set; }
    }
}
