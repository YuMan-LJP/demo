using Newtonsoft.Json;
using System.Reflection;
using Yuman.WebViewVue.Managers;

namespace Yuman.WebViewVue.Helper.MultipleLanguages
{
    public static class LanguageHelper
    {
        private static string CurrentLanguageName = "";//系统当前语言
        private readonly static Dictionary<string, Dictionary<string, string>> _languageDic = [];

        private static void LoadLanguages()
        {
            var names = Assembly.GetExecutingAssembly().GetManifestResourceNames()
                .Where(w => w.StartsWith("Yuman.WebViewVue.Helper.MultipleLanguages"))
                .ToList();
            foreach (var name in names)
            {
                var enStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(name);
                if (enStream == null)
                {
                    continue;
                }
                using Stream stream = enStream;
                using StreamReader reader = new(stream);
                string content = reader.ReadToEnd();
                var obj = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
                if (obj != null)
                {
                    //取出en，zh_CN等字样
                    var lang = name.Replace("Yuman.WebViewVue.Helper.MultipleLanguages", "")
                        .Replace("json", "")
                        .TrimStart('.')
                        .TrimEnd('.');
                    _languageDic.Add(lang, obj);
                }
            }
        }

        public static string L(string key, params string[] args)
        {
            return GetCurLanTranslation(key, args);
        }

        public static string L(string lang, string key, params string[] args)
        {
            return GetCurLanTranslation(lang, key, args);
        }

        public static string GetCurLanTranslation(string key, params object[]? args)
        {
            var curLan = GetCurrentLanguageName();
            return GetTranslation(curLan, key, args);
        }

        public static string GetTranslation(string lang, string key, params object[]? args)
        {
            if (_languageDic == null || _languageDic?.Count == 0)
            {
                LoadLanguages();
            }

            if (_languageDic == null)
            {
                return key;
            }

            var isExist = _languageDic.TryGetValue(lang, out Dictionary<string, string>? langDic);
            if (!isExist)
            {
                return key;
            }

            if (langDic == null)
            {
                return key;
            }

            isExist = langDic.TryGetValue(key, out string? translation);
            if (!isExist)
            {
                return key;
            }

            if (translation == null)
            {
                return key;
            }

            if (args == null)
            {
                return translation;
            }
            return string.Format(translation, args);
        }
         
        public static Dictionary<string, Dictionary<string, string>>? GetAllLanguages()
        {
            if (_languageDic == null || _languageDic?.Count == 0)
            {
                LoadLanguages();
            }
            return _languageDic;
        }

        public static void ChangeCurrentLanguage(string lang)
        {
            if (CurrentLanguageName == lang)
            {
                return;
            }
            CurrentLanguageName = lang;
        }

        public static string GetCurrentLanguageName()
        {
            if (string.IsNullOrWhiteSpace(CurrentLanguageName))
            {
                return MyConsts.SystemSetting.SystemSetting_Language;
            }
            return CurrentLanguageName;
        }
    }
}
