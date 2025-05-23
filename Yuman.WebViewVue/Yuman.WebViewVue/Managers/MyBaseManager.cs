using Yuman.WebViewVue.Helper.MultipleLanguages;

namespace Yuman.WebViewVue.Managers
{
    public class MyBaseManager
    {
        public string L(string key, params string[] args)
        {
            return LanguageHelper.L(key, args);
        }

        public string L(string lang, string key, params string[] args)
        {
            return LanguageHelper.L(lang, key, args);
        }
    }
}
