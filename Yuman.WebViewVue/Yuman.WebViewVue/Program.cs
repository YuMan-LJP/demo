using System.Text;
using Yuman.WebViewVue.Helper.BasicConfigure;

namespace Yuman.WebViewVue
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);//֧��GB2312����

            ApplicationConfiguration.Initialize();
            //Application.Run(new Form1());
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(ConfigureHelper.ConfigureServices<Form1>());
        }
    }
}