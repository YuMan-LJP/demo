using ICSharpCode.SharpZipLib.Checksum;
using ICSharpCode.SharpZipLib.Zip;
using NPOI.SS.UserModel;
using NPOI.XSSF.Streaming;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using Common.ObjectExtension;

namespace Common
{
    public class AutoSplitExcelWriter : IDisposable
    {
        #region class: SheetWriter
        private class SheetWriter
        {
            private readonly string _sheetName;
            private readonly int _sheetMaxRow;
            private readonly Dictionary<int, SXSSFWorkbook> _workbookDict;
            private readonly bool _isIncludeHeader = false;
            private int _currentFileSplitIndex = 0;
            private IWorkbook _currentWorkbook = null;
            private ISheet _currentSheet = null;
            private int _currentRowIndex = -1;

            public SheetWriter(string sheetName, int sheetMaxRow, Dictionary<int, SXSSFWorkbook> workbookDict, bool isIncludeHeader)
            {
                _sheetName = sheetName;
                _sheetMaxRow = sheetMaxRow;
                _workbookDict = workbookDict;
                _isIncludeHeader = isIncludeHeader;
            }

            public void Write(DataRow row)
            {
                CreateWorkbookIfNewFile();

                var rowHead = CreateHeadRowIfNewFileStartAndIncludeHeader();
                var currentRow = CreateNewRow();
                for (int i = 0; i < row.Table.Columns.Count; i++)
                {
                    if (rowHead != null)
                    {
                        rowHead.CreateCell(i, CellType.String).SetCellValue(row.Table.Columns[i].ColumnName);
                    }
                    CreateCellAndSetCellValue(currentRow, i, Type.GetTypeCode(row[i].GetType()), row[i]);
                }

                SplitNewFileIfOverSheetMaxRow();
            }

            public void Write(DataRow row, Dictionary<string, string> propertyDescDict)
            {
                CreateWorkbookIfNewFile();

                var rowHead = CreateHeadRowIfNewFileStartAndIncludeHeader();
                var currentRow = CreateNewRow();
                for (int i = 0; i < row.Table.Columns.Count; i++)
                {
                    if (rowHead != null)
                    {
                        string name = row.Table.Columns[i].ColumnName;
                        if (propertyDescDict.ContainsKey(name))
                        {
                            rowHead.CreateCell(i, CellType.String).SetCellValue(propertyDescDict[name]);
                        }
                        else
                        {
                            rowHead.CreateCell(i, CellType.String).SetCellValue(name);
                        }
                    }
                    CreateCellAndSetCellValue(currentRow, i, Type.GetTypeCode(row[i].GetType()), row[i]);
                }

                SplitNewFileIfOverSheetMaxRow();
            }

            public void Write<T>(T obj, bool ignoreNotDescProperty, Func<string, string> descTranslationFunc)
            {
                CreateWorkbookIfNewFile();

                var rowHead = CreateHeadRowIfNewFileStartAndIncludeHeader();
                var currentRow = CreateNewRow();
                int i = 0;
                foreach (var propertyEmit in obj.GetPropertyEmits().Values)
                {
                    var attribute = (DescriptionAttribute)propertyEmit.Info.GetCustomAttributes(typeof(DescriptionAttribute), true).FirstOrDefault();
                    if (ignoreNotDescProperty && attribute == null)
                    {
                        continue;
                    }
                    if (rowHead != null)
                    {
                        rowHead.CreateCell(i, CellType.String).SetCellValue(attribute == null ? propertyEmit.PropertyName : (descTranslationFunc == null ? attribute.Description : descTranslationFunc(attribute.Description)));
                    }
                    CreateCellAndSetCellValue(currentRow, i, Type.GetTypeCode(propertyEmit.Info.PropertyType), propertyEmit.GetValue(obj));
                    i++;
                }

                SplitNewFileIfOverSheetMaxRow();
            }

