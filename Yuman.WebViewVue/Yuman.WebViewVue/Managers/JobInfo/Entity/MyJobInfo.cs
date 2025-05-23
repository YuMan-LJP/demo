using System.ComponentModel.DataAnnotations.Schema;
using Yuman.WebViewVue.Helper;

namespace Yuman.WebViewVue.Managers.JobInfo.Entity
{
    [Table("Yuman_JobInfo")]
    public class MyJobInfo
    {
        /// <summary>
        /// GUID
        /// </summary>
        [MyRequiredField(TranslationKey = "JobInfo.Id")]
        public string Id { get; set; } = "";

        /// <summary>
        /// 分组
        /// </summary>
        [MyRequiredField(TranslationKey = "JobInfo.Group")]
        public string Group { get; set; } = "";

        /// <summary>
        /// 名称
        /// </summary>
        [MyRequiredField(TranslationKey = "JobInfo.Name")]
        public string Name { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public string? Description { get; set; }
    }
}
