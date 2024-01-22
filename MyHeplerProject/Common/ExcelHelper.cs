using System.Collections.Generic;
using System.Data;
using System.IO;
using System;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
using System.Globalization;
using System.Collections;
using Common.Dto;

namespace Common
{
    public class ExcelHelper
    {
        #region 导入
        /// <summary>
        /// 导入Excel
        /// </summary>
        /// <param name="stream">文件流</param>
        /// <param name="fileExtension">后缀名</param>
        /// <param name="filterNotDataSheet">是否过滤没有数据的sheet页</param>
        /// <param name="isReadHiddenSheet">是否读取隐藏的sheet页，默认不读</param>
        /// <returns></returns>
        public static DataSet ImportExcel(Stream stream, string fileExtension, bool filterNotDataSheet = true, bool isReadHiddenSheet = false, bool isReadNumWithFormat = false)
        {
            DataSet getSet()
            {
                DataSet ds = new DataSet();
                IWorkbook workbook;
                switch (fileExtension.ToStringEx().ToLower())
                {
                    case ".xls":
                        workbook = new HSSFWorkbook(stream);
                        break;
                    case ".xlsx":
                        workbook = new XSSFWorkbook(stream);
                        break;
                    default:
                        throw new Exception(string.Format("不支持读取{0}格式！", fileExtension));
                }
                for (int i = 0; i < workbook.NumberOfSheets; i++)
                {
                    if (workbook.IsSheetHidden(i) && !isReadHiddenSheet)
                    {
                        continue;//当前sheet是隐藏的，但是不读隐藏的，跳过当前sheet
                    }
                    ISheet sheet = workbook.GetSheetAt(i);
                    var table = ReadSheetToDataTable(sheet, 0, isReadNumWithFormat);

                    if (!filterNotDataSheet || table.Rows.Count >= 1)
                    {
                        ds.Tables.Add(table);
                    }
                }
                return ds;
            }
            DataSet set = getSet();
            GC.Collect();
            return set;
        }

        /// <summary>
        /// 导入Excel
        /// </summary>
        /// <param name="stream">文件流</param>
        /// <param name="fileExtension">后缀名</param>
        /// <param name="sheetIndex">Sheet页位置</param>
        /// <param name="headerRowNum">表头行位置，小于0表示不使用Excel数据作为表头</param>
        /// <param name="isReadHiddenSheet">是否读取隐藏的sheet页，默认不读</param>
        /// <returns></returns>
        public static DataTable ReadExcelToDataTable(Stream stream, string fileExtension, int sheetIndex = 0, int headerRowNum = 0, bool isReadHiddenSheet = false, bool isReadNumWithFormat = false)
        {
            DataTable getTable()
            {

                IWorkbook workbook;
                switch (fileExtension.ToStringEx().ToLower())
                {
                    case ".xls":
                        workbook = new HSSFWorkbook(stream);
                        break;
                    case ".xlsx":
                        workbook = new XSSFWorkbook(stream);
                        break;
                    case ".xlsm":
                        workbook = new XSSFWorkbook(stream);
                        break;
                    default:
                        throw new Exception(string.Format("不支持读取{0}格式！", fileExtension));
                }

                #region 取有效的页序号
                var visibleSheetIndexs = new List<int>();//当前可见的sheet页序号
                for (var i = 0; i < workbook.NumberOfSheets; i++)
                {
                    if (workbook.IsSheetHidden(i) && !isReadHiddenSheet)
                    {
                        continue;//当前sheet是隐藏的，但是不读隐藏的，跳过当前sheet
                    }
                    visibleSheetIndexs.Add(i);
                }
                if (visibleSheetIndexs.Count < sheetIndex + 1)
                {
                    throw new Exception($"读取的Excel没有第{sheetIndex + 1}页");
                }
                sheetIndex = visibleSheetIndexs[sheetIndex];//如果Excel隐藏了一页，可见页只有一页，sheetIndex传0，实际读取的是Excel的sheetIndex=1页
                #endregion

                ISheet sheet = workbook.GetSheetAt(sheetIndex);

                return ReadSheetToDataTable(sheet, headerRowNum, isReadNumWithFormat);

            }
            DataTable table = getTable();
            GC.Collect();
            return table;
        }

