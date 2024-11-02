using AutoPalyApp.Core.Dto;

namespace AutoPalyApp.Core
{
    public interface IMyTaskSchedulerManager
    {
        bool DeleteJsonFile(string id);
        List<MyJobInfo> GetMyJobInfos();
        bool SaveJsonFile(MyJobInfo jobInfo);
        void StartCommand(string commandGroupId);
        void TestTaskStart();
        bool StartCommandGroupJob(string jobId, string triggerId);
        bool StartCommandGroupJobByTemp(string commandGroupId);
    }
}
