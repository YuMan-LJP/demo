namespace Yuman.WebViewVue.Services.Dto
{
    [Serializable]
    public class PagedResultDto<T>
    {
        public int TotalCount { get; set; }

        public List<T>? Items { get; set; }
    }
}
