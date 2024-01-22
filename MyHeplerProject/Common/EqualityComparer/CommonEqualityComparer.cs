using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System;

namespace Common.EqualityComparer
{
    public class CommonEqualityComparer<T, V> : IEqualityComparer<T>
    {
        private Func<T, V> keySelector;
        private IEqualityComparer<V> comparer;

        public CommonEqualityComparer(Func<T, V> keySelector)
            : this(keySelector, EqualityComparer<V>.Default)
        {
        }

        public CommonEqualityComparer(Func<T, V> keySelector, IEqualityComparer<V> comparer)
        {
            this.keySelector = keySelector;
            this.comparer = comparer;
        }

        public bool Equals([AllowNull] T x, [AllowNull] T y)
        {
            return comparer.Equals(keySelector(x), keySelector(y));
        }

        public int GetHashCode([DisallowNull] T obj)
        {
            return comparer.GetHashCode(keySelector(obj));
        }
    }
}
