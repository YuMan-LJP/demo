using AutoPalyApp.Helper;

namespace AutoPalyApp.Core
{
    public class MyConfigureManager : MyManagerBase, IMyConfigureManager
    {
        public async Task<string> GetCurrentRunningAppAsync()
        {
            try
            {
                return await MyAdbHelper.GetInstance().GetCurrentRunningAppAsync();
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex);
                throw new MyMessageException("没有开启App");
            }
        }
    }
}
