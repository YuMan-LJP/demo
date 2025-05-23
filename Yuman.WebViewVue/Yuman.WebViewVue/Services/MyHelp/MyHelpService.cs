using Yuman.WebViewVue.Services.MyHelp.Dto;

namespace Yuman.WebViewVue.Services.MyHelp
{
    public class MyHelpService : MyBaseService, IMyHelpService
    {
        public MyHelpService()
        {
        }

        /// <summary>
        /// 测试用的样例
        /// </summary>
        /// <param name="inputDto"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<TestObjData> GetSampleData(TestInputDto inputDto)
        {
            if (inputDto == null)
            {
                throw new Exception("测试报错");
            }
            var data = new TestObjData
            {
                Id = inputDto.Key + "111",
                Name = inputDto.Name,
            };
            return await Task.FromResult(data);
        }
    }
}