        /// <summary>
        /// 导入Excel
        /// </summary>
        /// <param name="stream">文件流</param>
        /// <param name="fileExtension">后缀名</param>
        /// <param name="sheetName">Sheet页名称，为空或找不到时默认取第一个sheet（如果指定的sheetName隐藏了而且不读隐藏页时，也默认取第一个可见sheet）</param>
        /// <param name="headerRowNum">表头行位置，小于0表示不使用Excel数据作为表头</param>
        /// <param name="isReadHiddenSheet">是否读取隐藏的sheet页，默认不读</param>
        /// <returns></returns>
        public static DataTable ReadExcelToDataTableBySheetName(Stream stream, string fileExtension, string sheetName = "", int headerRowNum = 0, bool isReadHiddenSheet = false)
        {
            DataTable getTable()
            {

                IWorkbook workbook;
                switch (fileExtension.ToStringEx().ToLower())
                {
                    case ".xls":
                        workbook = new HSSFWorkbook(stream);
                        break;
                    case ".xlsx":
                        workbook = new XSSFWorkbook(stream);
                        break;
                    case ".xlsm":
                        workbook = new XSSFWorkbook(stream);
                        break;
                    default:
                        throw new Exception(string.Format("不支持读取{0}格式！", fileExtension));
                }

                #region 取指定有效sheet页
                ISheet sheet = null;
                if (!string.IsNullOrWhiteSpace(sheetName))
                {
                    sheet = workbook.GetSheet(sheetName);
                    if (sheet != null)
                    {
                        if (workbook.IsSheetHidden(workbook.GetSheetIndex(sheet)) && !isReadHiddenSheet)
                        {
                            sheet = null;
                        }
                    }
                }

                if (sheet == null)//以上拿不到指定的sheet，默认取第一页有效sheet页
                {
                    for (var i = 0; i < workbook.NumberOfSheets; i++)
                    {
                        if (workbook.IsSheetHidden(i) && !isReadHiddenSheet)
                        {
                            continue;//当前sheet是隐藏的，但是不读隐藏的，跳过当前sheet
                        }
                        sheet = workbook.GetSheetAt(i);
                        break;
                    }
                }
                #endregion

                //var sheet = workbook.GetSheetAt(0);
                //if (!string.IsNullOrWhiteSpace(sheetName))
                //{
                //    var sheet2 = workbook.GetSheet(sheetName);
                //    if (sheet2 != null)
                //    {
                //        sheet = sheet2;
                //    }
                //}

                return ReadSheetToDataTable(sheet, headerRowNum);

            }
            DataTable table = getTable();
            GC.Collect();
            return table;
        }

        /// <summary>
        /// 读取Sheet页并转换成DataTable对象
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="headerRowNum"></param>
        /// <param name="isReadNumWithFormat"></param>
        /// <returns></returns>
        private static DataTable ReadSheetToDataTable(ISheet sheet, int headerRowNum, bool isReadNumWithFormat = false)
        {
            DataTable table = new DataTable(sheet.SheetName);
            Dictionary<int, int> columnCellIndexMapperDic = new Dictionary<int, int>();
            IEnumerator rows = sheet.GetRowEnumerator();
            while (rows.MoveNext())
            {
                IRow row = (IRow)rows.Current;

                #region 创建列
                if (headerRowNum < 0 && table.Columns.Count == 0) //不使用Excel数据作为表头
                {
                    for (int j = 0; j < row.LastCellNum; j++)
                    {
                        table.Columns.Add(ToLetters(j), typeof(string));
                        columnCellIndexMapperDic.Add(table.Columns.Count - 1, j);
                    }
                }
                else if (row.RowNum < headerRowNum)//当前行位置小于指定作为表头的行位置，直接跳过忽略
                {
                    continue;
                }
                else if (row.RowNum == headerRowNum)//当前行位置等于指定作为表头的行位置，创建DataTable列
                {
                    for (int j = 0; j < row.LastCellNum; j++)
                    {
                        ICell cell = row.GetCell(j);
                        if (cell != null && !string.IsNullOrWhiteSpace(cell.ToString()) && cell.ToString().Trim() != "\u001d")
                        {
                            table.Columns.Add(cell.ToString().Trim(), typeof(string));
                            columnCellIndexMapperDic.Add(table.Columns.Count - 1, j);
                        }
                    }
                    continue;
                }
                #endregion

                #region 新增行
                DataRow dr = table.NewRow();
                for (int j = 0; j < table.Columns.Count; j++)
                {
                    var cellIndex = columnCellIndexMapperDic[j];
                    ICell cell = row.GetCell(cellIndex);
                    if (cell == null)
                    {
                        dr[j] = null;
                    }
                    else
                    {
                        dr[j] = GetCellValue(cell, isReadNumWithFormat);
                    }
                }
                table.Rows.Add(dr);
                #endregion
            }
            return table;
        }

