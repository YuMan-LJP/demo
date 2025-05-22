namespace Yuman.WebViewVue.Services.Dto
{
    public interface IApiResult
    {
        bool IsSuccess { get; set; }

        string? ErrorMessage { get; set; }

        bool IsException { get; set; }
    }

    public class ApiResultDto : IApiResult
    {
        public bool IsSuccess { get; set; }

        public string? ErrorMessage { get; set; }

        public object? Data { get; set; }

        public bool IsException { get; set; }
    }
}
