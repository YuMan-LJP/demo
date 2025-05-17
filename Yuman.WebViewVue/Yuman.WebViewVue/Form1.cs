using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using System.Text;
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
            webView21.CoreWebView2.DOMContentLoaded += WebView2_DOMContentLoaded;
            await webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(LoadPages());
            var url = Path.Combine(AppContext.BaseDirectory, "index.html");
            webView21.Source = new Uri(url);
        }

        private void WebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
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

        private void WebView2_DOMContentLoaded(object? sender, CoreWebView2DOMContentLoadedEventArgs e)
        {
            //ҳ�������֮�󴥷�
        }

        private string LoadPages()
        {
            try
            {
                var pageHtmls = new Dictionary<string, string>();
                var path = Path.Combine(AppContext.BaseDirectory, "pages");
                var files = new DirectoryInfo(path).GetFiles("*.html");
                foreach (var file in files)
                {
                    using StreamReader sr = new(file.FullName);
                    var html = new StringBuilder();
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        html.Append(line);
                    }
                    pageHtmls.Add(Path.GetFileNameWithoutExtension(file.Name), html.ToString());
                }

                return $"window.initialPages = {JsonConvert.SerializeObject(pageHtmls)}";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "window.initialPages = null";
            }
        }
    }
}
