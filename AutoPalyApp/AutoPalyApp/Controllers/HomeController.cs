using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        public async Task<bool> ShowMessageBox(string msg)
        {
            var result = MessageBox.Show(msg, "标题", MessageBoxButtons.OKCancel, MessageBoxIcon.Information, MessageBoxDefaultButton.Button1, MessageBoxOptions.ServiceNotification);
            if (result == DialogResult.OK)
            {
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> SaveJsonFile()
        {
            //TODO...
            return await Task.FromResult(false);
        }


    }
}
