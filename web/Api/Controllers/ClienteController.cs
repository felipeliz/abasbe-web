using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class ClienteController : ApiController
    {
        [HttpGet]
        public List<SimpleClienteViewModel> Todos()
        {
            Entities context = new Entities();
            List<SimpleClienteViewModel> lista = new List<SimpleClienteViewModel>();

            var query = context.Cliente.Where(cli => cli.Situacao == true);

            query.ToList().ForEach(obj =>
            {
                lista.Add(new SimpleClienteViewModel(obj));
            });

            return lista;
        }


        [HttpGet]
        public AssinaturaViewModel MinhaAssinatura()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);

            if(cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            if(cliente.Plano != null)
            {
                return new AssinaturaViewModel(cliente, cliente.Plano);
            }
            else
            {
                throw new Exception("no_plan");
            }
        }

        [HttpPost]
        public ClienteViewModel Login([FromBody] dynamic param)
        {
            string email = param.email;
            string senha = param.senha;

            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(op => op.Email == email && op.Senha == senha);

            if (obj == null)
            {
                throw new Exception("E-mail ou senha inválidos");
            }

            ClienteViewModel res = new ClienteViewModel(obj, true);
            return res;
        }

    }
}
