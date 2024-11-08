using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;

namespace AutoPalyApp.Core
{
    public class MyCommandGroupManager : IMyCommandGroupManager
    {
        public string GetFileUrl()
        {
            return $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\CommandJson";
        }

        public bool SaveJsonFile(CommandGroup commandGroup, IFormFileCollection files)
        {
            try
            {
                var rootPath = GetFileUrl();
                if (files.Count > 0)
                {
                    if (!Directory.Exists(rootPath))
                    {
                        Directory.CreateDirectory(rootPath);
                    }
                    var filePath = $"{rootPath}\\{commandGroup.Id}";//如果是图片的话，按组名建文件夹区分
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

                MyFileHelper.SaveJsonFile($"{commandGroup.Id}.json", commandGroup, rootPath);

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
                if (System.IO.File.Exists(jsonPath))
                {
                    System.IO.File.Delete(jsonPath);
                }

                var filePath = $"{rootPath}\\{id}";
                if (Directory.Exists(filePath))
                {
                    Directory.Delete(filePath, true);
                }

                return true;
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex.Message, ex);
            }
            return false;
        }
    }
}
