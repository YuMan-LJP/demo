using Yuman.WebViewVue.Helper.BasicConfigure;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Services.Dto;
using Yuman.WebViewVue.Services.JobInfo.Dto;

namespace Yuman.WebViewVue.Services.JobInfo
{
    public interface IJobInfoService : ITransientDependency, IWebViewApi
    {
        Task<bool> AddJobInfo(AddOrEditJobInfoInputDto inputDto);
        Task<bool> DeleteJobInfo(string id);
        Task<bool> EditJobInfo(AddOrEditJobInfoInputDto inputDto);
        Task<PagedResultDto<MyJobInfo>> GetMianTable(GetMainTableInputDto inputDto);
    }
}
