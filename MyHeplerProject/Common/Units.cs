using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Common.EqualityComparer;

namespace Common
{
    public static class Units
    {
        /// <summary>
        /// IEnumerable<T>转换成DataTable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="varlist"></param>
        /// <param name="useDescriptionToColumnName"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(this IEnumerable<T> varlist, bool useDescriptionToColumnName = false)
        {
            DataTable dtReturn = new DataTable();
            PropertyInfo[] oProps = null;
            if (varlist == null) return dtReturn;
            foreach (T rec in varlist)
            {
                if (oProps == null)
                {
                    oProps = rec.GetType().GetProperties();
                    foreach (PropertyInfo pi in oProps)
                    {
                        Type colType = pi.PropertyType;
                        if ((colType.IsGenericType) && (colType.GetGenericTypeDefinition() == typeof(Nullable<>)))
                        {
                            colType = colType.GetGenericArguments()[0];
                        }
                        dtReturn.Columns.Add(new DataColumn(pi.Name, colType));
                    }
                }
                DataRow dr = dtReturn.NewRow();
                foreach (PropertyInfo pi in oProps)
                {
                    dr[pi.Name] = pi.GetValue(rec, null) == null ? DBNull.Value : pi.GetValue(rec, null);
                }
                dtReturn.Rows.Add(dr);
            }
            if (useDescriptionToColumnName)
            {
                foreach (PropertyInfo pi in oProps)
                {
                    var description = pi.GetCustomAttributes<DescriptionAttribute>().FirstOrDefault();
                    if (description != null)
                    {
                        dtReturn.Columns[pi.Name].ColumnName = description.Description;
                    }
                }
            }
            return dtReturn;
        }

        /// <summary>
        /// 按换行分割字符串
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string[] SpitLineFeed(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }
            value = value.Replace("\r", "\n").Replace("\n\n", "\n").Replace("\r\n", "\n");
            return Regex.Split(value, "\n").Select(s => s.Trim()).Where(w => !string.IsNullOrEmpty(w)).ToArray();
        }

        /// <summary>
        /// Distinct扩展，支持按指定属性去重
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="V"></typeparam>
        /// <param name="source"></param>
        /// <param name="keySelector"></param>
        /// <returns></returns>
        public static IEnumerable<T> DistinctBy<T, V>(this IEnumerable<T> source, Func<T, V> keySelector)
        {
            return source.Distinct(new CommonEqualityComparer<T, V>(keySelector));
        }

        /// <summary>
        /// Distinct扩展，支持按指定属性去重，自定义比较器
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="V"></typeparam>
        /// <param name="source"></param>
        /// <param name="keySelector"></param>
        /// <param name="comparer"></param>
        /// <returns></returns>
        public static IEnumerable<T> DistinctBy<T, V>(this IEnumerable<T> source, Func<T, V> keySelector, IEqualityComparer<V> comparer)
        {
            return source.Distinct(new CommonEqualityComparer<T, V>(keySelector, comparer));
        }

        /// <summary>
        /// Distinct扩展，按类的所有属性去重，如果所有属性相等，则认为重复
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="comparer"></param>
        /// <returns></returns>
        public static IEnumerable<T> DistinctByAllProperty<T>(this IEnumerable<T> source)
            where T : class
        {
            return source.Distinct(new ClassPropertyEqualityComparer<T>());
        }

        /// <summary>
        /// DataTable转换成IEnumerable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataTable"></param>
        /// <returns></returns>
        public static IEnumerable<T> ToEnumerable<T>(this DataTable dataTable) where T : class, new()
        {
            return dataTable.AsEnumerable().Select(s => s.ToModel<T>());
        }

        /// <summary>
        /// DataRow转换成Model
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataRow"></param>
        /// <returns></returns>
        public static T ToModel<T>(this DataRow dataRow) where T : class, new()
        {
            T model = new T();
            foreach (var property in model.GetType().GetProperties())
            {
                foreach (DataColumn key in dataRow.Table.Columns)
                {
                    string columnName = key.ColumnName;
                    if (!string.IsNullOrEmpty(dataRow[columnName].ToString()))
                    {
                        string propertyNameToMatch = columnName;
                        if (property.Name.ToLower() == propertyNameToMatch.ToLower())
                        {
                            Type t = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                            object safeValue = (dataRow[columnName] == null) ? null : Convert.ChangeType(dataRow[columnName], t);
                            property.SetValue(model, safeValue, null);
                        }
                    }
                }
            }
            return model;
        }

