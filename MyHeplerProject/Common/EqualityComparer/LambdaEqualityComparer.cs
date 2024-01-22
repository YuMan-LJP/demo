using System.Collections.Generic;
using System;

namespace Common.EqualityComparer
{
    public class LambdaEqualityComparer<T> : IEqualityComparer<T>
    {
        private readonly Func<T, T, bool> _lambdaComparer;
        private readonly Func<T, int> _lambdaHash;
        public LambdaEqualityComparer(Func<T, T, bool> lambdaComparer)
            : this(lambdaComparer, EqualityComparer<T>.Default.GetHashCode)
        {
        }
        public LambdaEqualityComparer(Func<T, T, bool> lambdaComparer, Func<T, int> lambdaHash)
        {
            _lambdaComparer = lambdaComparer ?? throw new ArgumentNullException(nameof(lambdaComparer));
            _lambdaHash = lambdaHash ?? throw new ArgumentNullException(nameof(lambdaHash));
        }

        public bool Equals(T x, T y)
        {
            return _lambdaComparer(x, y);
        }

        public int GetHashCode(T obj)
        {
            return _lambdaHash(obj);
        }
    }
}
