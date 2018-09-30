using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class PlanoController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<PlanoViewModel> lista = new List<PlanoViewModel>();

            var query = context.Plano.Where(cer => cer.Descricao.Contains(descricao)).ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new PlanoViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public PlanoViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Plano.FirstOrDefault(cer => cer.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new PlanoViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Plano.FirstOrDefault(cer => cer.Id == id) ?? new Plano();
            obj.Descricao = param.Descricao.ToString();
            obj.Dias = Convert.ToInt32(param.Dias);
            obj.Valor = Convert.ToDecimal(param.Valor);

            if (id <= 0)
            {
                context.Plano.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Plano.FirstOrDefault(cer => cer.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Plano.Remove(obj);
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