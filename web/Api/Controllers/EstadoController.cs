using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using NLog;

namespace Api.Controllers
{
    public class EstadoController : ApiController
    {
        [HttpPost]
        public PagedList lista([FromBody] dynamic param)
        {
            string sigla = param.Sigla;
            string nome = param.Nome;

            Entities context = new Entities();
            List<EstadoViewModel> lista = new List<EstadoViewModel>();

            var query = context.Estado.Where(uf => uf.Sigla.Contains(sigla) && uf.Nome.Contains(nome));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(uf => uf.Nome));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new EstadoViewModel(obj as Estado)));

            return paged;
        }



        [HttpGet]
        public EstadoViewModel obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Estado.FirstOrDefault(uf => uf.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new EstadoViewModel(obj);
        }

        [HttpPost]
        public bool salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);


            Entities context = new Entities();
            var obj = context.Estado.FirstOrDefault(uf => uf.Id == id) ?? new Estado();

            obj.Sigla = param.Sigla.ToString();
            obj.Nome = param.Nome.ToString();
            obj.Situacao = Convert.ToBoolean(param.Situacao);

            if (id <= 0)
            {
                context.Estado.Add(obj);
            }

            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Estado.FirstOrDefault(pla => pla.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Estado.Remove(obj);
                    context.SaveChanges();
                }
                catch(Exception ex)
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }
        }

        [HttpGet]
        public List<EstadoViewModel> Todos()
        {
            Entities context = new Entities();
            List<EstadoViewModel> lista = new List<EstadoViewModel>();

            var query = context.Estado.ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new EstadoViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public List<CidadeViewModel> Cidades(int id)
        {
            Entities context = new Entities();
            List<CidadeViewModel> lista = new List<CidadeViewModel>();

            var capital = context.Cidade.FirstOrDefault(cid => cid.IdEstado == id && cid.Capital == true);
            if (capital != null)
            {
                lista.Add(new CidadeViewModel(capital));
            }

            var query = context.Cidade.Where(cid => cid.IdEstado == id && cid.Capital == false).ToList();
            query.ToList().ForEach(obj =>
            {
                lista.Add(new CidadeViewModel(obj));
            });

            return lista;
        }


        [HttpGet]
        public List<CidadeViewModel> CidadesUsados()
        {
            Entities context = new Entities();
            List<CidadeViewModel> lista = new List<CidadeViewModel>();

            var query = context.Cidade.Where(cid => cid.Cliente.Any(cli => cli.Situacao == true));

            query.OrderBy(dis => dis.Cliente.Count()).ToList().ForEach(obj =>
            {
                lista.Add(new CidadeViewModel(obj));
            });

            return lista;
        }
    }
}