        /// <summary>
        /// 对单元格进行判断取值
        /// </summary>
        /// <param name="cell"></param>
        /// <returns></returns>
        public static string GetCellValue(ICell cell, bool isReadNumWithFormat = false)
        {
            if (cell == null)
                return string.Empty;
            switch (cell.CellType)
            {
                case CellType.Blank: //空数据类型 这里类型注意一下，不同版本NPOI大小写可能不一样,有的版本是Blank（首字母大写)
                    return string.Empty;
                case CellType.Boolean: //bool类型
                    return cell.BooleanCellValue.ToString();
                case CellType.Error:
                    return cell.ErrorCellValue.ToString();
                case CellType.Numeric: //数字类型
                    if (DateUtil.IsCellDateFormatted(cell))//日期类型
                    {
                        string formatString = cell.CellStyle.GetDataFormatString();
                        short dataFormat = cell.CellStyle.DataFormat;
                        switch (dataFormat)
                        {
                            case 14:
                            case 31:
                            case 57:
                            case 58:
                                return cell.DateCellValue.ToString();
                            //case 177:
                            //case 179:
                            //    return cell.DateCellValue.ToString("yyyy年M月d日");
                            //case 178:
                            //    return cell.DateCellValue.ToString("yyyy年M月");
                            default:
                                var dataTime = DateUtil.GetJavaDate(cell.NumericCellValue);
                                if (formatString == "m/d/yyyy\\ h:mm:ss")
                                {
                                    //注意Excel文件的m/d/yyyy\\ h:mm:ss格式要对应C#的M/d/yyyy\\ H:mm:ss，m和h的大小写在C#与Excel中的含义不一样
                                    return dataTime.ToString("M/d/yyyy\\ H:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                                }
                                //if (formatString == "m\\/d\\/yyyy")
                                //{
                                //    return dataTime.ToString("M/d/yyyy");
                                //}
                                //return dataTime.ToString(formatString);
                                formatString = formatString.Replace("m", "M").Replace(";@", "");//C#的月份用M表示
                                return dataTime.ToString(formatString, System.Globalization.CultureInfo.InvariantCulture);
                        }
                    }
                    if (isReadNumWithFormat)//是否按原本格式读取数字
                    {
                        string formatString = cell.CellStyle.GetDataFormatString();
                        short dataFormat = cell.CellStyle.DataFormat;
                        switch (dataFormat)
                        {
                            default:
                                if (formatString == "\"$\"#,##0.00")
                                {
                                    return new DataFormatter().FormatCellValue(cell);//按原本Excel自定义的$#,##0.00格式来进行格式化后并返回
                                }
                                return cell.NumericCellValue.ToString();
                        }
                    }
                    return cell.NumericCellValue.ToString(CultureInfo.InvariantCulture);//其它数字，注意忽略语言特性，越南文等语言环境下会点变成逗号
                case CellType.Unknown: //无法识别类型
                default: //默认类型
                    return cell.ToString();//
                case CellType.String: //string 类型
                    return cell.StringCellValue;
                case CellType.Formula: //带公式类型
                    try
                    {
                        if (cell.Sheet.Workbook is HSSFWorkbook)
                        {
                            HSSFFormulaEvaluator e = new HSSFFormulaEvaluator(cell.Sheet.Workbook);
                            e.EvaluateInCell(cell);
                        }
                        else
                        {
                            XSSFFormulaEvaluator e = new XSSFFormulaEvaluator(cell.Sheet.Workbook);
                            e.EvaluateInCell(cell);
                        }
                    }
                    catch
                    {
                        //吞掉异常
                    }
                    return cell.ToString();
            }
        }

        /// <summary>
        /// 将数字转换为字母（A、B、C...）
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        private static string ToLetters(int index)
        {
            List<string> chars = new List<string>();
            do
            {
                if (chars.Count > 0) index--;
                chars.Insert(0, ((char)(index % 26 + (int)'A')).ToString());
                index = (int)((index - index % 26) / 26);
            } while (index > 0);

            return string.Join(string.Empty, chars.ToArray());
        }
        #endregion

        #region 导出
        /// <summary>
        /// 导出Excel
        /// </summary>
        /// <param name="table"></param>
        /// <param name="fileExtension"></param>
        /// <returns></returns>
        public static byte[] ExportExcel(DataTable table, string fileExtension)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>();
            for (int i = 0; i < table.Columns.Count; i++)
            {
                headers.Add(table.Columns[i].ColumnName, table.Columns[i].ColumnName);
            }
            return ExportExcel(new ExportExcelRequest { Table = table, FileExtension = fileExtension, Header = headers });
        }

        /// <summary>
        /// 导出Excel
        /// </summary>
        /// <param name="table"></param>
        /// <param name="fileExtension"></param>
        /// <returns></returns>
        public static byte[] ExportExcel(DataTable table, string fileExtension, Dictionary<string, string> headers)
        {
            return ExportExcel(new ExportExcelRequest { Table = table, FileExtension = fileExtension, Header = headers });
        }

        public static byte[] ExportExcel(ExportExcelRequest request)
        {
            byte[] getBytes()
            {
                DataTable table = request.Table;
                string fileExtension = request.FileExtension;
                Dictionary<string, string> headers = request.Header;
                IWorkbook workbook;
                switch (fileExtension.ToStringEx().ToLower())
                {
                    case ".xls":
                        workbook = new HSSFWorkbook();
                        break;
                    case ".xlsx":
                        workbook = new XSSFWorkbook();
                        break;
                    default:
                        throw new Exception(string.Format("不支持导出{0}格式！", fileExtension));
                }
                ISheet sheet = workbook.CreateSheet("Sheet1");
                IRow rowHead = sheet.CreateRow(0);
                int z = 0;
                foreach (string title in headers.Keys)
                {
                    string text = headers[title];
                    var b = rowHead.CreateCell(z, CellType.String);
                    b.SetCellValue(text);
                    sheet.AutoSizeColumn(z);
                    z++;
                }

                for (int j = 0; j < table.Rows.Count; j++)
                {
                    DataRow row = table.Rows[j];
                    IRow rowData = sheet.CreateRow(j + 1);
                    int k = 0;
                    foreach (var keyName in headers)
                    {
                        string colName = keyName.Key;

                        if (row[colName] == DBNull.Value || row[colName] == null)
                        {
                            rowData.CreateCell(k, CellType.String).SetCellValue("");
                        }
                        else
                        {
                            var cell = rowData.CreateCell(k, CellType.String);
                            cell.SetCellValue(row[colName].ToString());
                        }

                        k++;
                    }
                }
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    return ms.ToArray();
                }
            }
            var bys = getBytes();
            GC.Collect();
            return bys;
        }

