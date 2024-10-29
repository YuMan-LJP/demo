namespace AutoPalyApp.Core.Dto
{
    public class MyJobInfo
    {
        public string Id { get; set; } = "";

        public string Key { get; set; } = "";

        public string Group { get; set; } = "";

        public string Description { get; set; } = "";

        public List<MyTriggerInfo> Triggers { get; set; }
    }
}
