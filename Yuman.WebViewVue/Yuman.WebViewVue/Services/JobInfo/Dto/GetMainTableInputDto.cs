using Yuman.WebViewVue.Services.Dto;

namespace Yuman.WebViewVue.Services.JobInfo.Dto
{
    public class GetMainTableInputDto : PagedResultRequestDto
    {
        public string Group { get; set; }
        public string Name { get; set; }
    }
}
