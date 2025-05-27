using Yuman.WebViewVue.Managers.JobInfo;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Services.Dto;
using Yuman.WebViewVue.Services.JobInfo.Dto;

namespace Yuman.WebViewVue.Services.JobInfo
{
    public class JobInfoService : MyBaseService, IJobInfoService
    {
        private readonly IJobInfoManager _jobInfoManager;

        public JobInfoService(IJobInfoManager jobInfoManager)
        {
            _jobInfoManager = jobInfoManager;
        }

        public async Task<PagedResultDto<MyJobInfo>> GetMianTable(GetMainTableInputDto inputDto)
        {
            var output = new PagedResultDto<MyJobInfo>();
            output.Items = await _jobInfoManager.GetJobInfosAsync(inputDto.Name, inputDto.SkipCount, inputDto.MaxResultCount);
            output.TotalCount = await _jobInfoManager.GetJobInfosCountAsync(inputDto.Name);
            return output;
        }

        public async Task<bool> AddJobInfo(AddOrEditJobInfoInputDto inputDto)
        {
            return await _jobInfoManager.SaveJobInfoAsync(inputDto);
        }

        public async Task<bool> EditJobInfo(AddOrEditJobInfoInputDto inputDto)
        {
            return await _jobInfoManager.SaveJobInfoAsync(inputDto);
        }

        public async Task<bool> DeleteJobInfo(string id)
        {
            return await _jobInfoManager.DeleteJobInfoAsync(id);
        }

        public async Task<List<MyTriggerInfo>> GetTriggerInfosByJobIdAsync(string jobInfoId)
        {
            return await _jobInfoManager.GetTriggerInfosByJobIdAsync(jobInfoId);
        }

        public async Task<bool> AddTriggerInfo(AddOrEditTriggerInfoInputDto inputDto)
        {
            return await _jobInfoManager.SaveTriggerInfoAsync(inputDto);
        }

        public async Task<bool> EditTriggerInfo(AddOrEditTriggerInfoInputDto inputDto)
        {
            return await _jobInfoManager.SaveTriggerInfoAsync(inputDto);
        }

        public async Task<bool> DeleteTriggerInfo(string id)
        {
            return await _jobInfoManager.DeleteTriggerInfoAsync(id);
        }

        public async Task<List<Select2ItemDto>> GetTriggerTypeSelect()
        {
            return await _jobInfoManager.GetTriggerTypeSelect();
        }

        public async Task<List<Select2ItemDto>> GetIntervalUnitSelect()
        {
            return await _jobInfoManager.GetIntervalUnitSelect();
        }
    }
}
