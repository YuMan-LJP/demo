using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    public class MyControllerBase : ControllerBase
    {
        public virtual string L(string key, Dictionary<string, string>? parameters = null)
        {
            return MyLanguagesHelper.GetLang(key, parameters);
        }
    }
}
