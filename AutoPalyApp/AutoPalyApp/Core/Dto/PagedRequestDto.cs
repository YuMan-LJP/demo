namespace AutoPalyApp.Core.Dto
{
    public class PagedRequestDto
    {
        public virtual int PageSize { get; set; } = 10;
        public virtual int CurrentPage { get; set; }
    }
}
