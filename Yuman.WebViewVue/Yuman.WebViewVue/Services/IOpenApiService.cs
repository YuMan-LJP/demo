using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yuman.WebViewVue.Helper;

namespace Yuman.WebViewVue.Services
{
    public interface IOpenApiService : ITransientDependency
    {
        string GetTestData();
        string GetTestData2(string arg);
        bool GetTestData3();
        Task<string> MyApi(string message);
        Task<string> MyHelpGetSampleData(string args);
    }
}
