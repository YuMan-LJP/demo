using Yuman.WebViewVue.Managers.SystemSetting;

namespace Yuman.WebViewVue.Services.SystemSetting
{
    public class SystemSettingService : MyBaseService, ISystemSettingService
    {
        private readonly ISystemSettingManager _systemSettingManager;

        public SystemSettingService(
            ISystemSettingManager systemSettingManager)
        {
            _systemSettingManager = systemSettingManager;
        }

        public async Task<Dictionary<string, string>> LoadAllSystemSettingsAsync()
        {
            return await _systemSettingManager.LoadAllSystemSettingsAsync();
        }

        public async Task<bool> SaveAllSystemSettingAsync(Dictionary<string, string> setting)
        {
            return await _systemSettingManager.SaveAllSystemSettingAsync(setting);
        }
    }
}
