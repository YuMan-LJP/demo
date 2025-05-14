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
            string message = e.WebMessageAsJson; // ��ȡ���� JavaScript ����Ϣ
            if (message == "\"sendMessage2\"")
            {
                CallJavaScriptFunction();
                SendMessageToJavaScript("��ʼ��ʱ");

                //����
                int index = 1;
                System.Timers.Timer timer1 = new System.Timers.Timer();
                timer1.Interval = 1000;
                timer1.Elapsed += (object? sender, ElapsedEventArgs e) =>
                {
                    //ע���ڷǵ�ǰҳ���߳�ִ�У�����ʹ�õ�ǰҳ���Invoke��������ʱ���Ļص����̲߳��ڵ�ǰҳ�棩
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

        // C# ���룺�� JavaScript ������Ϣ
        public void SendMessageToJavaScript(string message)
        {
            webView21.CoreWebView2.PostWebMessageAsString(message);
        }

        // C# ���룺�� JavaScript ������Ϣ
        public void CallJavaScriptFunction()
        {
            string script = "displayMessageFromCSharp('Hello from C#');";
            webView21.CoreWebView2.ExecuteScriptAsync(script);
        }

    }
}
