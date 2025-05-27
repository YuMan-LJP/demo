using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Yuman.WebViewVue.Helper;

namespace Yuman.WebViewVue.Managers.SystemSetting.Entity
{
    [Table("Yuman_SystemSetting")]
    public class MySystemSetting
    {
        [Key]
        [MyRequired]
        public string Key { get; set; } = "";

        [MyRequired]
        public string Value { get; set; } = "";
    }
}
