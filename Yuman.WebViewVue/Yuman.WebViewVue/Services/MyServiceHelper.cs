using System.Reflection;
using Yuman.WebViewVue.Helper;

namespace Yuman.WebViewVue.Services
{
    public class MyServiceHelper
    {
        public static List<ApiInfo> _myAllApis = new List<ApiInfo>();

        public static List<ApiInfo> GetAllApis()
        {
            if (_myAllApis != null && _myAllApis.Count > 0)
            {
                return _myAllApis;//反射一次就缓存下来，不用每次都反射
            }

            var systemMethods = new List<string>
            {
                "GetType",
                "ToString",
                "Equals",
                "GetHashCode",
            };

            var apiInfos = new List<ApiInfo>();
            Assembly assembly = Assembly.GetExecutingAssembly();
            var types = assembly.GetTypes();
            foreach (var type in types)
            {
                if (type.IsInterface)
                {
                    if (typeof(IWebViewApi).IsAssignableFrom(type))
                    {
                        var methodInfos = type.GetMethods();
                        foreach (var methodInfo in methodInfos)
                        {
                            if (systemMethods.Contains(methodInfo.Name))
                            {
                                continue;
                            }
                            var apiInfo = new ApiInfo()
                            {
                                Type = type,
                                MethodInfo = methodInfo
                            };
                            apiInfos.Add(apiInfo);
                        }
                    }
                }
            }
            _myAllApis = apiInfos;
            return apiInfos;
        }

        public class ApiInfo
        {
            public Type Type { get; set; }

            public MethodInfo MethodInfo { get; set; }
        }
    }
}
