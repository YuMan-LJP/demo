using Common.ObjectExtension;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ConsoleApp.CompareTest
{
    public static class Compare
    {
        public static void Test()
        {
            Compare1();

            Console.WriteLine("===========");

            Compare2();

            Console.WriteLine("===========");

            Compare3();

            Console.WriteLine("===========");

            Compare4();
        }

        /// <summary>
        /// 比较数据是否变化：最笨的方法，属性一个一个写
        /// </summary>
        static void Compare1()
        {
            Console.WriteLine("Compare1");
            var dbDatas = GetTestData1();
            var newDatas = GetTestData2();

            //新增数据
            var createDatas = newDatas.Where(w => !dbDatas.Any(a => a.UserName == w.UserName && a.EmailAddress == w.EmailAddress)).ToList();
            Console.WriteLine($"新增：{string.Join(",", createDatas.Select(s => s.Id))}");

            //删除数据
            var deleteDatas = dbDatas.Where(w => !newDatas.Any(a => a.UserName == w.UserName && a.EmailAddress == w.EmailAddress)).ToList();
            Console.WriteLine($"删除：{string.Join(",", deleteDatas.Select(s => s.Id))}");

            //修改数据
            var sameDatas = dbDatas.Join(newDatas,
                a => new { a.UserName, a.EmailAddress },
                b => new { b.UserName, b.EmailAddress },
                (r1, r2) => new { DbItem = r1, NewItem = r2 }).ToList();
            var updateDatas = new List<UserModel>();
            foreach (var item in sameDatas)
            {
                var isChange = false;
                if (item.DbItem.Surname != item.NewItem.Surname)
                {
                    item.DbItem.Surname = item.NewItem.Surname;
                    isChange = true;
                }
                if (item.DbItem.Name != item.NewItem.Name)
                {
                    item.DbItem.Name = item.NewItem.Name;
                    isChange = true;
                }
                if (item.DbItem.Age != item.NewItem.Age)
                {
                    item.DbItem.Age = item.NewItem.Age;
                    isChange = true;
                }
                if (item.DbItem.DefaultLanuage != item.NewItem.DefaultLanuage)
                {
                    item.DbItem.DefaultLanuage = item.NewItem.DefaultLanuage;
                    isChange = true;
                }
                if (item.DbItem.Address != item.NewItem.Address)
                {
                    item.DbItem.Address = item.NewItem.Address;
                    isChange = true;
                }
                if (item.DbItem.PhoneNumber != item.NewItem.PhoneNumber)
                {
                    item.DbItem.PhoneNumber = item.NewItem.PhoneNumber;
                    isChange = true;
                }
                if (isChange)
                {
                    updateDatas.Add(item.DbItem);
                }
            }
            Console.WriteLine($"数据有变化：{string.Join(",", updateDatas.Select(s => s.Id))}");

        }

        /// <summary>
        /// 使用签名法比较
        /// </summary>
        static void Compare2()
        {
            Console.WriteLine("Compare2");
            var dbDatas = GetTestData1();
            var newDatas = GetTestData2();

            //新增数据
            var createDatas = newDatas.Where(w => !dbDatas.Any(a => a.UserName == w.UserName && a.EmailAddress == w.EmailAddress)).ToList();
            Console.WriteLine($"新增：{string.Join(",", createDatas.Select(s => s.Id))}");

            //删除数据
            var deleteDatas = dbDatas.Where(w => !newDatas.Any(a => a.UserName == w.UserName && a.EmailAddress == w.EmailAddress)).ToList();
            Console.WriteLine($"删除：{string.Join(",", deleteDatas.Select(s => s.Id))}");

            //修改数据
            var updateDatas = dbDatas.Join(newDatas,
                a => new { a.UserName, a.EmailAddress },
                b => new { b.UserName, b.EmailAddress },
                (r1, r2) => new { DbItem = r1, NewItem = r2 })
                .Where(w => w.DbItem.CreateMD5() != w.NewItem.CreateMD5()).ToList();
            Console.WriteLine($"数据有变化：{string.Join(",", updateDatas.Select(s => s.DbItem.Id))}");
        }

        /// <summary>
        /// 使用封装的比较器来比较
        /// </summary>
        static void Compare3()
        {
            Console.WriteLine("Compare3");
            var dbDatas = GetTestData1();
            var newDatas = GetTestData2();

            var itemKeyProperties = new UserModel().GetPropertyNameByExpression(g => new { g.UserName, g.EmailAddress });
            var itemKeyComparer = new ObjectPropertyEqualityComparer<UserModel>(itemKeyProperties);
            var itemValueProperties = new UserModel().GetPropertyNameByExpression(g => new { g.Surname, g.Name, g.Age, g.DefaultLanuage, g.Address, g.PhoneNumber });
            var itemValueComparer = new ObjectPropertyEqualityComparer<UserModel>(itemValueProperties);

            //新增数据
            var createDatas = newDatas.Except(dbDatas, itemKeyComparer).ToList();
            Console.WriteLine($"新增：{string.Join(",", createDatas.Select(s => s.Id))}");

            //删除数据
            var deleteDatas = dbDatas.Except(newDatas, itemKeyComparer).ToList();
            Console.WriteLine($"删除：{string.Join(",", deleteDatas.Select(s => s.Id))}");

            //修改数据
            var updateDatas = dbDatas.Join(newDatas, o => o, i => i, (r1, r2) => new { DbItem = r1, NewItem = r2 }, itemKeyComparer)
                .Where(w => itemValueComparer.TryUpdatePropertyValueIfNotEquals(w.DbItem, w.NewItem))
                .ToList();
            Console.WriteLine($"数据有变化：{string.Join(",", updateDatas.Select(s => s.DbItem.Id))}");
        }

        /// <summary>
        /// 使用比较器特性来比较
        /// </summary>
        static void Compare4()
        {
            Console.WriteLine("Compare4");
            var dbDatas = GetTestData1();
            var newDatas = GetTestData2();
            
            //获取标记为[ObjectKeyProperty]特性的属性
            var keyPropertyComparer = new ObjectKeyPropertyEqualityComparer<UserModel>();
            //获取排除了[ObjectKeyProperty]特性的属性，同时也排除了[ObjectValuePropertyIgnore]特性的属性
            var valuePropertyComparer = new ObjectValuePropertyEqualityComparer<UserModel>();

            //新增数据
            var createDatas = newDatas.Except(dbDatas, keyPropertyComparer).ToList();
            Console.WriteLine($"新增：{string.Join(",", createDatas.Select(s => s.Id))}");

            //删除数据
            var deleteDatas = dbDatas.Except(newDatas, keyPropertyComparer).ToList();
            Console.WriteLine($"删除：{string.Join(",", deleteDatas.Select(s => s.Id))}");

            //修改数据
            var updateDatas = dbDatas.Join(newDatas, o => o, i => i, (r1, r2) => new { DbItem = r1, NewItem = r2 }, keyPropertyComparer)
                .Where(w => valuePropertyComparer.TryUpdatePropertyValueIfNotEquals(w.DbItem, w.NewItem))
                .ToList();
            Console.WriteLine($"数据有变化：{string.Join(",", updateDatas.Select(s => s.DbItem.Id))}");
        }

        /// <summary>
        /// 假如用户名+邮箱是唯一索引
        /// </summary>
        /// <returns></returns>
        private static List<UserModel> GetTestData1()
        {
            var list = new List<UserModel>
                {
                    new UserModel
                    {
                        Id = 1,
                        UserName = "Tom",
                        EmailAddress = "tom@tom.com",
                        Surname = "Smith",
                        Name = "Tom",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "123456",
                    },
                    new UserModel
                    {
                        Id = 2,
                        UserName = "Jack",
                        EmailAddress = "jack@jack.com",
                        Surname = "Johnson",
                        Name = "Jack",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "132456",
                    },
                    new UserModel
                    {
                        Id = 3,
                        UserName = "Peter",
                        EmailAddress = "peter@peter.com",
                        Surname = "Williams",
                        Name = "Peter",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "145623",
                    },
                    new UserModel
                    {
                        Id = 4,
                        UserName = "Angela",
                        EmailAddress = "angela@angela.com",
                        Surname = "Taylor",
                        Name = "Angela",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "156342",
                    }
            };
            return list;
        }

        /// <summary>
        /// 假如用户名+邮箱是唯一索引
        /// </summary>
        /// <returns></returns>
        private static List<UserModel> GetTestData2()
        {
            var list = new List<UserModel>
                {
                    new UserModel
                    {
                        Id = 11,//改了
                        UserName = "Tom",
                        EmailAddress = "tom@tom.com",
                        Surname = "Smith",
                        Name = "Tom",
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "123456",
                    },
                    new UserModel
                    {
                        Id = 2,
                        UserName = "Jack",
                        EmailAddress = "jack@jack.com",
                        Surname = "Johnson",
                        Name = "Jack",
                        Age = 16,//改了
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "132456",
                    },
                    new UserModel
                    {
                        Id = 5,//改了
                        UserName = "Liz",//改了
                        EmailAddress = "liz@liz.com",//改了
                        Surname = "Williams",
                        Name = "Liz",//改了
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "145623",
                    },
                    new UserModel
                    {
                        Id = 6,//改了
                        UserName = "Sam",//改了
                        EmailAddress = "sam@sam.com",//改了
                        Surname = "Taylor",
                        Name = "Sam",//改了
                        Age = 18,
                        DefaultLanuage = "en",
                        Address = "USA",
                        PhoneNumber = "156342",
                    }
            };
            return list;
        }
    }
}
