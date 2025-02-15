using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core
{
    public interface IMyCommandGroupManager
    {
        Task<MyCommandGroupDto> GetCommandGroupByIdAsync(string jodId);
        Task<List<MyCommandGroupDto>> GetCommandGroupListAsync();
        Task<List<SelectDto>> GetCommandGroupSelectListAsync();
        Task<List<MyCommand>> GetCommandListAsync();
        Task<int> SaveCommandAsync(List<MyCommand> commands);
        Task<bool> SaveMyCommandGroupAsync(MyCommandGroup commandGroup);
    }
}
