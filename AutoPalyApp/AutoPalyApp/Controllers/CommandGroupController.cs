using AutoPalyApp.Controllers.Model;
using AutoPalyApp.Core;
using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommandGroupController : ControllerBase
    {
        private readonly Lazy<IMyCommandGroupManager> _myCommandGroupManager;

        public CommandGroupController(Lazy<IMyCommandGroupManager> myCommandGroupManager)
        {
            _myCommandGroupManager = myCommandGroupManager;
        }

        public async Task<List<CommandGroupOutputDto>> GetAllJsonList()
        {
            List<CommandGroupOutputDto> output = new List<CommandGroupOutputDto>();
            var rootPath = _myCommandGroupManager.Value.GetFileUrl();
            if (!Directory.Exists(rootPath))
            {
                return output;
            }

            var jsonFiils = Directory.GetFiles(rootPath)
                .Where(w => Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
                .Select(s => Path.GetFileName(s))
                .ToList();

            foreach (var file in jsonFiils)
            {
                var data = MyFileHelper.ReadJsonFile<CommandGroupOutputDto>(file);
                if (data != null)
                {
                    foreach (var item in data.Commands)
                    {
                        if (item.Type == CommandTypeEnum.Image)
                        {
                            item.ImageBase64String = MyFileHelper.ConvertImageToBase64($"{rootPath}\\{data.Id}\\{item.Content}");
                        }
                    }
                    output.Add(data);
                }
            }
            return await Task.FromResult(output);
        }

        [HttpPost]
        public async Task<bool> SaveJsonFile()
        {
            var inputDto = JsonConvert.DeserializeObject<CommandGroup>(Request.Form["groupData"].ToString());
            var files = Request.Form.Files;
            var output = _myCommandGroupManager.Value.SaveJsonFile(inputDto, files);
            return await Task.FromResult(output);
        }

        public async Task<bool> DeleteJsonFile(string id)
        {
            return await Task.FromResult(_myCommandGroupManager.Value.DeleteJsonFile(id));
        }
    }
}
