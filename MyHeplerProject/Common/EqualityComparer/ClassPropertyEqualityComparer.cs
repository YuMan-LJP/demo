using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Common.EqualityComparer
{
    public class ClassPropertyEqualityComparer<T> : IEqualityComparer<T>
        where T : class
    {
        public bool Equals([AllowNull] T x, [AllowNull] T y)
        {
            if (x == null || y == null)
            {
                return x == y;
            }
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                var xValue = property.GetValue(x, null);
                var yValue = property.GetValue(y, null);
                if (xValue == null || yValue == null)
                {
                    if (xValue != yValue)
                    {
                        return false;
                    }
                }
                else
                {
                    if (!xValue.Equals(yValue))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public int GetHashCode([DisallowNull] T obj)
        {
            int hashCode = default;
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                var value = property.GetValue(obj, null);
                if (value != null)
                {
                    hashCode ^= value.GetHashCode();
                }
            }
            return hashCode;
        }
    }
}