            public void Write<T>(T obj, bool ignoreNotDescProperty, CultureInfo culture, Func<string, CultureInfo, string> descTranslationFunc)
            {
                CreateWorkbookIfNewFile();

                var rowHead = CreateHeadRowIfNewFileStartAndIncludeHeader();
                var currentRow = CreateNewRow();
                int i = 0;
                foreach (var propertyEmit in obj.GetPropertyEmits().Values)
                {
                    var attribute = (DescriptionAttribute)propertyEmit.Info.GetCustomAttributes(typeof(DescriptionAttribute), true).FirstOrDefault();
                    if (ignoreNotDescProperty && attribute == null)
                    {
                        continue;
                    }
                    if (rowHead != null)
                    {
                        rowHead.CreateCell(i, CellType.String).SetCellValue(attribute == null ? propertyEmit.PropertyName : (descTranslationFunc == null ? attribute.Description : descTranslationFunc(attribute.Description, culture)));
                    }
                    CreateCellAndSetCellValue(currentRow, i, Type.GetTypeCode(propertyEmit.Info.PropertyType), propertyEmit.GetValue(obj));
                    i++;
                }

                SplitNewFileIfOverSheetMaxRow();
            }

            public void Write<T>(T obj, Dictionary<string, string> propertyDescDict)
            {
                CreateWorkbookIfNewFile();

                var propertyEmits = obj.GetPropertyEmits();
                var rowHead = CreateHeadRowIfNewFileStartAndIncludeHeader();
                var currentRow = CreateNewRow();
                int i = 0;
                foreach (var item in propertyDescDict)
                {
                    if (rowHead != null)
                    {
                        rowHead.CreateCell(i, CellType.String).SetCellValue(item.Value);
                    }
                    var propertyEmit = propertyEmits.Values.SingleOrDefault(s => s.PropertyName.Equals(item.Key));
                    if (propertyEmit != null)
                    {
                        CreateCellAndSetCellValue(currentRow, i, Type.GetTypeCode(propertyEmit.Info.PropertyType), propertyEmit.GetValue(obj));
                    }
                    i++;
                }

                SplitNewFileIfOverSheetMaxRow();
            }

            private IRow CreateHeadRowIfNewFileStartAndIncludeHeader()
            {
                return _isIncludeHeader && _currentRowIndex == -1 ? CreateNewRow() : null;
            }

            private IRow CreateNewRow()
            {
                _currentRowIndex++;
                return _currentSheet.CreateRow(_currentRowIndex);
            }

            private void CreateWorkbookIfNewFile()
            {
                if (_currentWorkbook == null)
                {
                    if (!_workbookDict.ContainsKey(_currentFileSplitIndex))
                    {
                        _workbookDict.Add(_currentFileSplitIndex, new SXSSFWorkbook(null, 100, true, true));
                    }
                    _currentWorkbook = _workbookDict[_currentFileSplitIndex];
                    _currentSheet = _currentWorkbook.CreateSheet(_sheetName);
                }
            }

            private void SplitNewFileIfOverSheetMaxRow()
            {
                if (_currentRowIndex + 1 >= _sheetMaxRow)
                {
                    _currentFileSplitIndex++;
                    _currentRowIndex = -1;
                    _currentWorkbook = null;
                    _currentSheet = null;
                }
            }

            private void CreateCellAndSetCellValue(IRow row, int column, TypeCode cellValueType, object cellValue)
            {
                switch (cellValueType)
                {
                    case TypeCode.Int16:
                    case TypeCode.UInt16:
                    case TypeCode.Int32:
                    case TypeCode.UInt32:
                    case TypeCode.Int64:
                    case TypeCode.UInt64:
                    case TypeCode.Single:
                    case TypeCode.Decimal:
                    case TypeCode.Double:
                        row.CreateCell(column, CellType.Numeric).SetCellValue(Convert.ToDouble(cellValue));
                        break;
                    default:
                        row.CreateCell(column, CellType.String).SetCellValue(cellValue.ToStringEx());
                        break;
                }
            }
        }
        #endregion

