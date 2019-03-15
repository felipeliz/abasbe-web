﻿using Api.Models;
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
        public int DiasParaExpirar()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);
            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            return Convert.ToInt32(((DateTime)cliente.DataExpiracao).Subtract(DateTime.Now).TotalDays);
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

            List<int> pagos = new List<int>();
            pagos.Add(2);
            pagos.Add(3);
            cliente.Pagamento.Where(pag => pagos.Contains(pag.Situacao)).OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                obj.Pago.Add(new PagamentoViewModel(pag));
            });

            List<int> pendentes = new List<int>();
            pendentes.Add(0);
            pendentes.Add(1);
            cliente.Pagamento.Where(pag => pendentes.Contains(pag.Situacao)).OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                obj.Pendente.Add(new PagamentoViewModel(pag));
            });

            List<int> alternativos = new List<int>();
            alternativos.Add(4);
            alternativos.Add(5);
            alternativos.Add(6);
            cliente.Pagamento.Where(pag => alternativos.Contains(pag.Situacao)).OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                obj.Alternativo.Add(new PagamentoViewModel(pag));
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

            if (obj.Situacao == false)
            {
                throw new Exception("Seu cadastro está inativo, entre em contato para mais informações!");
            }

            ClienteViewModel res = new ClienteViewModel(obj, true);
            return res;
        }

        [HttpPost]
        public string Contato([FromBody] dynamic param)
        {
            return "Seu contato foi direcionado, responderemos em 24h";
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

        [HttpPost]
        public bool Senha([FromBody] dynamic param)
        {
            string anterior = param.anterior?.ToString();
            string nova = param.nova?.ToString();
            string confirmar = param.confirmar?.ToString();

            Entities context = new Entities();
            var obj = context.Cliente.Find(AppExtension.IdUsuarioLogado());

            if (anterior != obj.Senha)
            {
                throw new Exception("A senha atual está errada");
            }

            if (nova != confirmar)
            {
                throw new Exception("A nova senha está diferente da confirmação");
            }

            if (nova == null || nova.Length < 4)
            {
                throw new Exception("Sua senha precisa ter pelo menos 4 digitos");
            }

            obj.Senha = nova;

            return context.SaveChanges() > 0;
        }

    }
}
