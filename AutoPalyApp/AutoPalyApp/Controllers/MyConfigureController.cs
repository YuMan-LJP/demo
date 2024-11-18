using AutoPalyApp.Core;
using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MyConfigureController : MyControllerBase
    {
        private readonly Lazy<IMyConfigureManager> _myConfigureManager;

        public MyConfigureController(Lazy<IMyConfigureManager> myConfigureManager)
        {
            _myConfigureManager = myConfigureManager;
        }

        public void SetLang(string lang)
        {
            MyLanguagesHelper.SetLang(lang);
        }

        public IActionResult GetI18nLanguagesAsync()
        {
            return new JsonResult(MyLanguagesHelper.GetLanguages());
        }

        public async Task<string> GetCurrentRunningAppAsync()
        {
            try
            {
                return await _myConfigureManager.Value.GetCurrentRunningAppAsync();
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex);
                throw new MyMessageException(L("appStartNotOpen"));
            }
        }
    }
}
