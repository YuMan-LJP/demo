using Microsoft.EntityFrameworkCore;
using Yuman.WebViewVue.Managers.JobInfo.Entity;
using Yuman.WebViewVue.Services.Dto;

namespace Yuman.WebViewVue.Managers.JobInfo
{
    public class JobInfoManager : MyBaseManager, IJobInfoManager
    {
        public async Task<List<MyJobInfo>> GetJobInfosAsync(string group, string name, int skipCount, int maxResultCount)
        {
            using var db = new MyEfContext();
            var query = await QueryJobInfosAsync(db, group, name);
            return await query.Skip(skipCount).Take(maxResultCount).AsNoTracking().ToListAsync();
        }

        public async Task<int> GetJobInfosCountAsync(string group, string name)
        {
            using var db = new MyEfContext();
            var query = await QueryJobInfosAsync(db, group, name);
            return await query.CountAsync();
        }

        protected virtual async Task<IQueryable<MyJobInfo>> QueryJobInfosAsync(MyEfContext db, string group, string name)
        {
            var query = db.MyJobInfos.Select(s => s);
            if (!string.IsNullOrWhiteSpace(group))
            {
                query = query.Where(w => w.Group.Contains(group));
            }
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(w => w.Name.Contains(name));
            }
            return await Task.FromResult(query);
        }

        public async Task<MyJobInfo?> GetJobInfoByIdAsync(string id)
        {
            using var db = new MyEfContext();
            return await db.MyJobInfos.Select(s => s)
                 .Where(w => w.Id == id)
                 .SingleOrDefaultAsync();
        }

        public async Task<List<MyTriggerInfo>> GetTriggerInfosByJobIdAsync(string jobInfoId)
        {
            using var db = new MyEfContext();
            return await db.MyTriggerInfos.Select(s => s)
                 .Where(w => w.JobInfoId == jobInfoId)
                 .ToListAsync();
        }

        public async Task<MyTriggerInfo?> GetTriggerInfoByIdAsync(string id)
        {
            using var db = new MyEfContext();
            return await db.MyTriggerInfos.Select(s => s)
                 .Where(w => w.Id == id)
                 .SingleOrDefaultAsync();
        }

        public async Task<bool> SaveJobInfoAsync(MyJobInfo jobInfo)
        {
            using var db = new MyEfContext();
            var job = await db.MyJobInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == jobInfo.Id);
            if (job == null)
            {
                await db.MyJobInfos.AddAsync(jobInfo);
            }
            else
            {
                //Group+Name唯一，同一个分组下不能出现相同的名称
                var isExists = await db.MyJobInfos.AnyAsync(a => a.Id != jobInfo.Id && a.Group == jobInfo.Group && a.Name == jobInfo.Name);
                if (isExists)
                {
                    throw new Exception(L("KeyExists", $"{L("JobInfo.Group")}+{L("JobInfo.Name")}"));
                }
                db.MyJobInfos.Update(jobInfo);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<bool> SaveTriggerInfoAsync(MyTriggerInfo triggerInfo)
        {
            using var db = new MyEfContext();
            var job = await db.MyTriggerInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == triggerInfo.Id);
            if (job == null)
            {
                await db.MyTriggerInfos.AddAsync(triggerInfo);
            }
            else
            {
                //Group+Name唯一，同一个分组下不能出现相同的名称
                var isExists = await db.MyTriggerInfos.AnyAsync(a => a.JobInfoId != triggerInfo.JobInfoId && a.Id != triggerInfo.Id && a.Group == triggerInfo.Group && a.Name == triggerInfo.Name);
                if (isExists)
                {
                    throw new Exception(L("KeyExists", $"{L("JobInfo.Group")}+{L("JobInfo.Name")}"));
                }
                db.MyTriggerInfos.Update(triggerInfo);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<bool> DeleteJobInfoAsync(string id)
        {
            using var db = new MyEfContext();
            var job = await db.MyJobInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (job != null)
            {
                db.MyJobInfos.Remove(job);

                var triggers = await db.MyTriggerInfos.Where(w => w.JobInfoId == id).Select(s => s).AsNoTracking().ToListAsync();
                db.MyTriggerInfos.RemoveRange(triggers);

                var res = await db.SaveChangesAsync();
                return res > 0;
            }
            return false;
        }

        public async Task<bool> DeleteTriggerInfoAsync(string id)
        {
            using var db = new MyEfContext();
            var trigger = await db.MyTriggerInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (trigger != null)
            {
                db.MyTriggerInfos.Remove(trigger);
                var res = await db.SaveChangesAsync();
                return res > 0;
            }
            return false;
        }

        public async Task<List<Select2ItemDto>> GetTriggerTypeSelect()
        {
            return await GetSelectData<MyTriggerTypeEnum>();
        }

        public async Task<List<Select2ItemDto>> GetIntervalUnitSelect()
        {
            return await GetSelectData<MyIntervalUnitEnum>();
        }
    }
}
