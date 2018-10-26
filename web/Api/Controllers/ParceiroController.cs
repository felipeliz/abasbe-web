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
    public class ParceiroController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string nome = param.Nome?.ToString();
            string nomeEmpresa = param.NomeEmpresa?.ToString();
            string cnpj = Regex.Replace(param.Cnpj?.ToString(), "[^0-9]", "");
            string situacao = param.Situacao?.ToString();

            Entities context = new Entities();
            List<ParceiroViewModel> lista = new List<ParceiroViewModel>();
            var query = context.Parceiro.ToList();

            if (!String.IsNullOrEmpty(nomeEmpresa))
            {
                query = query.Where(obj => obj.NomeEmpresa.ToLower().Contains(nomeEmpresa.ToLower())).ToList();
            }
            if (!String.IsNullOrEmpty(cnpj))
            {
                query = query.Where(obj => obj.Cnpj.ToLower().Contains(cnpj.ToLower())).ToList();
            }
            if (!String.IsNullOrEmpty(nome))
            {
                query = query.Where(obj => obj.Nome.ToLower().Contains(nome.ToLower())).ToList();
            }

            if (situacao != "Todas")
            {
                bool s = Convert.ToBoolean(situacao);
                query = query.Where(obj => obj.Situacao == s).ToList();
            }

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ParceiroViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public ParceiroViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Parceiro.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ParceiroViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Parceiro.FirstOrDefault(par => par.Id == id) ?? new Parceiro();

            obj.Nome = param.Nome?.ToString();
            obj.Senha = param.Senha?.ToString();
            obj.Email = param.Email?.ToString();
            obj.Telefone = Regex.Replace(param.Telefone?.ToString(), "[^0-9]", "");
            obj.DataExpiracao = AppExtension.ToDateTime(param.DataExpiracao);
            obj.Situacao = Convert.ToBoolean(param.Situacao);
            obj.NomeEmpresa = param.NomeEmpresa?.ToString();
            obj.Cnpj = Regex.Replace(param.Cnpj?.ToString(), "[^0-9]", "");

            if (obj.Senha.Count() < 4)
            {
                throw new Exception("A senha precisa ter mais do que 4 caracteres.");
            }

            if (id <= 0)
            {
                context.Parceiro.Add(obj);
            }
            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }

            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Parceiro.FirstOrDefault(par => par.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Parceiro.Remove(obj);
                    context.SaveChanges();
                }
                catch
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }
        }

        //[HttpPost]
        //public string ObterQtdParceirosAtivosETotal([FromBody] dynamic param)
        //{
        //    Entities context = new Entities();
        //    return context.Associado.Where(asc => asc.Situacao == true && asc.DataExpiracao > DateTime.Today).Count().ToString() + " / " + context.Associado.Count().ToString();
        //}
    }
}