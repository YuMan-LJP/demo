using AutoPalyApp.Core;
using AutoPalyApp.Core.Dto;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Quartz;
using static Vanara.PInvoke.Gdi32;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TaskSchedulerController : ControllerBase
    {
        private readonly Lazy<IMyTaskSchedulerManager> _myTaskSchedulerManager;
        private readonly Lazy<IMyCommandGroupManager> _myCommandGroupManager;

        public TaskSchedulerController(Lazy<IMyTaskSchedulerManager> myTaskSchedulerManager, Lazy<IMyCommandGroupManager> myCommandGroupManager)
        {
            _myTaskSchedulerManager = myTaskSchedulerManager;
            _myCommandGroupManager = myCommandGroupManager;
        }

        public async Task<List<MyJobInfo>> GetAllJsonList()
        {
            return await Task.FromResult(_myTaskSchedulerManager.Value.GetMyJobInfos());
        }

        public async Task<List<string>> GetCommandGroupList()
        {
            var rootPath = _myCommandGroupManager.Value.GetFileUrl();
            if (!Directory.Exists(rootPath))
            {
                return new List<string>();
            }

            var files = Directory.GetFiles(rootPath)
                .Where(w => Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
                .Select(s => Path.GetFileNameWithoutExtension(s))//文件名就是Id
                .ToList();
            return await Task.FromResult(files);
        }

        [HttpPost]
        public async Task<bool> SaveJsonFile()
        {
            var inputDto = JsonConvert.DeserializeObject<MyJobInfo>(Request.Form["jobInfo"].ToString());
            var files = Request.Form.Files;
            var output = _myTaskSchedulerManager.Value.SaveJsonFile(inputDto);
            return await Task.FromResult(output);
        }

        public async Task<bool> DeleteJsonFile(string id)
        {
            return await Task.FromResult(_myTaskSchedulerManager.Value.DeleteJsonFile(id));
        }

        public async Task<bool> StartCommandGroupJob(string jobId, string triggerId)
        {
            return await Task.FromResult(_myTaskSchedulerManager.Value.StartCommandGroupJob(jobId, triggerId));
        }

        public async Task<bool> TestApi()
        {
            //_myTaskSchedulerManager.Value.TestTaskStart();
            Form1.SendMessageToWebView(new WebViewMessageDto("vueMessageEvent", new { Arg1 = "后端返回的参数1", Arg2 = "后端返回的参数2", arg3 = "后端返回的参数3" }));
            return await Task.FromResult(true);
        }
    }
}
