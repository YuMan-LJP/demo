using Yuman.WebViewVue.Helper.BasicConfigure;

namespace Yuman.WebViewVue.Services.SystemSetting
{
    public interface ISystemSettingService : ITransientDependency, IWebViewApi
    {
        Task<Dictionary<string, string>> LoadAllSystemSettingsAsync();
        Task<bool> SaveAllSystemSettingAsync(Dictionary<string, string> setting);
    }
}
