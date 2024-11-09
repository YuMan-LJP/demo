using AutoPalyApp.Helper;
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

        public async Task<int> TestApi()
        {
            using (MyEfContext db = new MyEfContext())
            {
                db.MyTriggerInfos.Add(new Core.Dto.MyTriggerInfo
                {
                    Id = "1",
                    CommandGroupId = "1",
                    Cron = "1",
                    Description = "1",
                    Group = "1",
                    Key = "1",
                    MainId = "1",
                });
                return await db.SaveChangesAsync();
            }
        }
    }
}
