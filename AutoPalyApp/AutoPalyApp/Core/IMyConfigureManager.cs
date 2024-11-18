
namespace AutoPalyApp.Core
{
    public interface IMyConfigureManager
    {
        Task<string> GetCurrentRunningAppAsync();
    }
}
