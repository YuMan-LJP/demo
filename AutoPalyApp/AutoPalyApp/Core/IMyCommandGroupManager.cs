using AutoPalyApp.Core.Dto;

namespace AutoPalyApp.Core
{
    public interface IMyCommandGroupManager
    {
        bool DeleteJsonFile(string id);
        string GetFileUrl();
        bool SaveJsonFile(CommandGroup commandGroup, IFormFileCollection files);
    }
}