        private readonly int _sheetMaxRow;
        private readonly bool _isIncludeHeader;
        private readonly Dictionary<int, SXSSFWorkbook> _workbookDict = new Dictionary<int, SXSSFWorkbook>();
        private readonly Dictionary<string, SheetWriter> _sheetWriterDict = new Dictionary<string, SheetWriter>();

        public AutoSplitExcelWriter(int? sheetMaxRow = 1048576, bool? isIncludeHeader = true)
        {
            if (sheetMaxRow.HasValue)
                _sheetMaxRow = sheetMaxRow.Value;
            else
                _sheetMaxRow = 1048576;

            if (isIncludeHeader.HasValue)
                _isIncludeHeader = isIncludeHeader.Value;
            else
                _isIncludeHeader = false;

            //删除缓存文件
            DeleteWorkbookTempFile();
        }

        public void Write(DataRow row, string sheetName = "Sheet1")
        {
            GetSheetWriter(sheetName).Write(row);
        }

        public void Write(DataTable dataTable, string sheetName = "Sheet1")
        {
            var sheetWriter = GetSheetWriter(sheetName);
            foreach (DataRow dr in dataTable.Rows)
            {
                sheetWriter.Write(dr);
            }
        }

        public void WriteByDataRow(DataRow row, Dictionary<string, string> propertyDescDict, string sheetName = "Sheet1")
        {
            GetSheetWriter(sheetName).Write(row, propertyDescDict);
        }

        public void Write<T>(T obj, bool ignoreNotDescProperty, Func<string, string> descTranslationFunc = null, string sheetName = "Sheet1")
        {
            GetSheetWriter(sheetName).Write(obj, ignoreNotDescProperty, descTranslationFunc);
        }

        public void WriteCollection<T>(IEnumerable<T> objs, bool ignoreNotDescProperty, Func<string, string> descTranslationFunc = null, string sheetName = "Sheet1")
        {
            var sheetWriter = GetSheetWriter(sheetName);
            foreach (var obj in objs)
            {
                sheetWriter.Write(obj, ignoreNotDescProperty, descTranslationFunc);
            }
        }

        public void Write<T>(T obj, bool ignoreNotDescProperty, CultureInfo culture, Func<string, CultureInfo, string> descTranslationFunc, string sheetName = "Sheet1")
        {
            GetSheetWriter(sheetName).Write(obj, ignoreNotDescProperty, culture, descTranslationFunc);
        }

        public void WriteCollection<T>(IEnumerable<T> objs, bool ignoreNotDescProperty, CultureInfo culture, Func<string, CultureInfo, string> descTranslationFunc, string sheetName = "Sheet1")
        {
            var sheetWriter = GetSheetWriter(sheetName);
            foreach (var obj in objs)
            {
                sheetWriter.Write(obj, ignoreNotDescProperty, culture, descTranslationFunc);
            }
        }

        public void Write<T>(T obj, Dictionary<string, string> propertyDescDict, string sheetName = "Sheet1")
        {
            GetSheetWriter(sheetName).Write(obj, propertyDescDict);
        }

        public void WriteCollection<T>(IEnumerable<T> objs, Dictionary<string, string> propertyDescDict, string sheetName = "Sheet1")
        {
            var sheetWriter = GetSheetWriter(sheetName);
            foreach (var obj in objs)
            {
                sheetWriter.Write(obj, propertyDescDict);
            }
        }

        public void Save(string path, bool canOverride = true)
        {
            var fileName = Path.GetFileNameWithoutExtension(path);
            var directoryName = Path.GetDirectoryName(path);

            foreach (var item in _workbookDict)
            {
                var fullPath = _workbookDict.Count > 1
                    ? $"{directoryName}/{fileName}-{item.Key + 1}.xlsx"
                    : $"{directoryName}/{fileName}.xlsx";

                if (canOverride)
                {
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }

                using (var fileStream = new FileStream(fullPath, FileMode.CreateNew))
                {
                    item.Value.Write(fileStream);
                }
            }
        }

