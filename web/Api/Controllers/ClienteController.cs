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
        public int Total()
        {
            Entities context = new Entities();
            List<SimpleClienteViewModel> lista = new List<SimpleClienteViewModel>();

            var query = context.Cliente.Where(cli => cli.Situacao == true);

            return query.Count();
        }

        [HttpGet]
        public ClienteViewModel Perfil(int id)
        {
            Entities context = new Entities();

            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ClienteViewModel(obj, true);
        }

        [HttpGet]
        public bool Assinante()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);
            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            return (cliente.Plano != null);
        }

        [HttpGet]
        public PagamentoGroupViewModel MeusPagamentos()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);

            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            PagamentoGroupViewModel obj = new PagamentoGroupViewModel();

            cliente.Pagamento.Where(pag => pag.Situacao == 1).OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                obj.Pago.Add(new PagamentoViewModel(pag));
            });

            cliente.Pagamento.Where(pag => pag.Situacao == 0).OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                obj.Pendente.Add(new PagamentoViewModel(pag));
            });

            return obj;
        }

        [HttpGet]
        public AssinaturaViewModel MinhaAssinatura()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);

            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            if (cliente.Plano != null)
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

        [HttpPost]
        public bool Esqueceu([FromBody] dynamic param)
        {
            string email = param.email;
          
            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(op => op.Email == email);

            if (obj == null)
            {
                throw new Exception("E-mail inválido");
            }

            // enviar e-mail com a senha do cliente

            return true;
        }

    }
}
