namespace AutoPalyApp.Core.Dto
{
    public class CommandGroup<T>
    {
        /// <summary>
        /// 【唯一Id】可以用GUID，对应定时任务
        /// </summary>
        public string Id { get; set; } = "";

        /// <summary>
        /// 【命名】用户自定义
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// json文件名
        /// </summary>
        public string FileName { get; set; } = "";

        /// <summary>
        /// 【备注】
        /// </summary>
        public string Remark { get; set; } = "";

        /// <summary>
        /// 【命令脚本】
        /// </summary>
        public List<T> Commands { get; set; } = new List<T>();
    }
}
