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

            var builder = WebApplication.CreateBuilder();
            builder.WebHost.UseUrls("http://localhost:5000");//ָ�� C# ����Ķ˿�
            builder.Services.AddControllers();
#if DEBUG
            builder.Services.AddCors(options =>
            {
                //�������ã�����ʱ��Ҫ��ǰ�˱����ŵ�wwwroot����Ͳ���Ҫ����������
                options.AddDefaultPolicy(builder => builder.WithOrigins("http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
#endif

            var app = builder.Build();
#if DEBUG
            app.UseCors();//��������
#endif
            app.UseDefaultFiles();//��̬�ļ���� (index.html)
            app.UseStaticFiles();//��̬�ļ���� (wwwroot)
            app.MapControllers();
            app.Start();

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
    }
}