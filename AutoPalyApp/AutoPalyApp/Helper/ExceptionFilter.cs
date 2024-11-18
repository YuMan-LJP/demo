using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AutoPalyApp.Helper
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            MyLogHelper.Error(context.Exception);//记录全局日志即可
            if (context.ExceptionHandled == false)
            {
                if (context.Exception is MyMessageException)
                {
                    //如果异常没有解决，这里需要做...
                    MyMessageException myException = (MyMessageException)context.Exception;
                    context.HttpContext.Response.StatusCode = myException.Code;
                    context.Result = new ObjectResult(new {
                        IsError = true,
                        myException.Code,
                        myException.Message,
                        myException.Details,
                    });
                    context.ExceptionHandled = true;//表示异常已经被处理了，前端不会响应异常
                }

#if !DEBUG
                context.Result = new ObjectResult("系统内部发生异常！");//正式环境不能显示系统内部异常的消息
#endif
            }
        }
    }
}
