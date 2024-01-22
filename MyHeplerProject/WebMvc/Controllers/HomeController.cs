using Common;
using Common.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using WebMvc.Models;

namespace WebMvc.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHostEnvironment _hostEnvironment;

        public HomeController(
            ILogger<HomeController> logger,
            IHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _hostEnvironment = hostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult ExcelRead1()
        {
            string path = $"{_hostEnvironment.ContentRootPath}\\Data\\TestFile\\Test1.xlsx";
            string fileEx = Path.GetExtension(path);

            using FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            var dt = ExcelHelper.ImportExcel(fs, fileEx);
            return Json(JsonConvert.SerializeObject(dt));
        }

        public IActionResult ExcelRead2()
        {
            string path = $"{_hostEnvironment.ContentRootPath}\\Data\\TestFile\\Test1.xlsx";
            string fileEx = Path.GetExtension(path);

            using FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            var dt = ExcelHelper.ReadExcelToDataTable(fs, fileEx);
            return Json(JsonConvert.SerializeObject(dt));
        }

        public IActionResult ExcelRead3()
        {
            string path = $"{_hostEnvironment.ContentRootPath}\\Data\\TestFile\\Test1.xlsx";
            string fileEx = Path.GetExtension(path);

            using FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            var dt = ExcelHelper.ReadExcelToDataTableBySheetName(fs, fileEx, "sheet2");

            return Json(JsonConvert.SerializeObject(dt));
        }

        public IActionResult ExcelOutput1()
        {
            var dt = GetTestData().ToDataTable();
            var header = GetExportHeader();

            var data = ExcelHelper.ExportExcel(dt, ".xlsx", header);
            return Json(data);
        }

        public IActionResult ExcelOutput2()
        {
            var dt = GetTestData().ToDataTable();
            var header = GetExportHeader();

            List<ExportExcelRequest> requests = new List<ExportExcelRequest>
            {
                new ExportExcelRequest {
                    Table = dt,
                    TableName = "User1",
                    FileExtension = ".xlsx",
                    Header = header
                },
                new ExportExcelRequest {
                    Table = dt,
                    TableName = "User2",
                    FileExtension = ".xlsx",
                    Header = header
                }
            };

            //自定义列为数值列
            Dictionary<string, string> customType = new Dictionary<string, string>
            {
                { "Age","Numeric" },
            };
            var data = ExcelHelper.ExportExcelEx(requests, customType);
            return File(data, "application/vnd.ms-excel", $"File{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        private Dictionary<string, string> GetExportHeader()
        {
            //Id，Password，UpdateTime，这3个字段不导出
            return new Dictionary<string, string>
            {
                { "UserName", "用户名" },
                { "EmailAddress", "邮箱" },
                { "Surname", "姓氏" },
                { "Name", "名字" },
                { "Age", "年龄" },
                { "DefaultLanuage", "默认语言" },
                { "Address", "地址" },
                { "PhoneNumber", "手机号码" },
                { "CreateTime", "创建时间" },
            };
        }

        private List<UserModel> GetTestData()
        {
            var list = new List<UserModel>
                {
                    new UserModel
                    {
                        Id = 1,
                        UserName = "Tom",
                        EmailAddress = "tom@tom.com",
                        Password = "123qwe!Q",
                        Surname = "Smith",
                        Name = "Tom",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "123456",
                        CreateTime = DateTime.Now.AddDays(-1),
                        UpdateTime = DateTime.Now,
                    },
                    new UserModel
                    {
                        Id = 2,
                        UserName = "Jack",
                        EmailAddress = "jack@jack.com",
                        Password = "123qwe!Q",
                        Surname = "Johnson",
                        Name = "Jack",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "132456",
                        CreateTime = DateTime.Now.AddDays(-1),
                        UpdateTime = DateTime.Now,
                    },
                    new UserModel
                    {
                        Id = 3,
                        UserName = "Peter",
                        EmailAddress = "peter@peter.com",
                        Password = "123qwe!Q",
                        Surname = "Williams",
                        Name = "Peter",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "145623",
                        CreateTime = DateTime.Now.AddDays(-1),
                        UpdateTime = DateTime.Now,
                    },
                    new UserModel
                    {
                        Id = 3,
                        UserName = "Angela",
                        EmailAddress = "angela@angela.com",
                        Password = "123qwe!Q",
                        Surname = "Taylor",
                        Name = "Angela",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "156342",
                        CreateTime = DateTime.Now.AddDays(-1),
                        UpdateTime = DateTime.Now,
                    }
            };
            return list;
        }

        public IActionResult ExcelOutput3()
        {
            var localTempDir = $@"{_hostEnvironment.ContentRootPath}\App_Data\TempFile";
            if (!Directory.Exists(localTempDir))
            {
                Directory.CreateDirectory(localTempDir);
            }

            var header = GetExportHeaderV2();
            using AutoSplitExcelWriter writer = new AutoSplitExcelWriter();

            //假设在大数据量的环境下导出，在后端分页，每次单独查询数据库获取要导出的数据，写入临时构造文件
            for (var i = 0; i < 10; i++)
            {
                var datas = GetTestDataV2();//获取需要导出的数据，这里只是举例数据写死，实际可以换成数据库查询
                writer.WriteCollection(datas, true, f => header.ContainsKey(f) ? header[f] : f);//descTranslationFunc指定切换显示表头的表达式，这里就是根据对象中的Description特性的值对应字典的key来拿到字典的Value
                GC.Collect();
            }

            string guid = Guid.NewGuid().ToString();
            writer.Save((fileIndex) =>
            {
                return new FileStream($"{localTempDir}\\{guid}", FileMode.Create);//将临时写入的文件生成到指定路径
            });

            return Json(guid);
        }

        public IActionResult DownloadFile(string key, string contentType, string fileName)
        {
            return File(new FileStream($@"{_hostEnvironment.ContentRootPath}\App_Data\TempFile\{key}", FileMode.Open, FileAccess.Read), contentType, fileName);
        }


        private Dictionary<string, string> GetExportHeaderV2()
        {
            //Id，Password，UpdateTime，这3个字段不导出
            return new Dictionary<string, string>
            {
                { "User Name", "用户名" },
                { "Email Address", "邮箱" },
                { "Surname", "姓氏" },
                { "Name", "名字" },
                { "Age", "年龄" },
                { "Default Lanuage", "默认语言" },
                { "Address", "地址" },
                { "Phone Number", "手机号码" },
                { "Create Time", "创建时间" },
            };
        }

        private List<UserModel> GetTestDataV2()
        {
            var list = new List<UserModel>();
            for (var i = 0; i < 1000; i++)
            {
                list.Add(new UserModel
                {
                    Id = i + 1,
                    UserName = $"Test{i}",
                    EmailAddress = $"Test{i}@Test{i}.com",
                    Password = "123qwe!Q",
                    Surname = $"Surname{i}",
                    Name = $"Name{i}",
                    Age = 18,
                    DefaultLanuage = "en",
                    Address = "USA",
                    PhoneNumber = i.ToString().PadLeft(6, '0'),
                    CreateTime = DateTime.Now.AddDays(-1),
                    UpdateTime = DateTime.Now,
                });
            }
            return list;
        }
    }
}