        /// <summary>
        /// DataTable转换成IEnumerable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataTable"></param>
        /// <returns></returns>
        public static IEnumerable<T> ToEnumerable<T>(this DataTable dataTable, Dictionary<string, string> headers) where T : class, new()
        {
            return dataTable.AsEnumerable().Select(s => s.ToModel<T>(headers));
        }

        /// <summary>
        /// DataRow转换成Model
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataRow"></param>
        /// <returns></returns>
        public static T ToModel<T>(this DataRow dataRow, Dictionary<string, string> headers) where T : class, new()
        {
            T model = new T();
            foreach (var property in model.GetType().GetProperties())
            {
                foreach (DataColumn key in dataRow.Table.Columns)
                {
                    string columnName = key.ColumnName;
                    bool hasPerName = headers.Values.Where(s => s.ToLower() == columnName.ToLower()).Any();
                    var propertyNameToMatch = columnName;
                    if (hasPerName)
                    {
                        propertyNameToMatch = headers.Where(s => s.Value.ToLower() == columnName.ToLower()).FirstOrDefault().Key;
                    }

                    if (!string.IsNullOrEmpty(dataRow[columnName].ToString()))
                    {
                        if (property.Name.ToLower() == propertyNameToMatch.ToLower())
                        {
                            Type t = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                            object safeValue = (dataRow[columnName] == null) ? null : Convert.ChangeType(dataRow[columnName], t);
                            property.SetValue(model, safeValue, null);
                            break;
                        }
                    }
                }
            }
            return model;
        }

