using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class CidadeController : ApiController
    {
        [HttpPost]
        public PagedList lista([FromBody] dynamic param)
        {
            string nome = param.Nome;

            Entities context = new Entities();
            List<CidadeViewModel> lista = new List<CidadeViewModel>();

            var query = context.Cidade.Where(city => city.Nome.Contains(nome));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(city => city.Nome));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new CidadeViewModel(obj as Cidade)));

            return paged;
        }

        [HttpGet]
        public CidadeViewModel obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Cidade.FirstOrDefault(city => city.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new CidadeViewModel(obj);
        }

        [HttpPost]
        public bool salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);


            Entities context = new Entities();
            var obj = context.Cidade.FirstOrDefault(city => city.Id == id) ?? new Cidade();

            obj.Nome = param.Nome.ToString();
            obj.Capital = Convert.ToBoolean(param.Capital);
            obj.IdEstado = Convert.ToInt32(param.IdEstado);
            obj.Situacao = Convert.ToBoolean(param.Situacao);

            if (id <= 0)
            {
                context.Cidade.Add(obj);
            }

            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Cidade.FirstOrDefault(city => city.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Cidade.Remove(obj);
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