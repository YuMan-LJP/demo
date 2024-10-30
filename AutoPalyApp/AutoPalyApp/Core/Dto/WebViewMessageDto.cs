namespace AutoPalyApp.Core.Dto
{
    public class WebViewMessageDto
    {
        private string _guid;
        private DateTime _sendTime;

        public WebViewMessageDto(string eventKey, object message)
        {
            _guid = Guid.NewGuid().ToString();
            _sendTime = DateTime.Now;
            EventKey = eventKey;
            Message = message;
        }

        /// <summary>
        /// 每个消息的唯一ID，自动生成
        /// </summary>
        public string GUID { get { return _guid; } }

        /// <summary>
        /// 前端订阅的事件唯一键
        /// </summary>
        public string EventKey { get; set; } = "";

        /// <summary>
        /// 消息内容，任意对象，可以是值类型，string，对象，或者集合
        /// 发送时自动序列化
        /// </summary>
        public object? Message { get; set; }

        /// <summary>
        /// 发送消息的时间，发送时会自动赋值，不需要手动赋值
        /// </summary>
        public DateTime SendTime { get { return _sendTime; } }
    }
}
