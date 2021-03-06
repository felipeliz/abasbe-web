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
                throw new Exception("CLIENT_NOT_FOUND");
            }

            return Convert.ToInt32(((DateTime)cliente.DataExpiracao).Subtract(DateTime.Now).TotalDays);
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
            string destinatario = ParametroController.ObterParam("EmailContato");
            string line = "<p><strong>{0}: </strong><span>{1}</span></p>";

            string body = "";
            body += string.Format(line, "Nome", param.nome?.ToString());
            body += string.Format(line, "Email", param.email?.ToString());
            body += string.Format(line, "Telefone", param.telefone?.ToString());
            body += string.Format(line, "Mensagem", param.mensagem?.ToString());

            AppExtension.EnviarEmailGmail(destinatario, "Beleza Mais Forte - Contato App", body);
            return "Seu contato foi direcionado, responderemos o mais rapidamente possível";
        }

        [HttpPost]
        public string Esqueceu([FromBody] dynamic param)
        {
            string email = param.email;

            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(op => op.Email == email);

            if (obj == null)
            {
                throw new Exception("E-mail inválido");
            }

            string line = "<p><strong>{0}: </strong><span>{1}</span></p>";

            string body = string.Format("<strong>Olá {0},</strong><br/>", obj.Nome);
            body += string.Format(line, "Sua senha é", obj.Senha);

            AppExtension.EnviarEmailGmail(obj.Email, "Beleza Mais Forte - Recuperar Senha", body);

            return "Sua senha foi enviada para seu e-mail de cadastro.";
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
