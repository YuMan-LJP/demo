using Newtonsoft.Json;

namespace Yuman.WebViewVue.Helper
{
    /// <summary>
    /// 通用帮助类
    /// </summary>
    public static class CommonHelper
    {
        /// <summary>
        /// https://blog.csdn.net/woaixiaozhe/article/details/8187194
        /// webView21.CoreWebView2不允许窗体以外的线程调用，用这个帮助类可以实现外部线程调用窗体内的方法
        /// </summary>
        /// <param name="control"></param>
        /// <param name="del"></param>
        public static void SyncBeginInvoke(Form control, MethodInvoker del)
        {
            if ((control != null) && control.InvokeRequired)
                control.BeginInvoke(del, null);
            else
                del();
        }

        /// <summary>
        /// 发消息给前端
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static bool SendMessageToWebPage(object args)
        {
            try
            {
                foreach (var form in Application.OpenForms)//找到当前已经打开的窗体
                {
                    if (form is Form1 form1)
                    {
                        CommonHelper.SyncBeginInvoke(form1, () =>
                        {
                            form1.webView21.CoreWebView2.PostWebMessageAsString(JsonConvert.SerializeObject(args));
                        });
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
