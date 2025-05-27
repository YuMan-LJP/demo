using Yuman.WebViewVue.Helper.BasicConfigure;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Services.Dto;
using Yuman.WebViewVue.Services.JobInfo.Dto;

namespace Yuman.WebViewVue.Services.JobInfo
{
    public interface IJobInfoService : ITransientDependency, IWebViewApi
    {
        Task<bool> AddJobInfoAsync(AddOrEditJobInfoInputDto inputDto);
        Task<bool> AddTriggerInfoAsync(AddOrEditTriggerInfoInputDto inputDto);
        Task<bool> DeleteJobInfoAsync(string id);
        Task<bool> DeleteTriggerInfoAsync(string id);
        Task<bool> EditJobInfoAsync(AddOrEditJobInfoInputDto inputDto);
        Task<bool> EditTriggerInfoAsync(AddOrEditTriggerInfoInputDto inputDto);
        Task<List<Select2ItemDto>> GetIntervalUnitSelectAsync();
        Task<PagedResultDto<MyJobInfo>> GetMianTableAsync(GetMainTableInputDto inputDto);
        Task<List<MyTriggerInfo>> GetTriggerInfosByJobIdAsync(string jobInfoId);
        Task<List<Select2ItemDto>> GetTriggerTypeSelectAsync();
    }
}
