namespace AutoPalyApp.Helper
{
    /// <summary>
    /// 通用帮助类
    /// </summary>
    public static class CommonHelper
    {
        /// <summary>
        /// https://blog.csdn.net/woaixiaozhe/article/details/8187194
        /// webView21.CoreWebView2不允许窗体以外的线程调用，用这个帮助类可以实现外部线程调用窗体内的方法
        /// </summary>
        /// <param name="control"></param>
        /// <param name="del"></param>
        public static void SyncBeginInvoke(Form control, MethodInvoker del)
        {
            if ((control != null) && control.InvokeRequired)
                control.BeginInvoke(del, null);
            else
                del();
        }

        /// <summary>
        /// 将图片文件转换为 Base64 编码的字符串。
        /// Converts an image file to a Base64-encoded string.
        /// </summary>
        /// <param name="imagePath">图片文件的路径。Path to the image file.</param>
        /// <returns>返回 Base64 编码的图片字符串。Returns a Base64-encoded image string.</returns>
        public static string ConvertImageToBase64(string imagePath)
        {
            if (!File.Exists(imagePath))
            {
                throw new FileNotFoundException("指定的图片路径不存在。Specified image path does not exist.");
            }
            byte[] imageBytes = File.ReadAllBytes(imagePath);
            return Convert.ToBase64String(imageBytes);
        }
    }
}
