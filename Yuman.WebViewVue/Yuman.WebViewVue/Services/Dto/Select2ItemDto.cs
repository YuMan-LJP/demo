namespace Yuman.WebViewVue.Services.Dto
{
    /// <summary>
    /// Select2 控件绑定数据
    /// </summary>
    public class Select2ItemDto
    {
        public string Id { get; set; }

        public string Text { get; set; }

        /// <summary>
        /// 默认选中
        /// </summary>
        public bool? Selected { get; set; }

        public string ExtendData { set; get; }

        /// <summary>
        /// 是否可以选择
        /// </summary>
        public bool? IsCanCheck { set; get; }

        public Select2ItemDto() { }

        public Select2ItemDto(string id, string text)
        {
            Id = id;
            Text = text;
        }

        public Select2ItemDto(string id, string text, string extendData)
        {
            Id = id;
            Text = text;
            ExtendData = extendData;
        }

        public Select2ItemDto(string id, string text, bool isCanCheck)
        {
            Id = id;
            Text = text;
            IsCanCheck = isCanCheck;
        }
    }
}
