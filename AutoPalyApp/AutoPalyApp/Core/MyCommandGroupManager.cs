using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;
using AutoPalyApp.Helper;
using LiteDB;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoPalyApp.Core
{
    public class MyCommandGroupManager : MyManagerBase, IMyCommandGroupManager
    {
        #region 命令组
        public async Task<MyCommandGroupDto> GetCommandGroupByIdAsync(string jodId)
        {
            using var db = new MyEfContext();
            var main = await db.MyCommandGroups.Where(w => w.Id == jodId).ProjectToEx<MyCommandGroupDto>().SingleOrDefaultAsync();
            if (main == null)
            {
                throw new Exception("Command Group Not Found");
            }
            return main;
        }

        public async Task<List<MyCommandGroupDto>> GetCommandGroupListAsync()
        {
            using var db = new MyEfContext();
            var mains = await db.MyCommandGroups.ProjectToEx<MyCommandGroupDto>().ToListAsync();
            return mains;
        }

        public async Task<bool> SaveMyCommandGroupAsync(MyCommandGroup commandGroup)
        {
            using var db = new MyEfContext();
            var main = await db.MyCommandGroups.AsNoTracking().FirstOrDefaultAsync(s => s.Id == commandGroup.Id);
            if (main == null)
            {
                await db.MyCommandGroups.AddAsync(commandGroup);
            }
            else
            {
                db.MyCommandGroups.Update(commandGroup);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<List<SelectDto>> GetCommandGroupSelectListAsync()
        {
            using var db = new MyEfContext();
            return await db.MyCommandGroups.Select(s => new SelectDto(s.Id, s.Name)).ToListAsync();
        }
        #endregion

        #region 命令行
        public async Task<List<MyCommand>> GetCommandListAsync()
        {
            using var db = new LiteDatabase(MyConsts.MyLiteDatabase.ConnectionString);
            var collection = db.GetCollection<MyCommand>(MyConsts.MyLiteDatabase.TableName_Commands);
            var result = collection.FindAll();
            return await Task.FromResult(result.ToList());
        }

        public async Task<int> SaveCommandAsync(List<MyCommand> commands)
        {
            using var db = new LiteDatabase(MyConsts.MyLiteDatabase.ConnectionString);
            var collection = db.GetCollection<MyCommand>(MyConsts.MyLiteDatabase.TableName_Commands);
            var count = collection.Upsert(commands);
            return await Task.FromResult(count);
        } 
        #endregion

        public void SaveByLiteDb()
        {
            using var db = new LiteDatabase(MyConsts.MyLiteDatabase.ConnectionString);
            // 获取集合（相当于表）
            var collection = db.GetCollection<MyCommand>(MyConsts.MyLiteDatabase.TableName_Commands);

            var commands = new List<MyCommand>()
            {
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Children = [
                        new() { Id = Guid.NewGuid().ToString() }
                    ]
                },
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Children = [
                        new() {
                            Id = Guid.NewGuid().ToString(),
                            Children = [
                                new() { Id = Guid.NewGuid().ToString() }
                            ]
                        },
                    ]
                },
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Children = [
                        new() { Id = Guid.NewGuid().ToString() }
                    ]
                },
            };

            // 批量插入数据
            collection.Insert(commands);

            // 查询数据
            var result = collection.FindAll();
            var resultJson = JsonConvert.SerializeObject(result);

            // 根据条件查询数据
            var query = Query.EQ("_id", "c37f30e8-80bf-4093-89ff-3179338fa3a5");
            var result2 = collection.Find(query);
            var resultJson2 = JsonConvert.SerializeObject(result2);

            var result3 = collection.Find(f => f.Id == "c37f30e8-80bf-4093-89ff-3179338fa3a5");
            var resultJson3 = JsonConvert.SerializeObject(result3);

            //单个更新
            var result4 = collection.FindOne(f => f.Id == "c37f30e8-80bf-4093-89ff-3179338fa3a5");
            var resultJson4 = JsonConvert.SerializeObject(result4);
            result4.Label = "TEST";
            collection.Update(result4);

            //批量更新
            var result5 = collection.FindAll().ToList();
            var one = result5.FirstOrDefault();
            one.Label = "Test222";
            result5.Add(new MyCommand { Id = Guid.NewGuid().ToString() });
            collection.Upsert(result5);

            // 删除数据
            var deletedResult = collection.Delete("11ab0fc6-1b1e-42dd-97b0-da82915ac3dd");
        }
    }
}
