using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Jobs;
using AutoPalyApp.Helper;
using AutoPalyApp.Helper.JobHelper;

namespace AutoPalyApp.Core
{
    public class MyTaskSchedulerManager : IMyTaskSchedulerManager
    {
        private readonly Lazy<IMyWorkProgramManager> _myWorkProgramManager;

        public MyTaskSchedulerManager(Lazy<IMyWorkProgramManager> myWorkProgramManager)
        {
            _myWorkProgramManager = myWorkProgramManager;
        }

        public string GetFileUrl()
        {
            return $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\TaskJson";
        }

        public List<MyJobInfo> GetMyJobInfos()
        {
            var rootPath = GetFileUrl();
            if (!Directory.Exists(rootPath))
            {
                return new List<MyJobInfo>();
            }
            var jsonFiles = Directory.GetFiles(rootPath)
               .Where(w => Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
               .Select(s => Path.GetFileName(s))
               .ToList();

            List<MyJobInfo> output = new List<MyJobInfo>();
            foreach (var file in jsonFiles)
            {
                var data = MyFileHelper.ReadJsonFile<MyJobInfo>(file, rootPath);
                if (data != null)
                {
                    output.Add(data);
                }
            }
            return output;
        }

        public bool SaveJsonFile(MyJobInfo jobInfo)
        {
            try
            {
                var rootPath = GetFileUrl();
                MyFileHelper.SaveJsonFile($"{jobInfo.Id}.json", jobInfo, rootPath);

                return true;
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }
            return false;

        }

        public bool DeleteJsonFile(string id)
        {
            try
            {
                var rootPath = GetFileUrl();
                var jsonPath = $"{rootPath}\\{id}.json";
                if (File.Exists(jsonPath))
                {
                    File.Delete(jsonPath);
                }

                return true;
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }
            return false;
        }

        /// <summary>
        /// 立即触发一次执行
        /// </summary>
        /// <param name="commandGroupId"></param>
        public void StartCommand(string commandGroupId)
        {
            _myWorkProgramManager.Value.RunCommand(commandGroupId + ".json");
        }

        /// <summary>
        /// 测试用
        /// </summary>
        public void TestTaskStart()
        {
            string job;
            string trigger;
            MyJobHelper.StartTempJob<TempTestJob>("0/3 * * * * ?", out job, out trigger);
            MyLogHelper.Info($"临时测试：job：{job}|trigger：{trigger}");

            string job2;
            string trigger2;
            MyJobHelper.StartTempJob<TempTestJob>("0/7 * * * * ?", out job2, out trigger2);
            MyLogHelper.Info($"临时测试：job：{job2}|trigger：{trigger2}");

            //MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key", "job组别", "job描述", "触发器唯一Key", "触发器组别", "触发器描述", "0/5 * * * * ?", "test111", "test222");
            //MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key_2", "job组别", "job描述_2", "触发器唯一Key_2", "触发器组别", "触发器描述_2", "0/7 * * * * ?", "test333", "test444");
        }

        public bool StartCommandGroupJob(string jobId, string triggerId)
        {
            var rootPath = GetFileUrl();
            if (!Directory.Exists(rootPath))
            {
                return false;
            }
            var jsonFile = Directory.GetFiles(rootPath)
               .Where(w => Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
               .Where(s => Path.GetFileName(s) == jobId)
               .SingleOrDefault();

            if (jsonFile == null)
            {
                return false;
            }

            var jobInfo = MyFileHelper.ReadJsonFile<MyJobInfo>(jsonFile, rootPath);
            if (jobInfo == null)
            {
                return false;
            }
            var triggerInfo = jobInfo.Triggers.Where(w => w.Id == triggerId).SingleOrDefault();
            if (triggerInfo == null)
            {
                return false;
            }

            MyJobHelper.AddJobAndTrigger<CommandGroupJob>(jobInfo.Key, jobInfo.Group, jobInfo.Description, triggerInfo.Key, triggerInfo.Group, triggerInfo.Description, triggerInfo.Cron, "MuMu模拟器12", $"{triggerInfo.CommandGroupId}.json");
            return true;
        }

        public bool StartCommandGroupJobByTemp(string commandGroupId)
        {
            string job;
            string trigger;
            MyJobHelper.StartTempJob<CommandGroupJob>("* * 22 * * ?", out job, out trigger, "MuMu模拟器12", $"{commandGroupId}.json", "", true);
            MyLogHelper.Info($"临时启动：job：{job}|trigger：{trigger}"); 
            return true;
        }
    }
}
