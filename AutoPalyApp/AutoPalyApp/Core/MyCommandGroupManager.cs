using AutoPalyApp.Core.Dto;
using AutoPalyApp.Core.Entity;
using AutoPalyApp.Helper;
using Microsoft.EntityFrameworkCore;

namespace AutoPalyApp.Core
{
    public class MyCommandGroupManager : IMyCommandGroupManager
    {
        public async Task<MyCommandGroupDto> GetCommandGroupByIdAsync(string jodId, bool isIncludeItem = false)
        {
            using var db = new MyEfContext();
            var main = await db.MyCommandGroups.Where(w => w.Id == jodId).ProjectToEx<MyCommandGroupDto>().SingleOrDefaultAsync();
            if (main == null)
            {
                throw new Exception("Command Group Not Found");
            }
            main.Commands = await db.MyCommands.Where(w => w.ParentId == main.Id).ProjectToEx<MyCommandDto>().ToListAsync();
            return main;
        }

        public async Task<List<MyCommandGroupDto>> GetCommandGroupListAsync(bool isIncludeItem = false)
        {
            using var db = new MyEfContext();
            var mains = await db.MyCommandGroups.ProjectToEx<MyCommandGroupDto>().ToListAsync();
            if (isIncludeItem)
            {
                var ids = mains.Select(s => s.Id).ToList();
                var items = await db.MyCommands.Where(w => ids.Any(a => a == w.ParentId)).ProjectToEx<MyCommandDto>().ToListAsync();
                foreach (var main in mains)
                {
                    main.Commands = items.Where(w => w.ParentId == main.Id).ToList();
                }
            }
            return mains;
        }

        /// <summary>
        /// 提前多查一层，第三层需要前端点第二层的详情的时候再往下查，避免一次性拿出太多数据
        /// </summary>
        /// <param name="mainId"></param>
        /// <returns></returns>
        public async Task<List<MyCommandDto>> GetCommandByParentIdListAsync(string parentId, bool isIncludeItem = false)
        {
            using var db = new MyEfContext();
            var mains = await db.MyCommands.Where(w => w.ParentId == parentId).ProjectToEx<MyCommandDto>().ToListAsync();
            if (isIncludeItem)
            {
                var ids = mains.Select(s => s.Id).ToList();
                var items = await db.MyCommands.Where(w => ids.Any(a => a == w.ParentId)).ProjectToEx<MyCommandDto>().ToListAsync();
                foreach (var main in mains)
                {
                    main.Commands = items.Where(w => w.ParentId == main.Id).ToList();
                }
            }
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

        public async Task<bool> SaveMyCommandItemAsync(MyCommand command)
        {
            using var db = new MyEfContext();
            var data = await db.MyCommands.AsNoTracking().FirstOrDefaultAsync(s => s.Id == command.Id);
            if (data == null)
            {
                await db.MyCommands.AddAsync(command);
            }
            else
            {
                db.MyCommands.Update(command);
            }
            var res = await db.SaveChangesAsync();
            return res > 0;
        }

        public async Task<bool> DeleteMyCommandGroupAsync(string id)
        {
            using var db = new MyEfContext();
            var data = await db.MyCommandGroups.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (data != null)
            {
                db.MyCommandGroups.Remove(data);

                var items = await db.MyCommands.Where(w => w.ParentId == id).Select(s => s).AsNoTracking().ToListAsync();
                db.MyCommands.RemoveRange(items);

                var res = await db.SaveChangesAsync();
                return res > 0;
            }
            return false;
        }

        public async Task<bool> DeleteMyCommandItemAsync(string id)
        {
            using var db = new MyEfContext();
            var data = await db.MyCommands.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (data != null)
            {
                db.MyCommands.Remove(data);

                var items = await db.MyCommands.Where(w => w.ParentId == id).Select(s => s).AsNoTracking().ToListAsync();
                //这里要递归查询，并删除子类里面的子类，子子类还有子类，或者设置外建关联，删除主数据，子数据一并自动删除，TODO...
                db.MyCommands.RemoveRange(items);

                var res = await db.SaveChangesAsync();
                return res > 0;
            }
            return false;
        }

        public async Task<List<SelectDto>> GetCommandGroupSelectListAsync()
        {
            using var db = new MyEfContext();
            return await db.MyCommandGroups.Select(s => new SelectDto(s.Id, s.Name)).ToListAsync();
        }
    }
}
