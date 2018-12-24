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
    public class AssociadoController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string nome = param.Nome?.ToString();
            string nomeEmpresa = param.NomeEmpresa?.ToString();
            string cnpj = Regex.Replace(param.Cnpj?.ToString(), "[^0-9]", "");
            string situacao = param.Situacao?.ToString();

            Entities context = new Entities();
            List<ClienteViewModel> lista = new List<ClienteViewModel>();
            var query = context.Cliente.Where(pro => pro.FlagCliente == "A");

            if (!String.IsNullOrEmpty(nomeEmpresa))
            {
                query = query.Where(obj => obj.NomeEmpresa.ToLower().Contains(nomeEmpresa.ToLower()));
            }
            if (!String.IsNullOrEmpty(cnpj))
            {
                query = query.Where(obj => obj.Cnpj.ToLower().Contains(cnpj.ToLower()));
            }
            if (!String.IsNullOrEmpty(nome))
            {
                query = query.Where(obj => obj.Nome.ToLower().Contains(nome.ToLower()));
            }

            if (situacao != "Todas")
            {
                bool s = Convert.ToBoolean(situacao);
                query = query.Where(obj => obj.Situacao == s);
            }

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ClienteViewModel(obj, false));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public ClienteViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id && pro.FlagCliente == "A");

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ClienteViewModel(obj, true);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id) ?? new Cliente();

            obj.Nome = param.Nome?.ToString();
            obj.Senha = param.Senha?.ToString();
            obj.Email = param.Email?.ToString();
            obj.TelefoneCelular = Regex.Replace(param.TelefoneCelular?.ToString(), "[^0-9]", ""); 
            obj.DataExpiracao = AppExtension.ToDateTime(param.DataExpiracao);
            obj.Situacao = Convert.ToBoolean(param.Situacao);
            obj.NomeEmpresa = param.NomeEmpresa?.ToString();
            obj.Cnpj = Regex.Replace(param.Cnpj?.ToString(), "[^0-9]", "");
            obj.CPF = Regex.Replace(param.CPF?.ToString(), "[^0-9]", "");
            obj.FlagCliente = "A";

            obj.IdCidade = param.IdCidade;
            obj.Bairro = param.Bairro;
            obj.Cep = param.CEP;
            obj.Logradouro = param.Logradouro;

            if (obj.Senha.Count() < 4)
            {
                throw new Exception("A senha precisa ter mais do que 4 caracteres.");
            }

            if (id <= 0)
            {
                context.Cliente.Add(obj);
            }

            return context.SaveChanges() > 0;
        }

        [HttpGet]
        public bool Excluir(int id)
        {
            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id && pro.FlagCliente == "A");
            obj.Situacao = false;
            return context.SaveChanges() > 0;
        }

        [HttpPost]
        public string ObterQtdAssociadosAtivosETotal([FromBody] dynamic param)
        {
            Entities context = new Entities();
            return context.Cliente.Where(asc => asc.Situacao == true && asc.DataExpiracao > DateTime.Today).Count().ToString() + " / " + context.Cliente.Count().ToString();
        }
    }
}
