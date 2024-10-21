namespace AutoPalyApp.Core.Dto
{
    public enum OperateEnum
    {
        /// <summary>
        /// 等待直到能识别点击到为止，执行一次点击
        /// </summary>
        WaitToClick = 0,
        /// <summary>
        /// 休眠等待【内容】按毫秒为单位
        /// </summary>
        Sleep = 1,
        /// <summary>
        /// 重复循环执行子命令集合，直到有【内容】出现就跳出循环
        /// </summary>
        Loop_Break = 2,
        /// <summary>
        /// 满足【内容】出现，一直重复循环执行子命令集合，直到【内容】不出现
        /// </summary>
        Loop_Continue = 3,
    }
}
