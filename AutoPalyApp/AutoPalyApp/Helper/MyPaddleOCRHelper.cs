using AutoPalyApp.Helper.Dto;
using Newtonsoft.Json;
using PaddleOCRJson;
using System.Reflection;
using System.Text.RegularExpressions;

namespace AutoPalyApp.Helper
{
    public sealed class MyPaddleOCRHelper
    {
        private static MyPaddleOCRHelper? _instance;
        private static readonly object _lock = new object();
        private MyPaddleOCRHelper() { }
        public static MyPaddleOCRHelper GetInstance()
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new MyPaddleOCRHelper();
                    }
                }
            }
            return _instance;
        }

        private static OcrClient? _ocrClient;
        private static readonly object _lock2 = new object();
        private static OcrClient GetClientInstance()
        {
            if (_ocrClient == null)
            {
                lock (_lock2)
                {
                    if (_ocrClient == null)
                    {
                        _ocrClient = InitOcrClient();
                    }
                }
            }
            return _ocrClient;
        }

        private static OcrClient InitOcrClient()
        {
            MyLogHelper.Debug($"[{DateTime.Now}] 类：{nameof(MyPaddleOCRHelper)} OcrClient初始化");

            var asmLocPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var _enginePath = $"{asmLocPath}\\Helper\\PaddleOCR-json_v1.4.1\\PaddleOCR-json.exe";
            var startupArgs = OcrEngineStartupArgs.WithPipeMode(_enginePath);
            var engine = new OcrEngine(startupArgs);
            return engine.CreateClient();
        }

        public Point? GetOcrResultBytes(byte[] bytes, string text)
        {
            var result = GetClientInstance().FromImageBytes(bytes);
            if (result == null)
            {
                return null;
            }
            var ocr = JsonConvert.DeserializeObject<OcrResult>(result);
            if (ocr == null)
            {
                return null;
            }
            if (ocr.OcrData == null)
            {
                return null;
            }
            if (ocr.OcrData.Length == 0)
            {
                return null;
            }
            var matchText = ocr.OcrData.Where(w => w.Text == text).FirstOrDefault();
            if (matchText == null)
            {
                return null;
            }
            return OcrToPoint(matchText);
        }

        public Point? GetOcrResultByBase64(string imageBase64, string text)
        {
            var result = GetClientInstance().FromBase64(imageBase64);
            if (result == null)
            {
                return null;
            }
            var ocr = JsonConvert.DeserializeObject<OcrResult>(result);
            if (ocr == null)
            {
                return null;
            }
            if (ocr.OcrData == null)
            {
                return null;
            }
            if (ocr.OcrData.Length == 0)
            {
                return null;
            }
            var matchText = ocr.OcrData.Where(w => w.Text == text).FirstOrDefault();
            if (matchText == null)
            {
                return null;
            }
            return OcrToPoint(matchText);
        }

        public Point? GetOcrResultByPath(string path, string text, int index = 0)
        {
            var result = GetClientInstance().FromImageFile(path);
            if (result == null)
            {
                return null;
            }
            var ocr = JsonConvert.DeserializeObject<OcrResult>(result);
            if (ocr == null)
            {
                return null;
            }
            if (ocr.OcrData == null)
            {
                return null;
            }
            if (ocr.OcrData.Length == 0)
            {
                return null;
            }
            var matchText = ocr.OcrData
                .Where(w => StringAdapter(w.Text) == text)
                .Skip(index)
                .FirstOrDefault();
            if (matchText == null)
            {
                return null;
            }
            return OcrToPoint(matchText);
        }

        private Point OcrToPoint(OcrData data)
        {
            var maxX = data.Box.Max(m => m[0]);
            var minX = data.Box.Min(m => m[0]);
            var maxY = data.Box.Max(m => m[1]);
            var minY = data.Box.Min(m => m[1]);
            var centerX = (maxX + minX) / 2;
            var centerY = (maxY + minY) / 2;
            return new Point(centerX, centerY);
        }

        /// <summary>
        /// 保留字母，数字，中文，空格
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private string StringAdapter(string text)
        {
            var result = Regex.Match(text, @"[a-zA-Z0-9_\u4e00-\u9fa5 ]+");
            if (result != null)
            {
                return result.Value;
            }
            return text;
        }
    }
}
