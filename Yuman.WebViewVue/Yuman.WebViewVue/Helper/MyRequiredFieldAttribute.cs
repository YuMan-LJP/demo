namespace Yuman.WebViewVue.Helper
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
    public class MyRequiredFieldAttribute : Attribute
    {
        public string? TranslationKey { get; set; }
    }
}
