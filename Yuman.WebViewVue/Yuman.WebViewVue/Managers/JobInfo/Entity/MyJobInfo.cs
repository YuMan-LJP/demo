using System.ComponentModel.DataAnnotations.Schema;

namespace Yuman.WebViewVue.Managers.JobInfo.Entity
{
    [Table("Yuman_JobInfo")]
    public class MyJobInfo
    {
        /// <summary>
        /// GUID
        /// </summary>
        public string Id { get; set; } = "";

        /// <summary>
        /// 分组
        /// </summary>
        public string Group { get; set; } = "";

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; } = "";
    }
}
