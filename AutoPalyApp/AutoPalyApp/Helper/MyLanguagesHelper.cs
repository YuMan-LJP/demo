namespace AutoPalyApp.Helper
{
    public static class MyLanguagesHelper
    {
        private static string _lang { get; set; } = "zh";
        private static Dictionary<string, Dictionary<string, string>>? _languages { get; set; } = null;

        public static void InitLanguages()
        {
            _languages = new Dictionary<string, Dictionary<string, string>>();
            var path = $"{AppDomain.CurrentDomain.BaseDirectory}\\Helper\\I18n";
            var files = Directory.GetFiles(path);
            foreach (var file in files)
            {
                _languages.Add(Path.GetFileNameWithoutExtension(file), MyFileHelper.ReadJsonFile<Dictionary<string, string>>(Path.GetFileName(file), path));
            }
        }

        public static Dictionary<string, Dictionary<string, string>>? GetLanguages()
        {
            if (_languages == null)
            {
                InitLanguages();
            }
            return _languages;
        }

        public static void SetLang(string lang)
        {
            _lang = lang;
        }

        public static string GetLang(string key, Dictionary<string, string>? parameters = null)
        {
            if (_languages == null)
            {
                InitLanguages();
            }
            Dictionary<string, string> curLanguage;
            if (!_languages.ContainsKey(_lang))
            {
                if (_languages.ContainsKey("zh"))
                {
                    curLanguage = _languages["zh"];//没有指定语言的翻译时默认使用中文
                }
                else
                {
                    return key;
                }
            }
            else
            {
                curLanguage = _languages[_lang];
            }
            var text = curLanguage[key];
            if (parameters != null)
            {
                foreach (var parameter in parameters)
                {
                    text.Replace("{" + parameter.Key + "}", parameter.Value);
                }
            }
            return text;
        }
    }
}
