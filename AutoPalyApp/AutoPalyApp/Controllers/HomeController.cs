using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        public async Task<bool> ShowMessageBox(string msg)
        {
            var result = MessageBox.Show(msg, "标题", MessageBoxButtons.OKCancel, MessageBoxIcon.Information, MessageBoxDefaultButton.Button1, MessageBoxOptions.ServiceNotification);
            if (result == DialogResult.OK)
            {
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        [HttpPost]
        public async Task<bool> SaveJsonFile()
        {
            try
            {
                var groupData = Request.Form["groupData"];
                var inputDto = JsonConvert.DeserializeObject<CommandGroup>(groupData);

                var files = Request.Form.Files;
                if (files.Count > 0)
                {
                    var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\Temp";
                    if (!Directory.Exists(rootPath))
                    {
                        Directory.CreateDirectory(rootPath);
                    }
                    var filePath = $"{rootPath}\\{inputDto.FileName}";//如果是图片的话，按组名建文件夹区分
                    if (!Directory.Exists(filePath))
                    {
                        Directory.CreateDirectory(filePath);
                    }

                    foreach (var file in files)
                    {
                        using var stream = file.OpenReadStream();
                        using var fileStream = System.IO.File.Create($"{filePath}\\{file.FileName}");
                        stream.Seek(0, SeekOrigin.Begin);
                        stream.CopyTo(fileStream);
                    }
                }

                FileHelper.SaveJsonFile($"{inputDto.FileName}.json", inputDto);
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                LogHelper.Error(ex.Message, ex);
            }
            return await Task.FromResult(false);
        }

        public async Task<List<CommandGroup>> GetAllJsonList()
        {
            List<CommandGroup>output = new List<CommandGroup>();
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File";
            var jsonFiils = System.IO.Directory.GetFiles(rootPath)
                .Where(w => System.IO.Path.GetExtension(w).Equals(".json", StringComparison.CurrentCultureIgnoreCase))
                .Select(s => Path.GetFileName(s))
                .ToList();
            foreach (var file in jsonFiils)
            {
                var data = FileHelper.ReadJsonFile<CommandGroup>(file);
                if (data != null)
                {
                    output.Add(data);
                }
            }
            return await Task.FromResult(output);
        }
    }
}
