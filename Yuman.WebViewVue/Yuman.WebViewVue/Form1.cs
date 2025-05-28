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
        private const string VirtualHost = "embedded.res"; // 虚拟域名
        private const string ResourceNamespace = "Yuman.WebViewVue.wwwroot"; // 替换为实际命名空间

        private readonly IOpenApiService _openApiService;
        private readonly ISystemSettingManager _systemSettingManager;

        // 通过构造函数注入依赖
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
        /// 初始化语言
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
        /// 初始化WebView2控件
        /// </summary>
        private async void InitWebViewAsync()
        {
            //查看全部嵌入资源，方便排查问题
            //var allResourceNames = Assembly.GetExecutingAssembly().GetManifestResourceNames().ToList();

            await webView21.EnsureCoreWebView2Async();

            // 注册虚拟域名（不能注册，注册了就不能拦截到WebResourceRequested，如果不使用嵌入资源改为本地文件可以启用）
            //webView21.CoreWebView2.SetVirtualHostNameToFolderMapping(
            //    hostName: VirtualHost,
            //    folderPath: "wwwroot",
            //    accessKind: CoreWebView2HostResourceAccessKind.Allow);

            // 必须添加过滤器
            webView21.CoreWebView2.AddWebResourceRequestedFilter(
                $"http://{VirtualHost}/*",
                CoreWebView2WebResourceContext.All);

            // 注册资源请求拦截
            webView21.CoreWebView2.WebResourceRequested += OnWebResourceRequested;
            webView21.CoreWebView2.WebMessageReceived += WebView2_WebMessageReceived;
            webView21.CoreWebView2.DOMContentLoaded += WebView2_DOMContentLoaded;
            await webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(AddScripts());//注入全局变量
            webView21.CoreWebView2.AddHostObjectToScript("openApi", _openApiService);//注入接口到前端
            //var url = Path.Combine(AppContext.BaseDirectory, "wwwroot/index.html");
            //webView21.Source = new Uri(url);

            // 加载入口页面
            webView21.CoreWebView2.Navigate($"http://{VirtualHost}/index.html");

        }

        private void OnWebResourceRequested(object? sender, CoreWebView2WebResourceRequestedEventArgs e)
        {
            try
            {
                Uri uri = new Uri(e.Request.Uri);

                // 转换路径：http://embedded.res/css/styles.css → YourNamespace.Resources.css.styles.css
                string resourcePath = $"{ResourceNamespace}{UrlAdapter(uri.AbsolutePath).Replace("/", ".")}";

                //VS输出窗口查看
                Debug.WriteLine(resourcePath);

                // 从程序集加载资源
                var assembly = Assembly.GetExecutingAssembly();
                using (Stream stream = assembly.GetManifestResourceStream(resourcePath))
                {
                    if (stream == null) return;

                    // 读取内容到内存流
                    MemoryStream ms = new MemoryStream();
                    stream.CopyTo(ms);
                    ms.Seek(0, SeekOrigin.Begin);

                    // 获取MIME类型
                    string mime = GetMimeType(uri.AbsolutePath);

                    // 构建响应
                    var response = webView21.CoreWebView2.Environment.CreateWebResourceResponse(
                        Content: ms,
                        StatusCode: 200,
                        ReasonPhrase: "OK",
                        Headers: $"Content-Type: {mime}; charset=GBK");
                    // 添加 CORS 头
                    response.Headers.AppendHeader("Access-Control-Allow-Origin", "*");
                    response.Headers.AppendHeader("Referrer-Policy", "strict-origin-when-cross-origin");

                    e.Response = response;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"资源加载失败: {ex.Message}");
            }
        }

        private string UrlAdapter(string url)
        {
            var urlItems = url.Split('/').ToList();
            if (urlItems.Count > 0)
            {
                for (var i = 0; i < urlItems.Count; i++)
                {
                    if (i != urlItems.Count - 1)//将不是最后一个的字符串中，短杠替换为下划线，因为嵌入资源里面，文件夹中的短杠会变为下划线，这里兼容一下
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
            string message = e.TryGetWebMessageAsString(); // 获取来自 JavaScript 的消息
            MessageBox.Show("Received message from JavaScript: " + message);
        }

        private void WebView2_DOMContentLoaded(object? sender, CoreWebView2DOMContentLoadedEventArgs e)
        {
            //页面加载完之后触发
            //TODO...
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

        /// <summary>
        /// 在页面开始创建之前需要加载进页面的刚刚参数、变量、方法
        /// 例如拼接其他子页面，加载api方法
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
        /// 加载本地其他分页
        /// </summary>
        /// <returns></returns>
        private string LoadPages()
        {
            try
            {
                //改为了嵌入资源的方式，如果需要变成本地文件的方式，就把注释的代码还原，现在的代码注释
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
                    //using StreamReader sr = new(file.FullName, Encoding.GetEncoding("gb2312"));//注意按GB2312读取，不然中文乱码
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
        /// 加载API接口
        /// </summary>
        /// <returns></returns>
        private string LoadApis()
        {
            //前端控制台测试：yuman.webview.MyHelpService.GetObjData2({Key:'aaa',Name:'333'}).then(res => { console.log(res) }).catch(err => { console.log(err) })
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
                //js.AppendLine($"    console.log(\"api接口参数\", myApiInputDto);");
                js.AppendLine($"    window.chrome.webview.hostObjects.openApi.MyApi(JSON.stringify(myApiInputDto)).then(res => {{");//构造事件监听，实现异步
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
                //js.AppendLine($"    .finally(() => console.log(\"{api.Type.Name} {api.MethodInfo.Name}调用完成\"))");
                js.AppendLine($"  }});");
                js.AppendLine($"}}");
                allJs.Append(js.ToString());
            }
            var jsString = allJs.ToString();
            return jsString;
        }

        /// <summary>
        /// 加载多语言（待开发）
        /// </summary>
        /// <returns></returns>
        private string LoadLanguages()
        {
            var jsonSetting = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()//设置为驼峰命名，也就是前端属性名首字母开头都是小写
            };

            var languages = new StringBuilder();//后续可以拓展多语言
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
        /// 加载pages文件夹里面的css和js
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
                ContractResolver = new CamelCasePropertyNamesContractResolver()//设置为驼峰命名，也就是前端属性名首字母开头都是小写
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
