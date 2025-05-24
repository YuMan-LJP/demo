namespace Yuman.WebViewVue.Helper
{
    /// <summary>
    /// 必填校验
    /// TranslationKey指的是翻译的代号，没有填的时候，错误提示需要显示的翻译
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
    public class MyRequiredAttribute : Attribute
    {
        public string? TranslationKey { get; set; }
    }
}
