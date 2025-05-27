using Microsoft.EntityFrameworkCore;
using Yuman.WebViewVue.Helper;
using Yuman.WebViewVue.Managers.SystemSetting.Entity;

namespace Yuman.WebViewVue.Managers.SystemSetting
{
    public class SystemSettingManager : MyBaseManager, ISystemSettingManager
    {
        private static Dictionary<string, string>? SystemSettingDic;//静态缓存，如果数据变更就清空，读取时会重新查

        public async Task<Dictionary<string, string>> LoadAllSystemSettingsAsync()
        {
            if (SystemSettingDic != null)
            {
                return SystemSettingDic;
            }

            var mySystemSettings = new List<MySystemSetting>();
            var fields = typeof(MyConsts.SystemSetting).GetFields();
            foreach (var field in fields)
            {
                mySystemSettings.Add(new MySystemSetting
                {
                    Key = field.Name,
                    Value = field.GetValue(new MyConsts.SystemSetting()).ToStringEx()
                });
            }

            using var db = new MyEfContext();
            var dbDatas = await db.MySystemSettings.AsNoTracking().ToListAsync();
            var newDatas = mySystemSettings.Where(w => !dbDatas.Any(a => a.Key.EqualsIgnoreCase(w.Key))).ToList();
            if (newDatas.Count == 0)
            {
                SystemSettingDic = dbDatas.ToDictionary(k => k.Key, v => v.Value);
                return SystemSettingDic;
            }
            else
            {
                //如果常量类有新增项，就自动插入数据库，一切以数据库的值为准
                await db.MySystemSettings.AddRangeAsync(newDatas);
                await db.SaveChangesAsync();
            }

            SystemSettingDic = await db.MySystemSettings.AsNoTracking().ToDictionaryAsync(k => k.Key, v => v.Value);
            return SystemSettingDic;
        }

        public async Task<string?> GetSystemSettingAsync(string key)
        {
            if (SystemSettingDic == null)
            {
                SystemSettingDic = await LoadAllSystemSettingsAsync();
            }
            if (SystemSettingDic == null)
            {
                return string.Empty;
            }
            SystemSettingDic.TryGetValue(key, out string? value);
            return value;
        }

        public async Task<bool> SaveSystemSettingAsync(string key, string value)
        {
            using var db = new MyEfContext();
            var data = await db.MySystemSettings.AsNoTracking().SingleOrDefaultAsync(s => s.Key == key);
            if (data == null)
            {
                await db.MySystemSettings.AddAsync(new MySystemSetting { Key = key, Value = value });
            }
            else
            {
                data.Value = value;
                db.MySystemSettings.Update(data);
            }
            var res = await db.SaveChangesAsync();
            var isOK = res > 0;
            if (isOK)
            {
                SystemSettingDic = null;//清空缓存，到时候取值的时候重新查
            }
            return isOK;
        }

        public async Task<bool> SaveAllSystemSettingAsync(Dictionary<string, string> dic)
        {
            var saveDatas = dic.Select(s => new MySystemSetting { Key = s.Key, Value = s.Value }).ToList();

            using var db = new MyEfContext();
            var dbDatas = await db.MySystemSettings.AsNoTracking().ToListAsync();
            var newDatas = saveDatas.Where(w => !dbDatas.Any(a => a.Key.EqualsIgnoreCase(w.Key))).ToList();
            if (newDatas.Count > 0)
            {
                await db.MySystemSettings.AddRangeAsync(newDatas);
            }
            var updateDatas = saveDatas.Join(dbDatas,
                a => a.Key.ToUpper(),
                b => b.Key.ToUpper(),
                (r1, r2) => new { SaveData = r1, DbData = r2 }).ToList();
            if (updateDatas.Count > 0)
            {
                foreach (var updateData in updateDatas)
                {
                    updateData.DbData.Value = updateData.SaveData.Value;
                }
                db.MySystemSettings.UpdateRange(updateDatas.Select(s => s.DbData));
            }

            var res = await db.SaveChangesAsync();
            var isOK = res > 0;
            if (isOK)
            {
                SystemSettingDic = null;//清空缓存，到时候取值的时候重新查
            }
            return isOK;
        }
    }
}
