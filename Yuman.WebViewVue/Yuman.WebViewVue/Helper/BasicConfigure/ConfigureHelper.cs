using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Yuman.WebViewVue.Managers;

namespace Yuman.WebViewVue.Helper.BasicConfigure
{
    public static class ConfigureHelper
    {
        public static T ConfigureServices<T>() where T : Form
        {
            // 创建依赖注入容器
            //Transient: 每次请求都创建新实例。
            //Scoped: 每个作用域内一个实例（在 WinForms 中通常用 Transient 或 Singleton）。
            //Singleton: 整个应用程序生命周期内一个实例。

            // 注册服务（例如，一个数据访问接口）
            //services.AddTransient<IJobInfoService, JobInfoService>();
            //services.AddTransient<IMyHelpService, MyHelpService>();
            //改为下面这种动态注入的方式，以后需要注入直接继承对应的接口即可，不需要来这里配置
            var services = new ServiceCollection();
            Assembly assembly = Assembly.GetExecutingAssembly();
            var types = assembly.GetTypes();
            foreach (var type in types)
            {
                if (!type.IsInterface)
                {
                    if (typeof(ITransientDependency).IsAssignableFrom(type))
                    {
                        var interFace = type.GetInterfaces().First();
                        services.AddTransient(interFace, type);
                    }
                    if (typeof(IScopedDependency).IsAssignableFrom(type))
                    {
                        var interFace = type.GetInterfaces().First();
                        services.AddScoped(interFace, type);
                    }
                    if (typeof(ISingletonDependency).IsAssignableFrom(type))
                    {
                        var interFace = type.GetInterfaces().First();
                        services.AddSingleton(interFace, type);
                    }
                }
            }

            // 注册主窗体（关键：窗体本身也需要注册到容器）
            services.AddTransient(typeof(T));
            services.AddScoped<MyEfContext>();

            var serviceProvider = services.BuildServiceProvider();// 构建 ServiceProvider
            var form = serviceProvider.GetRequiredService<T>();// 通过 DI 获取主窗体实例
            return form;
        }
    }
}
