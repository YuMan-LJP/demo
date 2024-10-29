using AutoPalyApp.Core.Dto;
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
            var jsonFiils = Directory.GetFiles(rootPath)
               .Where(w => Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
               .Select(s => Path.GetFileName(s))
               .ToList();

            List<MyJobInfo> output = new List<MyJobInfo>();
            foreach (var file in jsonFiils)
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
            MyJobHelper.TempStartJob<TempTestJob>("0/10 * * * * ?", out job, out trigger);
            MyLogHelper.Info($"临时测试：job：{job}|trigger：{trigger}");

            MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key", "job组别", "job描述", "触发器唯一Key", "触发器组别", "触发器描述", "0/2 * * * * ?", "test111", "test222");
            MyJobHelper.AddJobAndTrigger<TempTestJob>("Job唯一Key_2", "job组别", "job描述_2", "触发器唯一Key_2", "触发器组别", "触发器描述_2", "0/2 * * * * ?", "test333", "test444");
        }
    }
}
