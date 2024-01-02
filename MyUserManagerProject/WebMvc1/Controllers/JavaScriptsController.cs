using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using NUglify;
using System.Text;
using WebMvc1.Authorization;
using WebMvc1.Data;

namespace WebMvc1.Controllers
{
    public class JavaScriptsController : Controller
    {
        ILogger<JavaScriptsController> _logger;
        PermissionManager _permissionManager;
        UserManager<ApplicationUser> _userManager;

        public JavaScriptsController(
            ILogger<JavaScriptsController> logger,
            PermissionManager permissionManager,
            UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _permissionManager = permissionManager;
            _userManager = userManager;
        }

        public async Task<ActionResult> GetAllScripts(bool minify = false)
        {
            ApplicationUser? user = null;
            if (User != null)
            {
                user = await _userManager.GetUserAsync(User);
            }

            var sb = new StringBuilder();

            sb.AppendLine(await GetPermissionScripts(user));//获取用户所有权限
            sb.AppendLine();
            sb.AppendLine(GetConstantOperationNameScripts());//获取常量字符串
            sb.AppendLine();
            sb.AppendLine(GetUserInfoAsync(user));//获取用户信息
            sb.AppendLine();

            return Content(minify ? Minify(sb.ToString()) : sb.ToString(), "application/x-javascript", Encoding.UTF8);
        }

        protected virtual async Task<string> GetPermissionScripts(ApplicationUser? user)
        {
            IList<string> allPermissionNames;
            if (user == null)
            {
                allPermissionNames = new List<string>();//用户没有登录需要登录
            }
            else
            {
                allPermissionNames = await _permissionManager.GetAllPermissionByUserIdAsync(user);
            }
            
            var script = new StringBuilder();
            script.AppendLine("(function(){");
            script.AppendLine("  webmvc1.permission = webmvc1.permission || {};");//给全局webmvc1参数绑定permission对象
            script.AppendLine("    webmvc1.permission.values = {");//给webmvc1.permission对象绑定values对象
            foreach (var permissionName in allPermissionNames)
            {
                script.AppendLine($"      '{permissionName}': true,");
            }
            script.AppendLine("    };");
            script.AppendLine("    webmvc1.permission.isGranted = function (permissionName) { return webmvc1.permission.values[permissionName] != undefined; };");
            script.Append("})();");

            return script.ToString();
        }

        protected virtual string GetConstantOperationNameScripts()
        {
            var script = new StringBuilder();
            script.AppendLine("(function(){");
            script.AppendLine("  webmvc1.constant = webmvc1.constant || {};");//给全局webmvc1参数绑定constant对象
            script.AppendLine("  webmvc1.constant.operationName = webmvc1.constant.operationName || {};");//给webmvc1.constant对象绑定operationName对象
            var type = typeof(Constants.OperationName);
            var fields = type.GetFields();
            foreach (var field in fields)
            {
                script.AppendLine($"    webmvc1.constant.operationName.{field.Name.ToLower()} = '{field.GetRawConstantValue()}';");
            }
            script.Append("})();");

            return script.ToString();
        }

        protected virtual string GetUserInfoAsync(ApplicationUser? user)
        {
            if (user == null)
            {
                return "";
            }

            var script = new StringBuilder();
            script.AppendLine("(function(){");
            script.AppendLine("  webmvc1.userInfo = webmvc1.userInfo || {};");//给全局webmvc1参数绑定userInfo对象
            script.AppendLine($"  webmvc1.userInfo.id = '{user.Id}';");
            script.AppendLine($"  webmvc1.userInfo.userName = '{user.UserName}';");
            script.AppendLine($"  webmvc1.userInfo.name = '{user.Name}';");
            script.AppendLine($"  webmvc1.userInfo.customTag = '{user.CustomTag}';");
            script.Append("})();");

            return script.ToString();
        }

        private string Minify(string javaScriptCode)
        {
            if (string.IsNullOrWhiteSpace(javaScriptCode))
            {
                return "";
            }

            var result = Uglify.Js(javaScriptCode);
            if (!result.HasErrors)
            {
                return result.Code;
            }

            _logger.LogWarning($"Minify has encountered an error in handling javascript.");
            result.Errors.ForEach(error => _logger.LogWarning(error.ToString()));

            return javaScriptCode;
        }
    }
}
