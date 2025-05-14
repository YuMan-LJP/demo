using Microsoft.Web.WebView2.Core;
using System.Timers;

namespace Yuman.WebViewVue
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            InitWebViewAsync();
        }

        private async void InitWebViewAsync()
        {
            await webView21.EnsureCoreWebView2Async(null);
            webView21.CoreWebView2.WebMessageReceived += WebView2_WebMessageReceived;
            var url = Path.Combine(AppContext.BaseDirectory, "index.html");
            webView21.Source = new Uri(url);
        }

        private void WebView2_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            string message = e.WebMessageAsJson; // 获取来自 JavaScript 的消息
            if (message == "\"sendMessage2\"")
            {
                CallJavaScriptFunction();
                SendMessageToJavaScript("开始计时");

                //测试
                int index = 1;
                System.Timers.Timer timer1 = new System.Timers.Timer();
                timer1.Interval = 1000;
                timer1.Elapsed += (object? sender, ElapsedEventArgs e) =>
                {
                    //注意在非当前页面线程执行，必须使用当前页面的Invoke方法（定时器的回调的线程不在当前页面）
                    this.Invoke(() =>
                    {
                        SendMessageToJavaScript(index.ToString());
                    });
                    index++;
                };
                timer1.Start();
            }
            else
            {
                MessageBox.Show("Received message from JavaScript: " + message);
            }
        }

        // C# 代码：向 JavaScript 发送消息
        public void SendMessageToJavaScript(string message)
        {
            webView21.CoreWebView2.PostWebMessageAsString(message);
        }

        // C# 代码：向 JavaScript 发送消息
        public void CallJavaScriptFunction()
        {
            string script = "displayMessageFromCSharp('Hello from C#');";
            webView21.CoreWebView2.ExecuteScriptAsync(script);
        }

    }
}
