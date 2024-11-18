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
            //����log4net����
            log4net.Config.XmlConfigurator.ConfigureAndWatch(new FileInfo(AppDomain.CurrentDomain.BaseDirectory + @"\log4net.xml"));

            #region ��ʼ��Web
            var webBuilder = WebApplication.CreateBuilder();
            webBuilder.WebHost.UseUrls("http://localhost:5000");//ָ�� C# ����Ķ˿�
            webBuilder.Services.AddControllers(options =>
            {
                options.Filters.Add(new ExceptionFilter());//��¼ȫ���쳣��־
            });
#if DEBUG
            webBuilder.Services.AddCors(options =>
            {
                //�������ã�����ʱ��Ҫ��ǰ�˱����ŵ�wwwroot����Ͳ���Ҫ����������
                options.AddDefaultPolicy(webBuilder => webBuilder.WithOrigins("http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
#endif

            //��Web����ע������ע��
            webBuilder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
            webBuilder.Host.ConfigureContainer<ContainerBuilder>(builder =>
            {
                builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
                    .AsImplementedInterfaces()
                    .InstancePerLifetimeScope();
            });

            var webApp = webBuilder.Build();
#if DEBUG
            webApp.UseCors();//��������
#endif
            webApp.UseDefaultFiles();//��̬�ļ���� (index.html)
            webApp.UseStaticFiles();//��̬�ļ���� (wwwroot)
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