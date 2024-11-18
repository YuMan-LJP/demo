using AutoPalyApp.Helper;

namespace AutoPalyApp.Core
{
    public class MyManagerBase
    {
        public virtual string L(string key, Dictionary<string, string>? parameters = null)
        {
            return MyLanguagesHelper.GetLang(key, parameters);
        }
    }
}
