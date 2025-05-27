using Yuman.WebViewVue.Helper.BasicConfigure;

namespace Yuman.WebViewVue.Services
{
    public interface IOpenApiService : ITransientDependency
    {
        Task ChangeLanguage(string lang);
        string GetTestData();
        string GetTestData2(string arg);
        bool GetTestData3();
        Task<string> MyApi(string message);
        Task<string> MyHelpGetSampleData(string args);
    }
}
