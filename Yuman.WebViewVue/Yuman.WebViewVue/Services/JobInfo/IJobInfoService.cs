using Yuman.WebViewVue.Helper.BasicConfigure;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Services.Dto;
using Yuman.WebViewVue.Services.JobInfo.Dto;
using static Yuman.WebViewVue.Services.JobInfo.JobInfoService;

namespace Yuman.WebViewVue.Services.JobInfo
{
    public interface IJobInfoService : ITransientDependency, IWebViewApi
    {
        Task<bool> AddJobInfo(AddOrEditJobInfoInputDto inputDto);
        Task<bool> AddTriggerInfo(AddOrEditTriggerInfoInputDto inputDto);
        Task<bool> DeleteJobInfo(string id);
        Task<bool> DeleteTriggerInfo(string id);
        Task<bool> EditJobInfo(AddOrEditJobInfoInputDto inputDto);
        Task<bool> EditTriggerInfo(AddOrEditTriggerInfoInputDto inputDto);
        Task<List<Select2ItemDto>> GetIntervalUnitSelect();
        Task<PagedResultDto<MyJobInfo>> GetMianTable(GetMainTableInputDto inputDto);
        Task<List<MyTriggerInfo>> GetTriggerInfosByJobIdAsync(string jobInfoId);
        Task<List<Select2ItemDto>> GetTriggerTypeSelect();
    }
}
