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
            MyLogHelper.Info("������ǰ����Ŀ�˿��ǣ�http://localhost:8080/");
            // ����ʱ ʹ��ǰ����Ŀ�Լ��ķ�������ַ
            webView21.Source = new Uri("http://localhost:8080/");
#else
            MyLogHelper.Info("������ǰ����Ŀ�˿��ǣ�http://localhost:5000/");
            // ������, ���html���Ƶ� wwwroot ����C#�й�
            // ���������� c# �������ĵ�ַ
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
