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

            var builder = WebApplication.CreateBuilder();
            builder.WebHost.UseUrls("http://localhost:5000");//指定 C# 服务的端口
            builder.Services.AddControllers();
#if DEBUG
            builder.Services.AddCors(options =>
            {
                //跨域配置，开发时需要，前端编译后放到wwwroot里面就不需要开启跨域了
                options.AddDefaultPolicy(builder => builder.WithOrigins("http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
#endif

            var app = builder.Build();
#if DEBUG
            app.UseCors();//跨域配置
#endif
            app.UseDefaultFiles();//静态文件相关 (index.html)
            app.UseStaticFiles();//静态文件相关 (wwwroot)
            app.MapControllers();
            app.Start();

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
    }
}