        /// <summary>
        /// 导出一个dataset多个页面的文件
        /// </summary>
        /// <param name="requests"></param>
        /// <returns></returns>
        public static byte[] ExportExcel(List<ExportExcelRequest> requests)
        {
            byte[] getBytes()
            {
                string fileExtension = requests[0].FileExtension;
                IWorkbook workbook;
                switch (fileExtension.ToStringEx().ToLower())
                {
                    case ".xls":
                        workbook = new HSSFWorkbook();
                        break;
                    case ".xlsx":
                        workbook = new XSSFWorkbook();
                        break;
                    default:
                        throw new Exception(string.Format("不支持导出{0}格式！", fileExtension));
                }


                for (var i = 0; i < requests.Count; i++)
                {
                    var request = requests[i];
                    string tableName = request.TableName;
                    DataTable table = request.Table;
                    if (string.IsNullOrEmpty(tableName)) { tableName = string.IsNullOrEmpty(table.TableName) ? $"Sheet{i + 1}" : table.TableName; }


                    Dictionary<string, string> headers = request.Header;
                    if (headers == null || headers.Count == 0)
                    {
                        headers = new Dictionary<string, string>();
                        for (int j = 0; j < table.Columns.Count; j++)
                        {
                            headers.Add(table.Columns[j].ColumnName, table.Columns[j].ColumnName);
                        }
                    }
                    ISheet sheet = workbook.CreateSheet(tableName);
                    IRow rowHead = sheet.CreateRow(0);
                    int z = 0;
                    foreach (string title in headers.Keys)
                    {
                        string text = headers[title];
                        rowHead.CreateCell(z, CellType.String).SetCellValue(text);
                        sheet.AutoSizeColumn(z);
                        z++;
                    }


                    for (int j = 0; j < table.Rows.Count; j++)
                    {
                        DataRow row = table.Rows[j];
                        IRow rowData = sheet.CreateRow(j + 1);
                        int k = 0;
                        foreach (var keyName in headers)
                        {
                            string colName = keyName.Key;

                            if (row[colName] == DBNull.Value || row[colName] == null)
                            {
                                rowData.CreateCell(k, CellType.String).SetCellValue("");
                            }
                            else
                            {
                                rowData.CreateCell(k, CellType.String).SetCellValue(row[colName].ToString());
                            }
                            k++;
                        }
                    }
                }


                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    return ms.ToArray();
                }

            }
            var bys = getBytes();
            GC.Collect();
            return bys;
        }

