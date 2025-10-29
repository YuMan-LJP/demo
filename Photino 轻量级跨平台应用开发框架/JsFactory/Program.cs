using JsFactory;
using Photino.Blazor;

public class Program
{
    [STAThread]//特别注意必须加这个特性，不然没有效果
    public static void Main(string[] args)
    {
        var appBuilder = PhotinoBlazorAppBuilder.CreateDefault(args);

        appBuilder.RootComponents.Add<App>("#app");

        var app = appBuilder.Build();

        app.MainWindow.SetTitle("Javascript Factory");

        AppDomain.CurrentDomain.UnhandledException += (sender, error) =>
        {
            //app.MainWindow.OpenAlertWindow("Fatal exception", error.ExceptionObject.ToString());
            Console.WriteLine(error.ExceptionObject.ToString());
        };

        app.Run();
    }
}