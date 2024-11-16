namespace AutoPalyApp.Core.Dto
{
    public class CommandRecordDto
    {
        public string ParentId { get; set; } = "";
        public string Id { get; set; } = "";
        public int? ParentIndex { get; set; }
        public int MyIndex { get; set; }
        public string Name { get; set; } = "";
        public int Interval { get; set; }
        public int Timeout { get; set; }
        public OperateEnum Operate { get; set; }
        public int Count { get; set; }
        public bool IsThrowExceptionIfNoFind { get; set; }
        public int GetIndex { get; set; }
        public string Remark { get; set; } = "";
        public int X { get; set; }
        public int Y { get; set; }
    }
}
