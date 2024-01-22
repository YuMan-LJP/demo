using System;
using System.Globalization;

namespace Common
{
    public static class ConvertEx
    {
        public static string StringInputFilterExNotNull(this string input)
        {
            if (input == null) return "";
            string text = input.Trim().Trim('\r').Trim('\n').Trim('\t');
            return text;
        }

        public static string StringInputFilterExNotSpecialSpace(this string input)
        {
            if (input == null) return "";
            string text = input.Replace("\u00a0", " ").Replace("\u0020", " ").Replace("\u3000", " ");
            return text;
        }

        /// <summary>
        /// 对输入的内容进行首尾去空格，去除换行符
        /// </summary>
        /// <param name="input">输入的内容</param>
        /// <returns></returns>
        public static string StringInputFilterEx(this string input)
        {
            if (input == null) return null;
            string text = input.Trim().Trim('\r').Trim('\n').Trim('\t');
            return text;
        }

        /// <summary>
        /// 判断object类型值是否是null或者DBNull
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool IsNullOrDBNull(this object value)
        {
            if (value == null || Convert.IsDBNull(value))
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// 将object类型值转换为bool类型值，如果无法转换，则返回false
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool ToBooleanEx(this object value)
        {
            return value.ToStringEx().ToBooleanEx();
        }

        /// <summary>
        /// 将string类型值转换为bool类型值（1会转换成true），如果无法转换，则返回false
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool ToBooleanEx(this string value)
        {
            bool result = true;
            if (value != "1" && !bool.TryParse(value, out result))
            {
                return false;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为DateTime类型值，如果无法转换，则返回DateTime默认值
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime ToDateTimeEx(this object value)
        {
            return value.ToStringEx().ToDateTimeEx();
        }

        /// <summary>
        /// 将string类型值转换为DateTime类型值，如果无法转换，则返回DateTime默认值
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime ToDateTimeEx(this string value)
        {
            DateTime result;
            if (!DateTime.TryParse(value, out result))
            {
                return default(DateTime);
            }
            return result;
        }
        public static string ToStringEx(this DateTime dateTime, string pattern)
        {
            return dateTime.ToString(pattern);
        }

        public static string ToStringEx(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        }
        public static string ToStringEx(this DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                return dateTime.Value.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else
            {
                return string.Empty;
            }
        }
        public static string ToStringEx(this DateTime? dateTime, string pattern)
        {
            if (dateTime.HasValue)
            {
                return dateTime.Value.ToString(pattern);
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// 将object类型值转换为Decimal类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static decimal ToDecimalEx(this object value)
        {
            return value.ToStringEx().ToDecimalEx();
        }

        /// <summary>
        /// 将string类型值转换为Decimal类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static decimal ToDecimalEx(this string value)
        {
            decimal result = 0;
            if (!decimal.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为double类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static double ToDoubleEx(this object value)
        {
            return value.ToStringEx().ToDoubleEx();
        }

        /// <summary>
        /// 将string类型值转换为double类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static double ToDoubleEx(this string value)
        {
            double result = 0;
            if (!double.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为Guid类型值，如果无法转换，则返回Guid默认值
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Guid ToGuid(this object value)
        {
            return value.ToStringEx().ToGuid();
        }

        /// <summary>
        /// 将string类型值转换为Guid类型值，如果无法转换，则返回Guid默认值
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Guid ToGuid(this string value)
        {
            Guid result;
            if (!Guid.TryParse(value, out result))
            {
                return default(Guid);
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为short类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static short ToInt16Ex(this object value)
        {
            return value.ToStringEx().ToInt16Ex();
        }

        /// <summary>
        /// 将string类型值转换为short类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static short ToInt16Ex(this string value)
        {
            short result = 0;
            if (!short.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为int类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int ToInt32Ex(this object value)
        {
            return value.ToStringEx().ToInt32Ex();
        }

        /// <summary>
        /// 将string类型值转换为int类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int ToInt32Ex(this string value)
        {
            int result = 0;
            if (!int.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为long类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static long ToInt64Ex(this object value)
        {
            return value.ToStringEx().ToInt64Ex();
        }

        /// <summary>
        /// 将string类型值转换为long类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static long ToInt64Ex(this string value)
        {
            long result = 0;
            if (!long.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为string类型值，如果object是DBNull或null，则返回空字符串
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToStringEx(this object value)
        {
            return value.IsNullOrDBNull() ? "" : value.ToString();
        }

        /// <summary>
        /// 将object类型值转换为float类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static float ToSingleEx(this object value)
        {
            return value.ToStringEx().ToSingleEx();
        }

        /// <summary>
        /// 将string类型值转换为float类型值，如果无法转换，则返回0
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static float ToSingleEx(this string value)
        {
            float result = 0;
            if (!float.TryParse(value, NumberStyles.Number, CultureInfo.CurrentCulture, out result))
            {
                return 0;
            }
            return result;
        }

        /// <summary>
        /// 将object类型值转换为float类型值，如果无法转换，则返回原数据
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static object ToSingleExToObj(this object value)
        {
            if (!float.TryParse(value.ToStringEx(), NumberStyles.Number, CultureInfo.CurrentCulture, out float result))
            {
                return value;//转换失败
            }
            return result;
        }
    }
}
