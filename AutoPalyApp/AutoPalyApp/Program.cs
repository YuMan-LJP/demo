using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoPalyApp.Helper;
using System.Reflection;

namespace AutoPalyApp
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //加载log4net配置
            log4net.Config.XmlConfigurator.ConfigureAndWatch(new FileInfo(AppDomain.CurrentDomain.BaseDirectory + @"\log4net.xml"));

            #region 初始化Web
            var webBuilder = WebApplication.CreateBuilder();
            webBuilder.WebHost.UseUrls("http://localhost:5000");//指定 C# 服务的端口
            webBuilder.Services.AddControllers(options =>
            {
                options.Filters.Add(new ExceptionFilter());//记录全局异常日志
            });
#if DEBUG
            webBuilder.Services.AddCors(options =>
            {
                //跨域配置，开发时需要，前端编译后放到wwwroot里面就不需要开启跨域了
                options.AddDefaultPolicy(webBuilder => webBuilder.WithOrigins("http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
#endif

            //给Web服务注册依赖注入
            webBuilder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
            webBuilder.Host.ConfigureContainer<ContainerBuilder>(builder =>
            {
                builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
                    .AsImplementedInterfaces()
                    .InstancePerLifetimeScope();
            });

            var webApp = webBuilder.Build();
#if DEBUG
            webApp.UseCors();//跨域配置
#endif
            webApp.UseDefaultFiles();//静态文件相关 (index.html)
            webApp.UseStaticFiles();//静态文件相关 (wwwroot)
            webApp.MapControllers();
            webApp.Start();
            #endregion

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
    }
}