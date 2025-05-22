using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yuman.WebViewVue.Services.Dto;

namespace Yuman.WebViewVue.Services.JobInfo.Dto
{
    public class GetMainTableInputDto : PagedResultRequestDto
    {
        public string Name { get; set; }
    }
}
