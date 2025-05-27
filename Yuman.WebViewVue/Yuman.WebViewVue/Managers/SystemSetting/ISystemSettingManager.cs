using Yuman.WebViewVue.Helper.BasicConfigure;

namespace Yuman.WebViewVue.Managers.SystemSetting
{
    public interface ISystemSettingManager : ITransientDependency
    {
        Task<string?> GetSystemSettingAsync(string key);
        Task<Dictionary<string, string>> LoadAllSystemSettingsAsync();
        Task<bool> SaveAllSystemSettingAsync(Dictionary<string, string> dic);
        Task<bool> SaveSystemSettingAsync(string key, string value);
    }
}
