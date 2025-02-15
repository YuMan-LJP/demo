namespace AutoPalyApp.Core
{
    public interface IMyWorkProgramManager
    {
        Task RunCommandAsync(string commandGroupId);
    }
}
