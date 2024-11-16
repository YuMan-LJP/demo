using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core
{
    public interface IMyTaskSchedulerManager
    {
        Task<List<MyJobInfoDto>> GetJobListAsync(bool isIncludeItem = false);
        Task<List<MyTriggerInfo>> GetTriggerListAsync(string mainId);
        Task<bool> SaveMyJobInfoAsync(MyJobInfo inputDto);
        Task<bool> SaveMyTriggerInfoAsync(MyTriggerInfo inputDto);
        Task<bool> DeleteMyJobInfoAsync(string id);
        Task<bool> DeleteMyTriggerInfoAsync(string id);
        Task StartCommandAsync(string commandGroupId);
        Task<bool> StartCommandGroupJobAsync(string jobId, string triggerId);
        Task<bool> StartCommandGroupJobByTempAsync(string commandGroupId);
    }
}
