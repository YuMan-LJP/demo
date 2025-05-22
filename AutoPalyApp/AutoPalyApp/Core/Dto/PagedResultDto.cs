namespace AutoPalyApp.Core.Dto
{
    public class PagedResultDto<T>(int totalCount, List<T> items)
    {
        public int TotalCount { get; set; } = totalCount;

        public List<T>? Items { get; set; } = items;
    }
}
