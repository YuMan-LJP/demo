using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Yuman.WebViewVue.Helper;
using Yuman.WebViewVue.Services.Dto;
using Yuman.WebViewVue.Services.MyHelp;
using Yuman.WebViewVue.Services.MyHelp.Dto;

namespace Yuman.WebViewVue.Services
{
    /// <summary>
    /// 特别注意，使用hostObjects的方法时，传入参数和返回值都是要是简单类型，不能是复杂类型（引用类型：对象之类的），不然处理起来非常麻烦，前端得到的是一个代理对象，后端返回值每个属性在前端都要单独取值，非常繁琐
    /// </summary>
    /// <returns></returns>
    public class OpenApiService : IOpenApiService
    {
        private readonly IMyHelpService _myHelpService;
        private readonly IServiceProvider _serviceProvider;

        public OpenApiService(
            IMyHelpService myHelpService,
            IServiceProvider serviceProvider)
        {
            _myHelpService = myHelpService;
            _serviceProvider = serviceProvider;
        }

        /// <summary>
        /// 样例接口
        /// </summary>
        /// <returns></returns>
        public string GetTestData()
        {
            return "测试数据JobInfo";
        }

        /// <summary>
        /// 样例接口
        /// </summary>
        /// <returns></returns>
        public string GetTestData2(string arg)
        {
            return "得到参数：" + arg;
        }

        /// <summary>
        /// 样例接口
        /// </summary>
        /// <returns></returns>
        public bool GetTestData3()
        {
            //测试前端调用后再手动发消息给前端
            return CommonHelper.SendMessageToWebPage("测试在服务类里面调用窗体方法发送消息给前端");
        }

        /// <summary>
        /// 样例接口
        /// </summary>
        /// <returns></returns>
        public async Task<string> MyHelpGetSampleData(string args)
        {
            var result = await _myHelpService.GetSampleData(JsonConvert.DeserializeObject<TestInputDto>(args));
            return JsonConvert.SerializeObject(result);
        }

        /// <summary>
        /// 动态调用接口，实现参数和返回值序列化和反序列化，还有统一处理异常
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task<string> MyApi(string message)
        {
            try
            {
                var parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>(message);

                var api = MyServiceHelper.GetAllApis()
                    .Where(w => w.Type.Name == parameters["Class"] && w.MethodInfo.Name == parameters["Method"])
                    .FirstOrDefault();
                if (api == null)
                {
                    return "";
                }
                // 要使用依赖注入创建新实例
                // 还要注意一点，依赖注入注册的是接口，然后【MyServiceHelper.GetAllApis】方法拿到的也必须是接口，不然注册的是接口，API拿的是实现，会报错，提示没有注册
                var instance = _serviceProvider.GetRequiredService(api.Type);//Activator.CreateInstance(api.Type);
                var methodParams = api.MethodInfo.GetParameters();
                object[]? args = null;
                if (methodParams.Length > 0)
                {
                    args = new object[methodParams.Length];
                    for (int i = 0; i < methodParams.Length; i++)
                    {
                        var param = methodParams[i];
                        if (parameters.TryGetValue(param.Name!, out var value))
                        {
                            args[i] = System.Text.Json.JsonSerializer.Deserialize(value, param.ParameterType, new System.Text.Json.JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true//忽略大小写，属性名不管大小写，前端属性名首字母都是小写，这里忽略大小写才能读到
                            });
                        }
                        else if (param.HasDefaultValue)
                        {
                            args[i] = param.DefaultValue;
                        }
                    }
                }

                var result = api.MethodInfo.Invoke(instance, args);

                // 处理异步方法
                if (result is Task task)
                {
                    //AsyncHelper.RunSync(() => task);//如果是同步方法里面要使用异步方法，可以这样写
                    await task;
                    result = task.GetType().GetProperty("Result")?.GetValue(task);
                }

                var apiResult = new ApiResultDto
                {
                    IsSuccess = true,
                    Data = result,
                    ErrorMessage = string.Empty,
                    IsException = false,
                };
                return JsonConvert.SerializeObject(apiResult, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()//设置为驼峰命名，也就是前端属性名首字母开头都是小写
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                var apiResult = new ApiResultDto
                {
                    IsSuccess = false,
                    Data = null,
                    ErrorMessage = ex.Message,
                    IsException = true,
                };
                return JsonConvert.SerializeObject(apiResult, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()// 设置为驼峰命名
                });
            }
        }
    }
}
