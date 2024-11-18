using AutoPalyApp.Core;
using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;
using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TaskSchedulerController : MyControllerBase
    {
        private readonly Lazy<IMyTaskSchedulerManager> _myTaskSchedulerManager;
        private readonly Lazy<IMyCommandGroupManager> _myCommandGroupManager;

        public TaskSchedulerController(Lazy<IMyTaskSchedulerManager> myTaskSchedulerManager, Lazy<IMyCommandGroupManager> myCommandGroupManager)
        {
            _myTaskSchedulerManager = myTaskSchedulerManager;
            _myCommandGroupManager = myCommandGroupManager;
        }

        public async Task<List<MyJobInfoDto>> GetJobListAsync(bool isIncludeItem = false)
        {
            return await _myTaskSchedulerManager.Value.GetJobListAsync(isIncludeItem);
        }
        public async Task<List<MyTriggerInfo>> GetTriggerListAsync(string mainId)
        {
            return await _myTaskSchedulerManager.Value.GetTriggerListAsync(mainId);
        }
        public async Task<List<SelectDto>> GetCommandGroupSelectListAsync()
        {
            return await _myCommandGroupManager.Value.GetCommandGroupSelectListAsync();
        }
        [HttpPost]
        public async Task<bool> SaveMyJobInfoAsync(MyJobInfoDto inputDto)
        {
            return await _myTaskSchedulerManager.Value.SaveMyJobInfoAsync(inputDto);
        }
        [HttpPost]
        public async Task<bool> SaveMyTriggerInfoAsync(MyTriggerInfo inputDto)
        {
            return await _myTaskSchedulerManager.Value.SaveMyTriggerInfoAsync(inputDto);
        }
        public async Task DeleteMyJobInfoAsync(string id)
        {
            await _myTaskSchedulerManager.Value.DeleteMyJobInfoAsync(id);
        }
        public async Task DeleteMyTriggerInfoAsync(string id)
        {
            await _myTaskSchedulerManager.Value.DeleteMyTriggerInfoAsync(id);
        }
        public async Task<bool> StartCommandGroupJobAsync(string jobId, string triggerId)
        {
            return await _myTaskSchedulerManager.Value.StartCommandGroupJobAsync(jobId, triggerId);
        }
        public async Task<bool> StartCommandGroupJobByTempAsync(string id)
        {
            return await _myTaskSchedulerManager.Value.StartCommandGroupJobByTempAsync(id);
        }
    }
}
