namespace WinFormsApp1
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //创建web服务
            var builder = WebApplication.CreateBuilder();
            builder.WebHost.UseUrls("http://localhost:3000");
            builder.Services.AddControllers();
            var app = builder.Build();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapControllers();
            app.Start();

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
    }
}