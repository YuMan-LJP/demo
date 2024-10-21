using log4net;

namespace AutoPalyApp.Helper
{
    public static class LogHelper
    {
        public static void Info(object msg)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Info(msg);
        }

        public static void InfoFormat(string msg, params object[] parameters)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.InfoFormat(msg, parameters);
        }

        public static void Debug(string msg)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Debug(msg);
        }

        public static void Error(string msg)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Error(msg);
        }

        public static void ErrorFormat(string format, params object[] args)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Error(string.Format(format, args));
        }

        public static void Error(Exception ex)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Error(ex.Message, ex);
        }

        public static void Error(object msg, Exception ex)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Error(msg, ex);
        }

        public static void Warn(object msg, Exception ex)
        {
            var log = LogManager.GetLogger("log4netlogger");
            log.Warn(msg, ex);
        }

        public static void Log(string msg)
        {
            Info(msg);
        }

        public static void Log(Exception ex)
        {
            Error(ex);
        }
    }
}
