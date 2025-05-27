using Newtonsoft.Json.Linq;
using System.Collections;
using System.Reflection;

namespace Yuman.WebViewVue.Helper
{
    public static class ValidationHelper
    {
        public static List<string>? CheckForEmptyProperties(object obj, Func<string, string>? L)
        {
            return CheckForEmptyPropertiesRecursive(obj, L, null);
        }

        private static List<string>? CheckForEmptyPropertiesRecursive(
            object obj,
            Func<string, string>? L,
            string parentPath)
        {
            List<string> emptyProperties = new List<string>();
            if (obj == null) return emptyProperties;
            else if (IsCollectionType(obj.GetType()))
            {
                // 处理集合类型
                HandleCollection(obj, "List", emptyProperties, L);
            }
            else if (!IsComplexType(obj.GetType()))
            {
                return null;
            }

            PropertyInfo[] properties = obj.GetType().GetProperties(
            BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo property in properties)
            {
                string currentPath = BuildPath(parentPath, property.Name);
                object value = property.GetValue(obj);

                var requiredAttr = property.GetCustomAttribute<MyRequiredAttribute>();
                if (requiredAttr != null)
                {
                    bool isEmpty = CheckValueEmpty(value, requiredAttr);
                    if (!string.IsNullOrWhiteSpace(requiredAttr.TranslationKey))
                    {
                        if (L != null)
                        {
                            currentPath = L(requiredAttr.TranslationKey);
                        }
                        else
                        {
                            currentPath = requiredAttr.TranslationKey;
                        }
                    }
                    if (isEmpty) emptyProperties.Add(currentPath);
                }

                // 处理嵌套对象和集合
                if (value == null) continue;
                else if (IsCollectionType(property.PropertyType))
                {
                    // 处理集合类型
                    HandleCollection(value, currentPath, emptyProperties, L);
                }
                else if (IsComplexType(property.PropertyType))
                {
                    // 处理普通对象类型
                    var childErrors = CheckForEmptyPropertiesRecursive(value, L, currentPath);
                    emptyProperties.AddRange(childErrors);
                }
            }

            return emptyProperties;
        }

        private static void HandleCollection(
            object collection,
            string parentPath,
            List<string> emptyProperties,
            Func<string, string>? L)
        {
            var index = 0;
            foreach (var item in (IEnumerable)collection)
            {
                var itemPath = $"{parentPath}[{index}]";

                // 校验集合元素是否为null
                if (item == null)
                {
                    emptyProperties.Add(itemPath);
                    index++;
                    continue;
                }

                // 递归校验集合元素
                if (IsComplexType(item.GetType()))
                {
                    var childErrors = CheckForEmptyPropertiesRecursive(item, L, itemPath);
                    emptyProperties.AddRange(childErrors);
                }
                index++;
            }
        }

        private static string BuildPath(string parent, string current) =>
            string.IsNullOrEmpty(parent) ? current : $"{parent}.{current}";

        private static bool CheckValueEmpty(object value, MyRequiredAttribute attr)
        {
            if (value == null) return true;
            if (value is string str)
                return string.IsNullOrWhiteSpace(str);
            if (value is ICollection coll)
                return coll.Count == 0;
            return false;
        }

        private static bool IsComplexType(Type type) =>
            type.IsClass &&
            !type.IsValueType &&
            type != typeof(string);

        private static bool IsCollectionType(Type type) =>
            typeof(IEnumerable).IsAssignableFrom(type) &&
            type != typeof(string);
    }
}
