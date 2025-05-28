using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Diagnostics;
using System.Reflection;
using System.Text;
using Yuman.WebViewVue.Helper.MultipleLanguages;
using Yuman.WebViewVue.Managers;
using Yuman.WebViewVue.Managers.SystemSetting;
using Yuman.WebViewVue.Services;
using Yuman.WebViewVue.Services.Dto;

namespace Yuman.WebViewVue
{
    public partial class Form1 : Form
    {
        private const string VirtualHost = "embedded.res"; // ��������
        private const string ResourceNamespace = "Yuman.WebViewVue.wwwroot"; // �滻Ϊʵ�������ռ�

        private readonly IOpenApiService _openApiService;
        private readonly ISystemSettingManager _systemSettingManager;

        // ͨ�����캯��ע������
        public Form1(
            IOpenApiService openApiService,
            ISystemSettingManager systemSettingManager)
        {
            _openApiService = openApiService;
            _systemSettingManager = systemSettingManager;

            InitLanguageAsync();
            InitializeComponent();
            InitWebViewAsync();
        }

        /// <summary>
        /// ��ʼ������
        /// </summary>
        private async void InitLanguageAsync()
        {
            var defaultLanguage = await _systemSettingManager.GetSystemSettingAsync(nameof(MyConsts.SystemSetting.SystemSetting_Language));
            if (string.IsNullOrWhiteSpace(defaultLanguage))
            {
                defaultLanguage = MyConsts.SystemSetting.SystemSetting_Language;
            }
            LanguageHelper.ChangeCurrentLanguage(defaultLanguage);
        }

        /// <summary>
        /// ��ʼ��WebView2�ؼ�
        /// </summary>
        private async void InitWebViewAsync()
        {
            //�鿴ȫ��Ƕ����Դ�������Ų�����
            //var allResourceNames = Assembly.GetExecutingAssembly().GetManifestResourceNames().ToList();

            await webView21.EnsureCoreWebView2Async();

            // ע����������������ע�ᣬע���˾Ͳ������ص�WebResourceRequested�������ʹ��Ƕ����Դ��Ϊ�����ļ��������ã�
            //webView21.CoreWebView2.SetVirtualHostNameToFolderMapping(
            //    hostName: VirtualHost,
            //    folderPath: "wwwroot",
            //    accessKind: CoreWebView2HostResourceAccessKind.Allow);

            // ������ӹ�����
            webView21.CoreWebView2.AddWebResourceRequestedFilter(
                $"http://{VirtualHost}/*",
                CoreWebView2WebResourceContext.All);

            // ע����Դ��������
            webView21.CoreWebView2.WebResourceRequested += OnWebResourceRequested;
            webView21.CoreWebView2.WebMessageReceived += WebView2_WebMessageReceived;
            webView21.CoreWebView2.DOMContentLoaded += WebView2_DOMContentLoaded;
            await webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(AddScripts());//ע��ȫ�ֱ���
            webView21.CoreWebView2.AddHostObjectToScript("openApi", _openApiService);//ע��ӿڵ�ǰ��
            //var url = Path.Combine(AppContext.BaseDirectory, "wwwroot/index.html");
            //webView21.Source = new Uri(url);

            // �������ҳ��
            webView21.CoreWebView2.Navigate($"http://{VirtualHost}/index.html");

        }

        private void OnWebResourceRequested(object? sender, CoreWebView2WebResourceRequestedEventArgs e)
        {
            try
            {
                Uri uri = new Uri(e.Request.Uri);

                // ת��·����http://embedded.res/css/styles.css �� YourNamespace.Resources.css.styles.css
                string resourcePath = $"{ResourceNamespace}{UrlAdapter(uri.AbsolutePath).Replace("/", ".")}";

                //VS������ڲ鿴
                Debug.WriteLine(resourcePath);

                // �ӳ��򼯼�����Դ
                var assembly = Assembly.GetExecutingAssembly();
                using (Stream stream = assembly.GetManifestResourceStream(resourcePath))
                {
                    if (stream == null) return;

                    // ��ȡ���ݵ��ڴ���
                    MemoryStream ms = new MemoryStream();
                    stream.CopyTo(ms);
                    ms.Seek(0, SeekOrigin.Begin);

                    // ��ȡMIME����
                    string mime = GetMimeType(uri.AbsolutePath);

                    // ������Ӧ
                    var response = webView21.CoreWebView2.Environment.CreateWebResourceResponse(
                        Content: ms,
                        StatusCode: 200,
                        ReasonPhrase: "OK",
                        Headers: $"Content-Type: {mime}; charset=GBK");
                    // ��� CORS ͷ
                    response.Headers.AppendHeader("Access-Control-Allow-Origin", "*");
                    response.Headers.AppendHeader("Referrer-Policy", "strict-origin-when-cross-origin");

                    e.Response = response;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"��Դ����ʧ��: {ex.Message}");
            }
        }

        private string UrlAdapter(string url)
        {
            var urlItems = url.Split('/').ToList();
            if (urlItems.Count > 0)
            {
                for (var i = 0; i < urlItems.Count; i++)
                {
                    if (i != urlItems.Count - 1)//���������һ�����ַ����У��̸��滻Ϊ�»��ߣ���ΪǶ����Դ���棬�ļ����еĶ̸ܻ��Ϊ�»��ߣ��������һ��
                    {
                        urlItems[i] = urlItems[i].Replace("-", "_");
                    }
                }
                return string.Join("/", urlItems);
            }
            return url;
        }

