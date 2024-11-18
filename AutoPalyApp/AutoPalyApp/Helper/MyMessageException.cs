namespace AutoPalyApp.Helper
{
    public class MyMessageException : Exception
    {
        public string Details { get; private set; }
        public int Code { get; set; } = 500;

        public MyMessageException(string message) : base(message)
        {
            Details = "";
        }

        public MyMessageException(string message, Exception ex) : base(message, ex)
        {
            Details = "";
        }

        public MyMessageException(string message, string details) : this(message)
        {
            Details = details;
        }

        public MyMessageException(int code, string message) : this(message)
        {
            Code = code;
        }

        public MyMessageException(int code, string message, string details) : this(message, details)
        {
            Code = code;
        }

        public MyMessageException(string message, string details, Exception innerException) : this(message, innerException)
        {
            Details = details;
        }
    }
}
