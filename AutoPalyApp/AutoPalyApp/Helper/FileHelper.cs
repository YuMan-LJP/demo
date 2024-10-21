using Newtonsoft.Json;
using System.Text;

namespace AutoPalyApp.Helper
{
    public static class FileHelper
    {
        public static T? ReadJsonFile<T>(string jsonFileName)
        {
            T? output;
            var filePath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\{jsonFileName}";
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
            var filePath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\{jsonFileName}";
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
            var filePath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\{fileName}";
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
            string str = "";
            var filePath = $"{AppDomain.CurrentDomain.BaseDirectory}\\App_Data\\File\\{fileName}";
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
    }
}