        private string GetMimeType(string path)
        {
            return Path.GetExtension(path).ToLower() switch
            {
                ".html" => "text/html",
                ".css" => "text/css",
                ".js" => "application/javascript",
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".json" => "application/json",
                ".ico" => "image/x-icon",
                ".svg" => "image/svg+xml",
                ".woff" => "font/woff",
                ".woff2" => "font/woff2",
                ".ttf" => "font/ttf",
                _ => "application/octet-stream"
            };
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
            scripts.AppendLine(LoadLanguages());
            scripts.AppendLine(LoadPages());
            scripts.AppendLine(LoadApis());
            scripts.AppendLine(LoadPageCssAndJsFiles());
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
                //��Ϊ��Ƕ����Դ�ķ�ʽ�������Ҫ��ɱ����ļ��ķ�ʽ���Ͱ�ע�͵Ĵ��뻹ԭ�����ڵĴ���ע��
                var pageHtmls = new Dictionary<string, string>();
                //var path = Path.Combine(AppContext.BaseDirectory, Path.Combine("wwwroot", "pages"));
                //var files = new DirectoryInfo(path).GetFiles("*.html");
                var assembly = Assembly.GetExecutingAssembly();
                var files = assembly
                    .GetManifestResourceNames()
                    .Where(w => w.Contains(".html"))
                    .Where(w => w.StartsWith("Yuman.WebViewVue.wwwroot.pages"))
                    .ToList();
                foreach (var file in files)
                {
                    //using StreamReader sr = new(file.FullName, Encoding.GetEncoding("gb2312"));//ע�ⰴGB2312��ȡ����Ȼ��������
                    //var html = new StringBuilder();
                    //string line;
                    //while ((line = sr.ReadLine()) != null)
                    //{
                    //    html.Append(line);
                    //}
                    //pageHtmls.Add(Path.GetFileNameWithoutExtension(file.Name), html.ToString());
                    using var stream = assembly.GetManifestResourceStream(file);
                    using var reader = new StreamReader(stream, Encoding.GetEncoding("gb2312"));
                    string htmlContent = reader.ReadToEnd();
                    var name = file.Replace("Yuman.WebViewVue.wwwroot.pages.", "").Replace(".html", "");
                    pageHtmls.Add(name, htmlContent);
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
                    .ToArray();
                var optionsArgString = parameters?.Length > 0 ? ",options" : "options";
                var js = new StringBuilder();
                js.AppendLine($"yuman.webview.{api.Type.Name} = yuman.webview.{api.Type.Name} || {{}};");
                js.AppendLine($"yuman.webview.{api.Type.Name}.{api.MethodInfo.Name} = function({string.Join(", ", parameters)}{optionsArgString}){{");
                js.AppendLine($"  return new Promise(function (resolve, reject){{");
                js.AppendLine($"    var myApiInputDto = {{ Class: \"{api.Type.Name}\", Method: \"{api.MethodInfo.Name}\" }}");
                foreach (var parameter in parameters)
                {
                    js.AppendLine($"    myApiInputDto.{parameter} = JSON.stringify({parameter});");
                }
                js.AppendLine($"    if (options) {{ $.extend(myApiInputDto, options); }}");
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
            var jsString = allJs.ToString();
            return jsString;
        }

        /// <summary>
        /// ���ض����ԣ���������
        /// </summary>
        /// <returns></returns>
        private string LoadLanguages()
        {
            var jsonSetting = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()//����Ϊ�շ�������Ҳ����ǰ������������ĸ��ͷ����Сд
            };

            var languages = new StringBuilder();//����������չ������
            var langDic = LanguageHelper.GetAllLanguages();
            languages.AppendLine("var yuman = yuman || {};");
            languages.AppendLine($"yuman.languages = {JsonConvert.SerializeObject(langDic)};");
            languages.AppendLine($"yuman.languageSelect = {JsonConvert.SerializeObject(langDic.Select(s => new Select2ItemDto(s.Key, s.Key)), jsonSetting)};");
            languages.AppendLine($"yuman.currentLanguage = '{LanguageHelper.GetCurrentLanguageName()}';");
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

        /// <summary>
        /// ����pages�ļ��������css��js
        /// </summary>
        /// <returns></returns>
        private string LoadPageCssAndJsFiles()
        {
            var files = Assembly.GetExecutingAssembly()
                .GetManifestResourceNames()
                .Where(w => w.StartsWith("Yuman.WebViewVue.wwwroot.pages"))
                .Where(w => w.EndsWith(".js") || w.EndsWith(".css"))
                .ToList();
            var cssFiles = files.Where(w => w.EndsWith(".css")).ToList();
            var jsFiles = files.Where(w => w.EndsWith(".js")).ToList();
            var cssNames = new HashSet<string>();
            foreach (var cssFile in cssFiles)
            {
                cssNames.Add(cssFile.Replace("Yuman.WebViewVue.wwwroot.pages.", "http://embedded.res/pages/"));
            }
            var jsNames = new HashSet<string>();
            foreach (var jsFile in jsFiles)
            {
                jsNames.Add(jsFile.Replace("Yuman.WebViewVue.wwwroot.pages.", "http://embedded.res/pages/"));
            }

            var jsonSetting = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()//����Ϊ�շ�������Ҳ����ǰ������������ĸ��ͷ����Сд
            };
            var allJs = new StringBuilder();
            allJs.AppendLine("var yuman = yuman || {};");
            allJs.AppendLine("yuman.pageFile = yuman.pageFile || {};");
            allJs.AppendLine($"yuman.pageFile.css = {JsonConvert.SerializeObject(cssNames, jsonSetting)};");
            allJs.AppendLine($"yuman.pageFile.js = {JsonConvert.SerializeObject(jsNames, jsonSetting)};");
            return allJs.ToString();
        }
    }
}
