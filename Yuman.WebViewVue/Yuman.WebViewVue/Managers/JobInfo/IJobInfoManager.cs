using Yuman.WebViewVue.Helper;
using Yuman.WebViewVue.Managers.JobInfo.Entity;

namespace Yuman.WebViewVue.Managers.JobInfo
{
    public interface IJobInfoManager : ITransientDependency
    {
        Task<bool> DeleteJobInfoAsync(string id);
        Task<bool> DeleteTriggerInfoAsync(string id);
        Task<MyJobInfo?> GetJobInfoByIdAsync(string id);
        Task<List<MyJobInfo>> GetJobInfosAsync(string name, int skipCount, int maxResultCount);
        Task<int> GetJobInfosCountAsync(string name);
        Task<MyTriggerInfo?> GetTriggerInfoByIdAsync(string id);
        Task<List<MyTriggerInfo>> GetTriggerInfosByJobIdAsync(string jobInfoId);
        Task<bool> SaveJobInfoAsync(MyJobInfo jobInfo);
        Task<bool> SaveTriggerInfoAsync(MyTriggerInfo triggerInfo);
    }
}
