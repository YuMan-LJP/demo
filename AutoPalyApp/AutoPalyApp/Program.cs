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
            builder.Services.AddCors(options =>
            {
                //跨域配置
                options.AddPolicy("all", builder =>
                {
                    builder
                    .WithMethods("GET", "POST", "HEAD", "PUT", "DELETE", "OPTIONS")
                    .AllowAnyHeader()
                    .AllowAnyOrigin();
                    //.AllowCredentials()
                });
            });
            var app = builder.Build();
            app.UseCors("all");//跨域
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