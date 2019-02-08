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
            string tipoPlano = param.TipoPlano?.ToString();

            Entities context = new Entities();
            List<PlanoViewModel> lista = new List<PlanoViewModel>();

            var query = context.Plano.Where(pla => pla.Descricao.Contains(descricao));
            if (tipoPlano != "")
            {
                query = query.Where(obj => obj.TipoPlano == tipoPlano);
            }
            
            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Descricao));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new PlanoViewModel(obj as Plano)));
            return paged;
        }

        [HttpGet]
        public PlanoViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Plano.FirstOrDefault(pla => pla.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new PlanoViewModel(obj);
        }

        [HttpPost]
        public bool Assinar([FromBody] dynamic param)
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);
            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            var idPlano = Convert.ToInt32(param.Id);


            Plano plano = context.Plano.Find(idPlano);

            cliente.Plano = plano;

            Pagamento pagamento = new Pagamento();
            pagamento.Cliente = cliente;
            pagamento.Plano = plano;
            pagamento.Situacao = 0;
            pagamento.Valor = plano.Valor;
            pagamento.CheckoutIdentifier = Guid.NewGuid().ToString();
            pagamento.DataCriacao = DateTime.Now;
            pagamento.Dias = plano.Dias;
            pagamento.Descricao = plano.Descricao;
            pagamento.Vezes = plano.Vezes;

            context.Pagamento.Add(pagamento);

            return context.SaveChanges() > 0;
        }

        [HttpGet]
        public bool CancelarAssinatura()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);
            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            cliente.Pagamento.Where(pag => pag.Plano.TipoPlano == "A" && pag.Situacao == 0).ToList().ForEach(obj =>
            {
                obj.Situacao = 2;
            });

            cliente.IdPlano = null;

            return context.SaveChanges() > 0;
        }

        [HttpGet]
        public List<PlanoViewModel> PlanosAssinatura()
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);
            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            if(cliente.Plano != null)
            {
                throw new Exception("has_plan");
            }

            string tipo = cliente.FlagCliente == "P" ? "P" : "A";

            var query = context.Plano.Where(pla => pla.TipoPlano == tipo);
            List<PlanoViewModel> lista = new List<PlanoViewModel>();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new PlanoViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public List<PlanoViewModel> PlanosBanner()
        {
            Entities context = new Entities();

            var query = context.Plano.Where(pla => pla.TipoPlano == "B");
            List<PlanoViewModel> lista = new List<PlanoViewModel>();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new PlanoViewModel(obj));
            });

            return lista;
        }

        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Plano.FirstOrDefault(pla => pla.Id == id) ?? new Plano();
            obj.Descricao = param.Descricao.ToString();
            obj.Dias = Convert.ToInt32(param.Dias);
            obj.Vezes = Convert.ToInt32(param.Vezes);
            obj.Valor = Convert.ToDecimal(param.Valor);
            obj.TipoPlano = param.TipoPlano.ToString();

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

            var obj = context.Plano.FirstOrDefault(pla => pla.Id == id);
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