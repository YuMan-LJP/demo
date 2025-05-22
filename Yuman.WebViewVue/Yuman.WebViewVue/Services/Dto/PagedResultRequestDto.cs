namespace Yuman.WebViewVue.Services.Dto
{
    public class PagedResultRequestDto
    {
        public virtual int SkipCount { get; set; }
        public virtual int MaxResultCount { get; set; } = 10;
    }
}
