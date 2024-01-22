using System.Collections.Generic;
using System.Data;

namespace Common.Dto
{
    public class ExportExcelRequest
    {
        public DataTable Table { set; get; }

        public Dictionary<string, string> Header { set; get; }

        public string TableName { set; get; }

        public string FileExtension { set; get; }
    }
}
