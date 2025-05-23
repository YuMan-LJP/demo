using AutoPalyApp.Core.Dto;
using AutoPalyApp.Helper;
using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;

namespace AutoPalyApp
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
#if DEBUG
            MyLogHelper.Info("启动，前端项目端口是：http://localhost:8080/");
            // 开发时 使用前端项目自己的服务器地址
            webView21.Source = new Uri("http://localhost:8080/");
#else
            MyLogHelper.Info("启动，前端项目端口是：http://localhost:5000/");
            // 发布后, 会把html复制到 wwwroot 交给C#托管
            // 所以这里填 c# 服务器的地址
            webView21.Source = new Uri("http://localhost:5000");
#endif
        }

        /// <summary>
        /// 接收前端发出的消息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void webView21_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var text = e.TryGetWebMessageAsString();
            Console.WriteLine(text);

            var json = JsonConvert.SerializeObject(new { data1 = "后端发消息给前端", data2 = "测试123456" });
            webView21.CoreWebView2.PostWebMessageAsJson(json);
        }

        /// <summary>
        /// 发送消息给前端
        /// </summary>
        /// <param name="data"></param>
        public static bool SendMessageToWebView(WebViewMessageDto webViewMessage)
        {
            try
            {
                var json = JsonConvert.SerializeObject(webViewMessage);
                foreach (var form in Application.OpenForms)//找到当前已经打开的窗体
                {
                    if (form is Form1 form1)
                    {
                        //特别注意，直接使用会有异常：CoreWebView2 can only be accessed from the UI thread
                        //form1.webView21.CoreWebView2.PostWebMessageAsJson(json);

                        CommonHelper.SyncBeginInvoke(form1, delegate ()
                        {
                            form1.webView21.CoreWebView2.PostWebMessageAsJson(json);
                        });
                        MyLogHelper.Debug($"【SendMessageToWebView】[{webViewMessage.GUID}] {webViewMessage.EventKey} 发送消息给前端");
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                MyLogHelper.Error(ex);
                return false;
            }
        }

        private void menuStrip1_Item2_Click(object sender, EventArgs e)
        {
            //退出
        }

        private void menuStrip1_Item3_Click(object sender, EventArgs e)
        {
            //重新启动
        }

        private void menuStrip1_Item1_SubItem1_Click(object sender, EventArgs e)
        {
            //配置模拟器，端口等信息，支持多种模拟器，多开
        }

        private void menuStrip1_Item1_SubItem2_Click(object sender, EventArgs e)
        {
            //配置端口，默认5000端口启动后端接口，如果当前端口被占用，启动程序会报错，然后这里可以修改为其他可用端口
        }
    }
}
