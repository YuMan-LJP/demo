using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core
{
    public interface IMyCommandGroupManager
    {
        Task<MyCommandGroupDto> GetCommandGroupByIdAsync(string jodId, bool isIncludeItem = false);
        Task<List<MyCommandGroupDto>> GetCommandGroupListAsync(bool isIncludeItem = false);
        Task<List<MyCommandDto>> GetCommandByParentIdListAsync(string parentId, bool isIncludeItem = false);
        Task<bool> SaveMyCommandGroupAsync(MyCommandGroup commandGroup);
        Task<bool> SaveMyCommandItemAsync(MyCommand command);
        Task<bool> DeleteMyCommandGroupAsync(string id);
        Task<bool> DeleteMyCommandItemAsync(string id);
        Task<List<SelectDto>> GetCommandGroupSelectListAsync();
    }
}
