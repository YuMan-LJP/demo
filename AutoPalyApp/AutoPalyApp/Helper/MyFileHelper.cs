using Newtonsoft.Json;
using System.Text;

namespace AutoPalyApp.Helper
{
    public static class MyFileHelper
    {
        public static T? ReadJsonFile<T>(string jsonFileName)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            T? output;
            var filePath = $"{rootPath}\\{jsonFileName}";
            if (!File.Exists(filePath))
            {
                return default;
            }
            using (StreamReader reader = new StreamReader(filePath))
            {
                string json = reader.ReadToEnd();
                output = JsonConvert.DeserializeObject<T>(json);
            }
            return output;
        }

        public static void SaveJsonFile<T>(string jsonFileName, T jsonObject)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            var filePath = $"{rootPath}\\{jsonFileName}";
            using (FileStream fileStream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                fileStream.Seek(0, SeekOrigin.Begin);
                fileStream.SetLength(0);
                using (StreamWriter writer = new StreamWriter(fileStream, Encoding.UTF8))
                {
                    writer.WriteLine(JsonConvert.SerializeObject(jsonObject));
                }
            }
        }

        public static void WriteMessageTxt(string fileName, string message)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            var filePath = $"{rootPath}\\{fileName}";
            if (File.Exists(filePath))
            {
                StreamWriter sw = File.AppendText(filePath);
                sw.WriteLine(message);
                sw.Close();
            }
            else
            {
                //创建、写入
                FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite);
                StreamWriter sw = new StreamWriter(fs);
                sw.WriteLine(message);
                sw.Flush();
                sw.Dispose();
                sw.Close();
                fs.Close();
            }
        }

        public static List<string> ReadTxtByLine(string fileName)
        {
            var rootPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File";
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            string str = "";
            var filePath = $"{rootPath}\\{fileName}";
            if (File.Exists(filePath))
            {
                FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite);
                StreamReader reader = new StreamReader(fs);
                str = reader.ReadToEnd();
                reader.Dispose();
                reader.Close();
                fs.Close();

                return str.Split('\n').ToList();
            }

            return new List<string>();
        }

        /// <summary>
        /// 将图片文件转换为 Base64 编码的字符串。
        /// Converts an image file to a Base64-encoded string.
        /// </summary>
        /// <param name="imagePath">图片文件的路径。Path to the image file.</param>
        /// <returns>返回 Base64 编码的图片字符串。Returns a Base64-encoded image string.</returns>
        public static string ConvertImageToBase64(string imagePath)
        {
            if (!File.Exists(imagePath))
            {
                throw new FileNotFoundException("指定的图片路径不存在。Specified image path does not exist.");
            }
            byte[] imageBytes = File.ReadAllBytes(imagePath);
            return Convert.ToBase64String(imageBytes);
        }
    }
}
