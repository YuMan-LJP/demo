using AutoPalyApp.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AutoPalyApp
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            MyLogHelper.Error(context.Exception);//记录全局日志即可
            //if (context.ExceptionHandled == false)
            //{
            //    //如果异常没有解决，这里需要做...
            //    context.Result = new JsonResult("系统异常：" + context.Exception.Message);
            //}
            //context.ExceptionHandled = true;//表示异常已经被处理了，前端不会响应异常
        }
    }
}
