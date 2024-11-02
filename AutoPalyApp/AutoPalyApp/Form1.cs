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

            var json = JsonConvert.SerializeObject(new { data1 = "��˷���Ϣ��ǰ��", data2 = "����123456" });
            webView21.CoreWebView2.PostWebMessageAsJson(json);
        }

        /// <summary>
        /// ������Ϣ��ǰ��
        /// </summary>
        /// <param name="data"></param>
        public static bool SendMessageToWebView(WebViewMessageDto webViewMessage)
        {
            try
            {
                var json = JsonConvert.SerializeObject(webViewMessage);
                foreach (var form in Application.OpenForms)//�ҵ���ǰ�Ѿ��򿪵Ĵ���
                {
                    if (form is Form1 form1)
                    {
                        //�ر�ע�⣬ֱ��ʹ�û����쳣��CoreWebView2 can only be accessed from the UI thread
                        //form1.webView21.CoreWebView2.PostWebMessageAsJson(json);

                        CommonHelper.SyncBeginInvoke(form1, delegate ()
                        {
                            form1.webView21.CoreWebView2.PostWebMessageAsJson(json);
                        });
                        MyLogHelper.Debug($"��SendMessageToWebView��[{webViewMessage.GUID}] {webViewMessage.EventKey} ������Ϣ��ǰ��");
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
    }
}
