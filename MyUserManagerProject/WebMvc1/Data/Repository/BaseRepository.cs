using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace WebMvc1.Data.Repository
{
    public class BaseRepository<T> where T : class, new()
    {

        private readonly ApplicationDbContext _context;

        public BaseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async ValueTask<EntityEntry<T>> Insert(T entity)
        {
            return await _context.Set<T>().AddAsync(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public async Task<int> Update(Expression<Func<T, bool>> whereLambda, Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>> entity)
        {
            return await _context.Set<T>().Where(whereLambda).ExecuteUpdateAsync(entity);
        }

        public async Task<int> Delete(Expression<Func<T, bool>> whereLambda)
        {
            return await _context.Set<T>().Where(whereLambda).ExecuteDeleteAsync();
        }

        public async Task<bool> IsExist(Expression<Func<T, bool>> whereLambda)
        {
            return await _context.Set<T>().AnyAsync(whereLambda);
        }

        public async Task<T?> GetEntity(Expression<Func<T, bool>> whereLambda)
        {
            return await _context.Set<T>().AsNoTracking().FirstOrDefaultAsync(whereLambda);
        }

        public async Task<List<T>> Select()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<List<T>> Select(Expression<Func<T, bool>> whereLambda)
        {
            return await _context.Set<T>().Where(whereLambda).ToListAsync();
        }

        public async Task<Tuple<List<T>, int>> Select<S>(int pageSize, int pageIndex, Expression<Func<T, bool>> whereLambda, Expression<Func<T, S>> orderByLambda, bool isAsc)
        {
            var total = await _context.Set<T>().Where(whereLambda).CountAsync();

            if (isAsc)
            {
                var entities = await _context.Set<T>().Where(whereLambda)
                                      .OrderBy<T, S>(orderByLambda)
                                      .Skip(pageSize * (pageIndex - 1))
                                      .Take(pageSize).ToListAsync();

                return new Tuple<List<T>, int>(entities, total);
            }
            else
            {
                var entities = await _context.Set<T>().Where(whereLambda)
                                      .OrderByDescending<T, S>(orderByLambda)
                                      .Skip(pageSize * (pageIndex - 1))
                                      .Take(pageSize).ToListAsync();

                return new Tuple<List<T>, int>(entities, total);
            }
        }
    }
}