        /// <summary>
        /// 拓展导出Excel方法，自定义列值类型，参照CellType("Numeric","String")，目前仅支持数值列
        /// </summary>
        /// <param name="table"></param>
        /// <param name="fileExtension"></param>
        /// <param name="customType">列名，类型名称</param>
        /// <returns></returns>
        public static byte[] ExportExcelEx(DataTable table, string fileExtension, Dictionary<string, string> customType)
        {
            IWorkbook workbook;
            switch (fileExtension.ToStringEx().ToLower())
            {
                case ".xls":
                    workbook = new HSSFWorkbook();
                    break;
                case ".xlsx":
                    workbook = new XSSFWorkbook();
                    break;
                default:
                    throw new Exception(string.Format("不支持导出{0}格式！", fileExtension));
            }
            ISheet sheet = workbook.CreateSheet("Sheet1");
            IRow rowHead = sheet.CreateRow(0);
            ICellStyle dateStyle = workbook.CreateCellStyle();
            dateStyle.DataFormat = HSSFDataFormat.GetBuiltinFormat("@");
            for (int i = 0; i < table.Columns.Count; i++)
            {
                rowHead.CreateCell(i, CellType.String).SetCellValue(table.Columns[i].ColumnName);
                sheet.AutoSizeColumn(i);
                foreach (var item in customType)
                {
                    if (table.Columns[i].ColumnName == item.Key && item.Value == "Text")
                    {
                        sheet.SetDefaultColumnStyle(i, dateStyle);

                    }
                }

            }

            for (int j = 0; j < table.Rows.Count; j++)
            {
                IRow rowData = sheet.CreateRow(j + 1);
                for (int k = 0; k < table.Columns.Count; k++)
                {
                    if (table.Rows[j][k] == DBNull.Value || table.Rows[j][k] == null)
                    {
                        continue;
                    }

                    customType.TryGetValue(table.Columns[k].ColumnName, out string type);
                    if (!string.IsNullOrEmpty(type))
                    {
                        string cellValue = table.Rows[j][k].ToString();
                        switch (type)
                        {
                            case "Numeric":
                                {
                                    double.TryParse(cellValue, out double num);
                                    rowData.CreateCell(k, CellType.Numeric).SetCellValue(num);
                                    break;
                                }

                            default:
                                rowData.CreateCell(k, CellType.String).SetCellValue(cellValue);
                                break;
                        }
                    }
                    else
                    {
                        rowData.CreateCell(k, CellType.String).SetCellValue(table.Rows[j][k].ToString());
                    }
                }
            }





            using (MemoryStream ms = new MemoryStream())
            {
                workbook.Write(ms);
                return ms.ToArray();
            }
        }