        /// <summary>
        /// 判断数据行是否无有效的数据数据
        /// </summary>
        /// <param name="row">要判断的数据行</param>
        /// <returns>true-不存在有效的数据，false-存在有效的数据</returns>
        public static bool IsNotValueRow(this DataRow row)
        {
            foreach (var item in row.ItemArray)
            {
                if (!string.IsNullOrWhiteSpace(item.ToStringEx()))
                {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// 判断数据行是否无有效的数据数据
        /// </summary>
        /// <param name="row">要判断的数据行</param>
        /// <param name="columns">要判定的数据列</param>
        /// <returns>true-不存在有效的数据，false-存在有效的数据</returns>
        public static bool IsNotValueRow(this DataRow row, List<DataColumn> columns)
        {
            foreach (var column in columns)
            {
                if (!string.IsNullOrWhiteSpace(row[column].ToStringEx()))
                {
                    return false;
                }
            }
            return true;
        }

        public static string ToHtmlTable(this DataTable dt, Dictionary<string, string> headers, bool isShowTitle = true)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("<div><table border='0' cellspacing='0' style='border-left: 1px solid #ccc;border-top: 1px solid #ccc;'>");

            if (isShowTitle)
            {
                sb.Append("<tr>");
                sb.Append("<th style='text-align: center;border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-size:12px;font-weight:600;padding:3px 10px'>#</th>");
                foreach (DataColumn column in dt.Columns)
                {
                    string title = column.ColumnName;
                    if (headers.Count > 0)
                    {
                        if (headers.ContainsKey(title))
                        {
                            title = headers[title];
                            sb.Append($"<th style='text-align: center;border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-size:12px;font-weight:600;padding:3px 10px'>{title}</th>");
                        }
                    }
                    else
                    {
                        //title = headers[title];
                        sb.Append($"<th style='text-align: center;border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-size:12px;font-weight:600;padding:3px 10px'>{title}</th>");
                    }

                }
                sb.Append("</tr>");
            }
            int iColsCount = dt.Columns.Count;
            int rowsCount = dt.Rows.Count - 1;
            for (int j = 0; j <= rowsCount; j++)
            {
                sb.Append("<tr>");
                sb.Append($"<td style='border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-weight:100;font-size:12px;padding:3px 10px;'>{((int)(j + 1)).ToString()}</td>");
                for (int k = 0; k <= iColsCount - 1; k++)
                {
                    string cloName = dt.Columns[k].ColumnName;
                    object obj = dt.Rows[j][k];
                    if (obj == DBNull.Value)
                    {
                        obj = " ";//如果是NULL则在HTML里面使用一个空格替换之
                    }
                    if (obj.ToString() == "")
                    {
                        obj = " ";
                    }
                    string strCellContent = (obj + "").Trim();
                    if (headers.Count > 0)
                    {
                        if (!headers.ContainsKey(cloName))
                        {
                            continue;
                        }
                        sb.Append("<td  style='border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-weight:100;font-size:12px;padding:3px 10px;text-align:left;'>");
                        sb.Append($"{strCellContent}");
                        sb.Append("</td>");
                    }
                    else
                    {
                        sb.Append("<td  style='border-bottom:1px solid #ccc;border-right:1px solid #ccc;font-weight:100;font-size:12px;padding:3px 10px;text-align:left;'>");
                        sb.Append($"{strCellContent}");
                        sb.Append("</td>");
                    }
                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");

            //点击单元格 输出 行和列
            return sb.ToString();
        }

        public static string ToHtmlTable(this DataTable dt, bool isShowTitle = true)
        {
            return dt.ToHtmlTable(new Dictionary<string, string>(), isShowTitle);
        }

        public static byte[] ToBytes(this Stream stream)
        {
            byte[] bytes = new byte[stream.Length];

            stream.Read(bytes, 0, bytes.Length);

            // 设置当前流的位置为流的开始 
            stream.Seek(0, SeekOrigin.Begin);

            return bytes;
        }

        public static Stream ToStream(this byte[] bytes)
        {
            Stream stream = new MemoryStream(bytes);
            return stream;
        }

        public static Stream FileToStream(string fileName)
        {
            // 打开文件
            FileStream fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
            // 读取文件的 byte[]
            byte[] bytes = new byte[fileStream.Length];
            fileStream.Read(bytes, 0, bytes.Length);
            fileStream.Close();
            // 把 byte[] 转换成 Stream
            Stream stream = new MemoryStream(bytes);
            return stream;
        }

        ///<summary>
        ///替换html中的特殊字符
        ///</summary>
        ///<paramname="theString">需要进行替换的文本。</param>
        ///<returns>替换完的文本。</returns>
        public static string HtmlEncode(string theString)
        {
            theString = theString.Replace(">", "&gt;");
            theString = theString.Replace("<", "&lt;");
            theString = theString.Replace(" ", "&nbsp;");
            theString = theString.Replace("\"", "&quot;");
            theString = theString.Replace("\'", "&#39;");
            theString = theString.Replace("\n", "<br/>");
            return theString;
        }

        ///<summary>
        ///恢复html中的特殊字符
        ///</summary>
        ///<paramname="theString">需要恢复的文本。</param>
        ///<returns>恢复好的文本。</returns>
        public static string HtmlDiscode(string theString)
        {
            theString = theString.Replace("&gt;", ">");
            theString = theString.Replace("&lt;", "<");
            theString = theString.Replace("&nbsp;", " ");
            theString = theString.Replace("&quot;", "\"");
            theString = theString.Replace("&#39;", "\'");
            theString = theString.Replace("<br/>", "\n");
            return theString;
        }

        /// <summary>
        /// 删除文件名称中的非法字符
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="throwExceptionIfEmptyResult"></param>
        /// <param name="defaultValueIfEmptyResult"></param>
        /// <returns></returns>
        public static string DeleteInvalidFileNameChar(this string fileName, bool throwExceptionIfEmptyResult = true, string defaultValueIfEmptyResult = "")
        {
            StringBuilder builder = new StringBuilder(fileName);
            var invalidPathChars = Path.GetInvalidFileNameChars();
            foreach (var invalidPathChar in invalidPathChars)
            {
                builder.Replace(invalidPathChar.ToString(), string.Empty);
            }
            var result = builder.ToString();
            if (string.IsNullOrEmpty(result))
            {
                if (throwExceptionIfEmptyResult)
                {
                    throw new Exception("文件名称删除非法字符之后为空");
                }
                else
                {
                    result = defaultValueIfEmptyResult;
                }
            }
            return result;
        }

        /// <summary>
        /// 创建新实例
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T CreateNewInstance<T>(this T _) where T : new()
        {
            return new T();
        }

        public static int HashStringToInt(params string[] strs)
        {
            var sign = 0;
            MD5 md5Hasher = MD5.Create();
            foreach (var str in strs)
            {
                if (string.IsNullOrEmpty(str))
                {
                    sign ^= 0;
                }
                var hashed = md5Hasher.ComputeHash(Encoding.UTF8.GetBytes(str));
                sign ^= BitConverter.ToInt32(hashed, 0);
            }
            return sign;
        }

        /// <summary>
        /// 获取字符串后4位
        /// </summary>
        /// <param name="str"></param>
        /// <param name="num"></param>
        /// <returns></returns>
        public static string GetLastStr(this string str, int num)
        {
            if (str?.Length > num)
            {
                str = str.Substring(str.Length - num, num);
            }
            return str;
        }

        /// <summary>
        /// 字符串比较忽略大小写，并且都转ToStringEx比较（null和字符串比较一样）
        /// </summary>
        /// <param name="str"></param>
        /// <param name="str2"></param>
        /// <returns></returns>
        public static bool EqualsIgnoreCase(this string str, string str2)
        {
            return str.ToStringEx().Equals(str2.ToStringEx(), StringComparison.OrdinalIgnoreCase);
        }

        public static byte[] HexStrTobyte(string hexString)
        {
            hexString = hexString.Replace(" ", "");
            if ((hexString.Length % 2) != 0) hexString += " ";
            byte[] returnBytes = new byte[hexString.Length / 2];
            for (int i = 0; i < returnBytes.Length; i++)
            {
                returnBytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2).Trim(), 16);
            }
            return returnBytes;
        }

        /// <summary>
        /// 分解数据表
        /// </summary>
        /// <param name="orgTable">需要分解的表</param>
        /// <param name="rowsNum">每个表包含的数据量</param>
        /// <returns></returns>
        public static DataSet SplitDataTable(DataTable orgTable, int rowsNum)
        {
            var ds = new DataSet();
            if (rowsNum <= 0 || orgTable.Rows.Count <= 0)
            {
                ds.Tables.Add(orgTable);
                return ds;
            }
            var tableNum = Convert.ToInt32(Math.Ceiling(orgTable.Rows.Count * 1.0 / rowsNum));
            var remainder = orgTable.Rows.Count % rowsNum;
            if (tableNum == 1)
            {
                ds.Tables.Add(orgTable);
            }
            else
            {
                for (var i = 0; i < tableNum; i++)
                {
                    var table = orgTable.Clone();
                    if (i != 0) table.TableName = $"{table.TableName}_{i + 1}";
                    int num;
                    if (i != tableNum - 1)
                        num = rowsNum;
                    else
                        num = remainder > 0 ? remainder : rowsNum;
                    for (var j = 0; j < num; j++)
                    {
                        var row = orgTable.Rows[i * rowsNum + j];
                        table.ImportRow(row);
                    }
                    ds.Tables.Add(table);
                }
            }
            return ds;
        }

        /// <summary>
        /// 半角转全角
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string ToSBC(this string input)
        {
            char[] c = input.ToCharArray();
            for (int i = 0; i < c.Length; i++)
            {
                if (c[i] == 32)
                {
                    c[i] = (char)12288;
                    continue;
                }
                if (c[i] < 127)
                {
                    c[i] = (char)(c[i] + 65248);
                }
            }
            return new string(c);
        }

        /// <summary>
        /// 全角转半角
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string ToDBC(this string input)
        {
            char[] c = input.ToCharArray();
            for (int i = 0; i < c.Length; i++)
            {
                if (c[i] == 12288)
                {
                    c[i] = (char)32;
                    continue;
                }
                if (c[i] > 65280 && c[i] < 65375)
                    c[i] = (char)(c[i] - 65248);
            }
            return new string(c);
        }
    }
}
