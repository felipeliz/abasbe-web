using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Api.Utils
{
    public class CheckLoginAttribute : ActionFilterAttribute
    {
        private string type { get; set; }

        public CheckLoginAttribute()
        {
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            int usuario = AppExtension.IdUsuarioLogado();
            if (usuario <= 0)
            {
                throw new Exception("NotLoggedIn");
            }
        }

    }
}