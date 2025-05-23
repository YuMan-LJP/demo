using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using System.Text;
using Yuman.WebViewVue.Helper.MultipleLanguages;
using Yuman.WebViewVue.Services;

namespace Yuman.WebViewVue
{
    public partial class Form1 : Form
    {
        private readonly IOpenApiService _openApiService;

        // ͨ�����캯��ע������
        public Form1(IOpenApiService openApiService)
        {
            _openApiService = openApiService;

            InitializeComponent();
            InitWebViewAsync();
        }

        /// <summary>
        /// ��ʼ��WebView2�ؼ�
        /// </summary>
        private async void InitWebViewAsync()
        {
            await webView21.EnsureCoreWebView2Async(null);
            webView21.CoreWebView2.WebMessageReceived += WebView2_WebMessageReceived;
            webView21.CoreWebView2.DOMContentLoaded += WebView2_DOMContentLoaded;
            await webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(AddScripts());//ע��ȫ�ֱ���
            webView21.CoreWebView2.AddHostObjectToScript("openApi", _openApiService);//ע��ӿڵ�ǰ��
            var url = Path.Combine(AppContext.BaseDirectory, "index.html");
            webView21.Source = new Uri(url);
        }

        private void WebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            string message = e.TryGetWebMessageAsString(); // ��ȡ���� JavaScript ����Ϣ
            MessageBox.Show("Received message from JavaScript: " + message);
        }

        private void WebView2_DOMContentLoaded(object? sender, CoreWebView2DOMContentLoadedEventArgs e)
        {
            //ҳ�������֮�󴥷�
            //TODO...
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

        /// <summary>
        /// ��ҳ�濪ʼ����֮ǰ��Ҫ���ؽ�ҳ��ĸող���������������
        /// ����ƴ��������ҳ�棬����api����
        /// </summary>
        /// <returns></returns>
        private string AddScripts()
        {
            var scripts = new StringBuilder();
            scripts.AppendLine(LoadPages());
            scripts.AppendLine(LoadApis());
            scripts.AppendLine(LoadLanguages());
            return scripts.ToString();
        }

        /// <summary>
        /// ���ر���������ҳ
        /// </summary>
        /// <returns></returns>
        private string LoadPages()
        {
            try
            {
                var pageHtmls = new Dictionary<string, string>();
                var path = Path.Combine(AppContext.BaseDirectory, "_pages");
                var files = new DirectoryInfo(path).GetFiles("*.html");
                foreach (var file in files)
                {
                    using StreamReader sr = new(file.FullName, Encoding.GetEncoding("gb2312"));//ע�ⰴGB2312��ȡ����Ȼ��������
                    var html = new StringBuilder();
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        html.Append(line);
                    }
                    pageHtmls.Add(Path.GetFileNameWithoutExtension(file.Name), html.ToString());
                }

                return $"var yuman = yuman || {{}};yuman.initialPages = {JsonConvert.SerializeObject(pageHtmls)}";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "var yuman = yuman || {};yuman.initialPages = null";
            }
        }

        /// <summary>
        /// ����API�ӿ�
        /// </summary>
        /// <returns></returns>
        private string LoadApis()
        {
            //ǰ�˿���̨���ԣ�yuman.webview.MyHelpService.GetObjData2({Key:'aaa',Name:'333'}).then(res => { console.log(res) }).catch(err => { console.log(err) })
            var allJs = new StringBuilder();
            var allApis = MyServiceHelper.GetAllApis();
            allJs.AppendLine("var yuman = yuman || {};");
            allJs.AppendLine("yuman.webview = yuman.webview || {};");
            foreach (var api in allApis)
            {
                var parameters = api.MethodInfo.GetParameters()
                    .Select(p => p.Name)
                    .ToArray(); ;
                var js = new StringBuilder();
                js.AppendLine($"yuman.webview.{api.Type.Name} = yuman.webview.{api.Type.Name} || {{}};");
                js.AppendLine($"yuman.webview.{api.Type.Name}.{api.MethodInfo.Name} = function({string.Join(", ", parameters)}){{");
                js.AppendLine($"  return new Promise(function (resolve, reject){{");
                js.AppendLine($"    var myApiInputDto = {{ Class: \"{api.Type.Name}\", Method: \"{api.MethodInfo.Name}\" }}");
                foreach (var parameter in parameters)
                {
                    js.AppendLine($"    myApiInputDto.{parameter} = JSON.stringify({parameter})");
                }
                //js.AppendLine($"    console.log(\"api�ӿڲ���\", myApiInputDto);");
                js.AppendLine($"    window.chrome.webview.hostObjects.openApi.MyApi(JSON.stringify(myApiInputDto)).then(res => {{");//�����¼�������ʵ���첽
                //js.AppendLine($"      console.log(\"{api.MethodInfo.Name}\", res);");
                js.AppendLine($"      var result = JSON.parse(res)");
                js.AppendLine($"      if(result.isSuccess) {{");
                js.AppendLine($"        resolve(result.data);");
                js.AppendLine($"      }}");
                js.AppendLine($"      else {{");
                js.AppendLine($"        yuman.message.error(result.errorMessage, L('SystemTips'));");
                js.AppendLine($"        reject(result.errorMessage);");
                js.AppendLine($"      }}");
                js.AppendLine($"    }})");
                js.AppendLine($"    .catch(error => {{ console.error(\"{api.Type.Name} {api.MethodInfo.Name}\", error); }})");
                //js.AppendLine($"    .finally(() => console.log(\"{api.Type.Name} {api.MethodInfo.Name}�������\"))");
                js.AppendLine($"  }});");
                js.AppendLine($"}}");
                allJs.Append(js.ToString());
            }
            return allJs.ToString();
        }

        /// <summary>
        /// ���ض����ԣ���������
        /// </summary>
        /// <returns></returns>
        private string LoadLanguages()
        {
            var languages = new StringBuilder();//����������չ������
            var langDic = LanguageHelper.GetAllLanguages();
            languages.AppendLine($"yuman.languages = {JsonConvert.SerializeObject(langDic)};");
            languages.AppendLine($"yuman.currentLanguage = '{Thread.CurrentThread.CurrentUICulture.Name}';");
            languages.AppendLine("function L() {");
            languages.AppendLine("  if(!yuman.languages[yuman.currentLanguage]) return arguments[0];");
            languages.AppendLine("  if(!yuman.languages[yuman.currentLanguage][arguments[0]]) return arguments[0];");
            languages.AppendLine("  var translation = yuman.languages[yuman.currentLanguage][arguments[0]];");
            languages.AppendLine("  for (let i = 0; i < arguments.length;i++) {");
            languages.AppendLine("    if (i == 0) continue;");
            languages.AppendLine("    translation = translation.replace('{' + (i - 1) + '}', arguments[i]);");
            languages.AppendLine("  }");
            languages.AppendLine("  return translation;");
            languages.AppendLine("}");
            return languages.ToString();
        }
    }
}
