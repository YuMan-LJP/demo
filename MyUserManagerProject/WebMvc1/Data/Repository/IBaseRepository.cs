using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace WebMvc1.Data.Repository
{
    public interface IBaseRepository<T> where T : class, new()
    {
        ValueTask<EntityEntry<T>> Insert(T entity);

        void Update(T entity);

        Task<int> Update(Expression<Func<T, bool>> whereLambda, Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>> entity);

        Task<int> Delete(Expression<Func<T, bool>> whereLambda);

        Task<bool> IsExist(Expression<Func<T, bool>> whereLambda);

        Task<T> GetEntity(Expression<Func<T, bool>> whereLambda);

        Task<List<T>> Select();

        Task<List<T>> Select(Expression<Func<T, bool>> whereLambda);

        Task<Tuple<List<T>, int>> Select<S>(int pageSize, int pageIndex, Expression<Func<T, bool>> whereLambda, Expression<Func<T, S>> orderByLambda, bool isAsc);
    }
}
