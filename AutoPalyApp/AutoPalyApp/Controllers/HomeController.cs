using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;

namespace AutoPalyApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : MyControllerBase
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

#if DEBUG
        /// <summary>
        /// 测试后端发送消息通知给前端
        /// </summary>
        /// <returns></returns>
        public async Task<bool> TestApi()
        {
            Form1.SendMessageToWebView(new WebViewMessageDto("vueMessageEvent", new { Arg1 = "后端返回的参数1", Arg2 = "后端返回的参数2", arg3 = "后端返回的参数3" }));
            return await Task.FromResult(true);
        }
#endif
    }
}