        public void Save(Func<int, Stream> saveStreamCreator, Action<int, Stream> savedCallback = null, Action<int, Exception> failedCallback = null)
        {
            foreach (var item in _workbookDict)
            {
                try
                {
                    using var stream = saveStreamCreator(item.Key);
                    item.Value.Write(stream);
                    savedCallback?.Invoke(item.Key, stream);
                    stream.Dispose();
                }
                catch (Exception ex)
                {
                    failedCallback?.Invoke(item.Key, ex);
                }
            }
        }

        public void Save(Func<int, string> fileNameCreator, Action<int, string, FileStream> savedCallback = null, Action<int, string, Exception> failedCallback = null)
        {
            foreach (var item in _workbookDict)
            {
                var fileName = fileNameCreator(item.Key);

                try
                {
                    var dir = Path.GetDirectoryName(fileName);
                    if (!Directory.Exists(dir))
                    {
                        Directory.CreateDirectory(dir);
                    }
                    using (var fileStream = new FileStream(fileName, FileMode.Create))
                    {
                        item.Value.Write(fileStream);//这里写入后就会自动关闭文件流，只能重新打开进行savedCallback
                        fileStream.Dispose();
                    }

                    if (savedCallback != null)
                    {
                        using var fileStream = new FileStream(fileName, FileMode.Open);
                        savedCallback(item.Key, fileName, fileStream);
                        fileStream.Dispose();
                    }
                }
                catch (Exception ex)
                {
                    failedCallback?.Invoke(item.Key, fileName, ex);
                    try
                    {
                        if (File.Exists(fileName))
                        {
                            File.Delete(fileName);
                        }
                    }
                    catch { }
                }
            }
        }

        public void CompressSave(ZipOutputStream zipOutputStream, Func<int, string> tempfileNameCreator, Func<int, string> zipEntryNameCreator = null, Func<DateTime> zipEntryDateTimeCreator = null)
        {
            Save(tempfileNameCreator, (i, tempFileName, tempFileStream) =>
            {
                Crc32 crc = new Crc32();
                crc.Reset();
                var zipEntryName = zipEntryNameCreator == null ? Path.GetFileName(tempFileName) : zipEntryNameCreator(i);
                ZipEntry entry = new ZipEntry(zipEntryName);
                entry.DateTime = zipEntryDateTimeCreator == null ? DateTime.Now : zipEntryDateTimeCreator();
                entry.Size = tempFileStream.Length;
                zipOutputStream.PutNextEntry(entry);
                var bufferSize = 2048;
                var buffer = new byte[bufferSize];
                while (bufferSize > 0)
                {
                    bufferSize = tempFileStream.Read(buffer, 0, bufferSize);
                    zipOutputStream.Write(buffer, 0, bufferSize);
                    crc.Update(new ArraySegment<byte>(buffer, 0, bufferSize));
                }
                entry.Crc = crc.Value;

                tempFileStream.Dispose();//注意，这里必须释放后才能进行删除文件
                File.Delete(tempFileName);
            }, (i, tempFileName, ex) =>
            {
                try
                {
                    if (File.Exists(tempFileName))
                    {
                        File.Delete(tempFileName);
                    }
                }
                catch { }
            });
        }

        public void Dispose()
        {
            foreach (var item in _workbookDict)
            {
                item.Value.Dispose();
            }
        }

        private void DeleteWorkbookTempFile()
        {
            try
            {
                var baseTempPath = Path.GetTempPath();

                var currentTempFolderPath = Path.Combine(baseTempPath, "poifiles");

                var dyInfo = new DirectoryInfo(currentTempFolderPath);

                foreach (FileInfo feInfo in dyInfo.GetFiles())
                {
                    if (feInfo.CreationTime < DateTime.Now.AddDays(-1))
                        feInfo.Delete();
                }
            }
            catch
            { }
        }

        private SheetWriter GetSheetWriter(string sheetName)
        {
            if (!_sheetWriterDict.ContainsKey(sheetName))
            {
                _sheetWriterDict.Add(sheetName, new SheetWriter(sheetName, _sheetMaxRow, _workbookDict, _isIncludeHeader));
            }
            return _sheetWriterDict[sheetName];
        }
    }
}
