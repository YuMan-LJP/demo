using AutoPalyApp.Core;
using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;
using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommandGroupController : MyControllerBase
    {
        private readonly Lazy<IMyCommandGroupManager> _myCommandGroupManager;

        public CommandGroupController(Lazy<IMyCommandGroupManager> myCommandGroupManager)
        {
            _myCommandGroupManager = myCommandGroupManager;
        }

        public async Task<List<MyCommandGroupDto>> GetCommandGroupListAsync(bool isIncludeItem = false)
        {
            return await _myCommandGroupManager.Value.GetCommandGroupListAsync(isIncludeItem);
        }
        public async Task<List<MyCommandDto>> getCommandByParentIdListAsync(string parentId, bool isIncludeItem = false)
        {
            return await _myCommandGroupManager.Value.GetCommandByParentIdListAsync(parentId, isIncludeItem);
        }
        [HttpPost]
        public async Task<bool> SaveMyCommandGroupAsync(MyCommandGroup inputDto)
        {
            return await _myCommandGroupManager.Value.SaveMyCommandGroupAsync(inputDto);
        }
        [HttpPost]
        public async Task<bool> SaveMyCommandItemAsync(MyCommand inputDto)
        {
            return await _myCommandGroupManager.Value.SaveMyCommandItemAsync(inputDto);
        }
        public async Task<bool> DeleteMyCommandGroupAsync(string id)
        {
            return await _myCommandGroupManager.Value.DeleteMyCommandGroupAsync(id);
        }
        public async Task<bool> DeleteMyCommandItemAsync(string id)
        {
            return await _myCommandGroupManager.Value.DeleteMyCommandItemAsync(id);
        }
    }
}
