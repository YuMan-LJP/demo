using System.Reflection;
using System.Text.RegularExpressions;

namespace WebMvc1.Dependency
{
    public static class RegisterDependencyService
    {
        public static IServiceCollection AddDependencyService(this IServiceCollection services)
        {
            //获取当前项目下继承于IScopeDependency、ISingletonDependency、ITransientDependency三个接口的所有实现类
            var implementTypes = Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.dll")
                .Where(w => Regex.IsMatch(Path.GetFileName(w), $"^{AppDomain.CurrentDomain.FriendlyName}.*", RegexOptions.IgnoreCase | RegexOptions.Compiled))
                .Select(Assembly.LoadFrom)
                .SelectMany(a => a.DefinedTypes)
                .Select(type => type.AsType())
                .Where(x => x.IsClass)
                .Where(x => typeof(IScopeDependency).IsAssignableFrom(x) || typeof(ISingletonDependency).IsAssignableFrom(x) || typeof(ITransientDependency).IsAssignableFrom(x))
                .ToList();
            foreach (var implementType in implementTypes)
            {
                //获取该类型实现的接口数组
                var interfaces = implementType.GetInterfaces();
                //如果该类的接口类除了默认的IScopeDependency、ISingletonDependency、ITransientDependency以外还有继承其他接口，则按接口的方式来注入，否则只注入自己的实现
                var interfaceType = interfaces.Where(w => w != typeof(IScopeDependency) && w != typeof(ISingletonDependency) && w != typeof(ITransientDependency)).FirstOrDefault(x => x.IsAssignableFrom(implementType));
                if (typeof(IScopeDependency).IsAssignableFrom(implementType))
                {
                    if (interfaceType != null)
                    {
                        services.AddScoped(interfaceType, implementType);
                    }
                    else
                    {
                        services.AddScoped(implementType);
                    }
                }
                else if (typeof(ISingletonDependency).IsAssignableFrom(implementType))
                {
                    if (interfaceType != null)
                    {
                        services.AddSingleton(interfaceType, implementType);
                    }
                    else
                    {
                        services.AddSingleton(implementType);
                    }
                }
                else if (typeof(ITransientDependency).IsAssignableFrom(implementType))
                {
                    if (interfaceType != null)
                    {
                        services.AddTransient(interfaceType, implementType);
                    }
                    else
                    {
                        services.AddTransient(implementType);
                    }
                }
            }

            return services;
        }
    }
}
