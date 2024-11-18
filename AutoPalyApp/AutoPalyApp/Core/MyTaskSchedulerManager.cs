using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;
using AutoPalyApp.Core.Jobs;
using AutoPalyApp.Helper;
using AutoPalyApp.Helper.JobHelper;
using Microsoft.EntityFrameworkCore;

namespace AutoPalyApp.Core
{
    public class MyTaskSchedulerManager : MyManagerBase, IMyTaskSchedulerManager
    {
        private readonly Lazy<IMyWorkProgramManager> _myWorkProgramManager;

        public MyTaskSchedulerManager(Lazy<IMyWorkProgramManager> myWorkProgramManager)
        {
            _myWorkProgramManager = myWorkProgramManager;
        }

        public async Task<List<MyJobInfoDto>> GetJobListAsync(bool isIncludeItem = false)
        {
            using var db = new MyEfContext();
            var mains = await db.MyJobInfos.Select(s => s).ProjectToEx<MyJobInfoDto>().ToListAsync();
            if (isIncludeItem)
            {
                var ids = mains.Select(s => s.Id).ToList();
                var items = await db.MyTriggerInfos.Where(w => ids.Any(a => a == w.JobId)).AsNoTracking().ToListAsync();
                foreach (var main in mains)
                {
                    main.Triggers = items.Where(w => w.JobId == main.Id).ToList();
                }
            }
            return mains;
        }

        public async Task<List<MyTriggerInfo>> GetTriggerListAsync(string mainId)
        {
            using var db = new MyEfContext();
            return await db.MyTriggerInfos.Where(w => w.JobId == mainId).Select(s => s).AsNoTracking().ToListAsync();
        }

        public async Task<MyJobInfoDto?> GetJobByIdAsync(string id)
        {
            using var db = new MyEfContext();
            return await db.MyJobInfos.Where(w => w.Id == id).Select(s => s).ProjectToEx<MyJobInfoDto>().SingleOrDefaultAsync();
        }

        public async Task<MyTriggerInfo?> GetTriggerByIdAsync(string id)
        {
            using var db = new MyEfContext();
            return await db.MyTriggerInfos.Where(w => w.Id == id).Select(s => s).AsNoTracking().SingleOrDefaultAsync();
        }

        public async Task<bool> SaveMyJobInfoAsync(MyJobInfo inputDto)
        {
            using var db = new MyEfContext();
            var job = await db.MyJobInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == inputDto.Id);
            if (job == null)
            {
                await db.MyJobInfos.AddAsync(inputDto);
            }
            else
            {
                db.MyJobInfos.Update(inputDto);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<bool> SaveMyTriggerInfoAsync(MyTriggerInfo inputDto)
        {
            using var db = new MyEfContext();
            var job = await db.MyTriggerInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == inputDto.Id);
            if (job == null)
            {
                await db.MyTriggerInfos.AddAsync(inputDto);
            }
            else
            {
                db.MyTriggerInfos.Update(inputDto);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<bool> DeleteMyJobInfoAsync(string id)
        {
            using var db = new MyEfContext();
            var job = await db.MyJobInfos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (job != null)
            {
                db.MyJobInfos.Remove(job);

                var triggers = await db.MyTriggerInfos.Where(w => w.JobId == id).Select(s => s).AsNoTracking().ToListAsync();
                db.MyTriggerInfos.RemoveRange(triggers);

                var res = await db.SaveChangesAsync();
                return res > 0;
            }
            return false;
        }

        public async Task<bool> DeleteMyTriggerInfoAsync(string id)
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

        /// <summary>
        /// 立即触发一次执行
        /// </summary>
        /// <param name="commandGroupId"></param>
        public async Task StartCommandAsync(string commandGroupId)
        {
            await _myWorkProgramManager.Value.RunCommandAsync(commandGroupId);
        }

        public async Task<bool> StartCommandGroupJobAsync(string jobId, string triggerId)
        {
            var jobInfo = await GetJobByIdAsync(jobId);
            if (jobInfo == null)
            {
                return false;
            }

            var triggerInfo = await GetTriggerByIdAsync(triggerId);
            if (triggerInfo == null)
            {
                return false;
            }

            MyJobHelper.AddJobAndTrigger<CommandGroupJob>(jobInfo.Key, jobInfo.Group, jobInfo.Description, triggerInfo.Key, triggerInfo.Group, triggerInfo.Description, triggerInfo.Cron, "MuMu模拟器12", triggerInfo.CommandGroupId);
            return true;
        }

        public async Task<bool> StartCommandGroupJobByTempAsync(string commandGroupId)
        {
            return await Task.Factory.StartNew(() =>
            {
                string job;
                string trigger;
                MyJobHelper.StartTempJob<CommandGroupJob>("* * 22 * * ?", out job, out trigger, "MuMu模拟器12", commandGroupId, "", true);
                MyLogHelper.Info($"临时启动：job：{job}|trigger：{trigger}");
                return true;
            });
        }
    }
}
