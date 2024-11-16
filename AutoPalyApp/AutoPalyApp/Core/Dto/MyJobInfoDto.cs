using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core.Dto
{
    public class MyJobInfoDto : MyJobInfo
    {
        public List<MyTriggerInfo> Triggers { get; set; } = new List<MyTriggerInfo>();
    }
}
