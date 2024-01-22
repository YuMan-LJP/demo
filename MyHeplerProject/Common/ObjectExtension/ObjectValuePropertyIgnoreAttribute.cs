using System;

namespace Common.ObjectExtension
{
    /// <summary>
    /// 对象忽略作为value属性特性标记
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class ObjectValuePropertyIgnoreAttribute : Attribute
    {
    }
}
