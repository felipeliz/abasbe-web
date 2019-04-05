using Api.Utils;
using NLog;
using System;
using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;

namespace Api
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            GlobalConfiguration.Configuration.Filters.Add(new LogExceptionFilterAttribute());
            AppExtension.ConfigureLog("alysonfreitas.minivps.info", "BelezaMaisForte", "sa", "667605Az");
        }

        protected void Application_Error()
        {
            string request = null;

            HttpContext context = HttpContext.Current;
            if (context.Request != null)
            {
                request = context.Request.ToString();
            }

            MappedDiagnosticsContext.Set("request", request);
            MappedDiagnosticsContext.Set("arguments", null);

            Exception lastException = Server.GetLastError();
            LogManager.GetCurrentClassLogger().Fatal(lastException);
        }
    }

    public class LogExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            string request = null;
            string arguments = null;

            if (context.Request != null)
            {
                request = context.Request.ToString();
            }

            if (context.ActionContext != null && context.ActionContext.ActionArguments != null)
            {
                arguments = string.Empty;
                foreach (string key in context.ActionContext.ActionArguments.Keys)
                {
                    arguments += key + ": " + context.ActionContext.ActionArguments[key].ToString().Trim() + Environment.NewLine;
                }
            }

            MappedDiagnosticsContext.Set("request", request);
            MappedDiagnosticsContext.Set("arguments", arguments);

            LogManager.GetCurrentClassLogger().Fatal(context.Exception);
        }
    }
}
