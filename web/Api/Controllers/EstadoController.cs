using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class EstadoController : ApiController
    {
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