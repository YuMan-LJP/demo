using Yuman.WebViewVue.Helper.BasicConfigure;
using Yuman.WebViewVue.Services.MyHelp.Dto;

namespace Yuman.WebViewVue.Services.MyHelp
{
    public interface IMyHelpService : ITransientDependency, IWebViewApi
    {
        Task<TestObjData> GetSampleData(TestInputDto inputDto);
    }
}