        /// <summary>
        /// 导出一个dataset多个页面的文件，自定义列值类型，参照CellType("Numeric","String")，目前仅支持数值列
        /// </summary>
        /// <param name="requests"></param>
        /// <returns></returns>
        public static byte[] ExportExcelEx(List<ExportExcelRequest> requests, Dictionary<string, string> customType)
        {
            string fileExtension = requests[0].FileExtension;
            IWorkbook workbook;
            switch (fileExtension.ToStringEx().ToLower())
            {
                case ".xls":
                    workbook = new HSSFWorkbook();
                    break;
                case ".xlsx":
                    workbook = new XSSFWorkbook();
                    break;
                default:
                    throw new Exception(string.Format("不支持导出{0}格式！", fileExtension));
            }


            for (var i = 0; i < requests.Count; i++)
            {
                var request = requests[i];
                string tableName = request.TableName;
                DataTable table = request.Table;
                if (string.IsNullOrEmpty(tableName)) { tableName = string.IsNullOrEmpty(table.TableName) ? $"Sheet{i + 1}" : table.TableName; }


                Dictionary<string, string> headers = request.Header;
                if (headers == null || headers.Count == 0)
                {
                    headers = new Dictionary<string, string>();
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        headers.Add(table.Columns[j].ColumnName, table.Columns[j].ColumnName);
                    }
                }
                ISheet sheet = workbook.CreateSheet(tableName);
                IRow rowHead = sheet.CreateRow(0);
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.DataFormat = HSSFDataFormat.GetBuiltinFormat("@");
                int z = 0;
                foreach (string title in headers.Keys)
                {
                    string text = headers[title];
                    rowHead.CreateCell(z, CellType.String).SetCellValue(text);
                    sheet.AutoSizeColumn(z);
                    foreach (var item in customType)
                    {
                        if (table.Columns[i].ColumnName == item.Key && item.Value == "Text")
                        {
                            sheet.SetDefaultColumnStyle(i, dateStyle);

                        }
                    }
                    z++;
                }


                for (int j = 0; j < table.Rows.Count; j++)
                {
                    DataRow row = table.Rows[j];
                    IRow rowData = sheet.CreateRow(j + 1);
                    int k = 0;
                    foreach (var keyName in headers)
                    {
                        string colName = keyName.Key;

                        customType.TryGetValue(colName, out string type);
                        if (row[colName] == DBNull.Value || row[colName] == null)
                        {
                            if (type != "Numeric")
                            {
                                rowData.CreateCell(k, CellType.String).SetCellValue("");
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(type))
                            {
                                string cellValue = row[colName].ToString();
                                switch (type)
                                {
                                    case "Numeric":
                                        {
                                            double.TryParse(cellValue, out double num);
                                            rowData.CreateCell(k, CellType.Numeric).SetCellValue(num);
                                            break;
                                        }

                                    default:
                                        rowData.CreateCell(k, CellType.String).SetCellValue(cellValue);
                                        break;
                                }
                            }
                            else
                            {
                                rowData.CreateCell(k, CellType.String).SetCellValue(row[colName].ToString());
                            }
                        }
                        k++;
                    }
                }
            }

            using (MemoryStream ms = new MemoryStream())
            {
                workbook.Write(ms);
                return ms.ToArray();
            }
        } 
        #endregion
    }
}
