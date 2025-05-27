namespace Yuman.WebViewVue.Managers
{
    /// <summary>
    /// 全局常量声明
    /// </summary>
    public class MyConsts
    {
        /// <summary>
        /// 系统参数类，里面增加的字段在启动程序时会自动插入数据库存储，然后以数据库中的为准
        /// </summary>
        public class SystemSetting
        {
            /// <summary>
            /// Job默认开启
            /// </summary>
            public const string SystemSetting_JobIsDefaultStart = "true";//比较时记得忽略大小写

            /// <summary>
            /// 默认语言，可以切换，切换之后更新到数据库，已数据库最新的值为准（也就是说切换成英文，关闭程序再重启也还是英文）
            /// </summary>
            public const string SystemSetting_Language = "zh-CN";
        }
    }
}
