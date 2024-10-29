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

        private void webView21_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var text = e.TryGetWebMessageAsString();
            Console.WriteLine(text);

            var json = JsonConvert.SerializeObject(new {  });
            webView21.CoreWebView2.PostWebMessageAsJson(json);
        }
    }
}
