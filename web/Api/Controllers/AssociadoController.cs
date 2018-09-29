using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
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
            string nome = param.Nome;

            Entities context = new Entities();
            List<AssociadoViewModel> lista = new List<AssociadoViewModel>();

            var query = context.Associado.Where(obj => obj.Nome.Contains(nome)).ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new AssociadoViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public AssociadoViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Associado.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new AssociadoViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Associado.FirstOrDefault(pro => pro.Id == id) ?? new Associado();

            obj.Nome = param.Nome?.ToString();
            obj.Senha = param.Senha?.ToString();
            obj.Email = param.Email?.ToString();
            obj.Telefone = param.Telefone?.ToString();
            obj.DataExpiracao = AppExtension.ToDateTime(param.DataExpiracao);
            obj.Situacao = Convert.ToBoolean(param.Situacao);

            if (obj.Senha.Count() < 4)
            {
                throw new Exception("A senha precisa ter mais do que 4 caracteres.");
            }

            if (id <= 0)
            {
                context.Associado.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Associado.FirstOrDefault(pro => pro.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Associado.Remove(obj);
                    context.SaveChanges();
                }
                catch
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }
        }
    }
}
