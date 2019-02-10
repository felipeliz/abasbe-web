using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class ParametroController : ApiController
    {
        [HttpGet]
        public string Obter(string id)
        {
            string chave = id;
            return ObterParam(chave);
        }

        public static string ObterParam(string chave)
        {
            Entities context = new Entities();
            var obj = context.Parametro.FirstOrDefault(par => par.Chave == chave);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                return obj.Valor;

            }
        }
    }
}