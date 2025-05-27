using System.ComponentModel;
using Yuman.WebViewVue.Helper.MultipleLanguages;
using Yuman.WebViewVue.Services.Dto;

namespace Yuman.WebViewVue.Managers
{
    public class MyBaseManager
    {
        public string L(string key, params string[] args)
        {
            return LanguageHelper.L(key, args);
        }

        public string L(string lang, string key, params string[] args)
        {
            return LanguageHelper.L(lang, key, args);
        }

        protected virtual async Task<List<Select2ItemDto>> GetSelectData<T>()
        {
            var output = new List<Select2ItemDto>();
            foreach (var value in Enum.GetValues(typeof(T)))
            {
                object[] objAttrs = value.GetType().GetField(value.ToString()).GetCustomAttributes(typeof(DescriptionAttribute), true);
                if (objAttrs != null && objAttrs.Length > 0)
                {
                    var descAttr = objAttrs[0] as DescriptionAttribute;
                    output.Add(new Select2ItemDto(Convert.ToInt32(value).ToString(), L(descAttr.Description)));
                }
                else
                {
                    output.Add(new Select2ItemDto(Convert.ToInt32(value).ToString(), value.ToString()));
                }
            }
            return await Task.FromResult(output);
        }
    }
}
