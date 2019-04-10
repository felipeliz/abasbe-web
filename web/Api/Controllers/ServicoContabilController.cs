using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class ServicoContabilController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string cliente = param.Cliente?.ToString();
            string situacaoPagamento = param.SituacaoPagamento;
            string status = param.Status?.ToString();
            string data = param.Data?.ToString();
            string tiposervico = param.TipoServico?.ToString(); 

            Entities context = new Entities();

            var query = context.ServicoContabil.AsQueryable();

            if (!string.IsNullOrEmpty(cliente))
            {
                query = query.Where(pag => pag.NomeCompleto.Contains(cliente) || pag.Cpf.Contains(cliente));
            }
            
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(ban => ban.Status == status);
            }

            if (!string.IsNullOrEmpty(tiposervico))
            {
                query = query.Where(ban => ban.TipoServico == tiposervico);
            }

            if (!string.IsNullOrEmpty(situacaoPagamento))
            {
                int situPag = Convert.ToInt32(situacaoPagamento);
                query = query.Where(ban => ban.Pagamento.Any(pag => pag.Situacao == situPag));
            }

            if (!string.IsNullOrEmpty(data))
            {
                DateTime de = AppExtension.ToDateTime(param.Data);

                query = query.Where(pag => pag.DataSolicitacao >= de);
       
                DateTime ate = AppExtension.ToDateTime(param.Data);
                ate = ate.AddHours(23);
                ate = ate.AddMinutes(59);
                ate = ate.AddSeconds(59);
                query = query.Where(pag => pag.DataSolicitacao <= ate);
            }

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(ban => ban.DataSolicitacao).ThenByDescending(ban => ban.TipoServico));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new ServicoContabilViewModel(obj as ServicoContabil)));

            return paged;
        }

        [HttpGet]
        public ServicoContabilViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.ServicoContabil.FirstOrDefault(ban => ban.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ServicoContabilViewModel(obj);
        }


        [HttpGet]
        public bool Desabilitar(int id)
        {
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var serv = context.ServicoContabil.FirstOrDefault(ser => ser.Id == id && ser.IdCliente == cliente);
            if (serv == null)
            {
                throw new Exception("Registro não identificado.");
            }

            serv.Status = "C";
            return context.SaveChanges() > 0;
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.ServicoContabil.FirstOrDefault(ban => ban.Id == id) ?? new ServicoContabil();

            obj.TipoServico = param.TipoServico?.ToString();
            obj.DataAlteracao = DateTime.Now;
            obj.Status = param.Status?.ToString();
            obj.Observacao = param.Observacao?.ToString();
            obj.NomeCompleto = param.NomeCompleto?.ToString();
            obj.Email = param.Email?.ToString();
            obj.Telefone = param.Telefone?.ToString();
            obj.Cpf = param.Cpf?.ToString();
            obj.Rg = param.Rg?.ToString();
            obj.Endereco = param.Endereco?.ToString();
            obj.DataNascimento = AppExtension.ToDateTime(param.DataNascimento);
            obj.TituloEleitor = param.TituloEleitor?.ToString();
            obj.Cnpj = param.Cnpj?.ToString();
            obj.SenhaPrefeitura = param.SenhaPrefeitura?.ToString();
            obj.DataReferencia = param.DataReferencia?.ToString();
            obj.CodigoSimplesNacional = param.CodigoSimplesNacional?.ToString();
            obj.CnpjContratante = param.CnpjContratante?.ToString();
            obj.NomeContratante = param.NomeContratante?.ToString();
            obj.DescricaoServico = param.DescricaoServico?.ToString();
            obj.ValorServico = string.IsNullOrEmpty(param.ValorServico?.ToString()) ? null : Convert.ToDecimal(param.ValorServico?.ToString());

            if (obj.Id <= 0)
            {
                obj.Status = "N";

                Cliente cliente = context.Cliente.Find(AppExtension.IdUsuarioLogado());

                obj.Cliente = cliente;
                obj.DataSolicitacao = DateTime.Now;
                context.ServicoContabil.Add(obj);

                Plano plano = context.Plano.Where(pla => pla.TipoPlano == obj.TipoServico).OrderBy(pla => pla.Ordem).FirstOrDefault();

                if (plano == null)
                {
                    throw new Exception("Não há plano disponível para esse serviço");
                }

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
                pagamento.TipoPlano = plano.TipoPlano;
                pagamento.BeneficioAplicado = "N";

                obj.Pagamento.Add(pagamento);
            }

            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                throw ex;
            }

            return true;
        }


        [HttpPost]
        public InfinityPagedList<ServicoContabilViewModel> MeusServicoSolicitados([FromBody] dynamic param)
        {
            int page = Convert.ToInt32(param.page);
            int pageSize = 5;
            string status = param.status?.ToString();
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();
            DateTime now = DateTime.Now;

            List<ServicoContabilViewModel> list = new List<ServicoContabilViewModel>();
            var query = context.ServicoContabil.AsQueryable();

            query = query.Where(ban => ban.IdCliente == cliente);

            query = query.Where(ban => ban.Status == status);

            query.OrderByDescending(ban => ban.DataSolicitacao).Skip(page * pageSize).Take(pageSize).ToList().ForEach(obj =>
            {
                list.Add(new ServicoContabilViewModel(obj));
            });

            InfinityPagedList<ServicoContabilViewModel> paged = new InfinityPagedList<ServicoContabilViewModel>();
            paged.list = list;
            paged.pageSize = pageSize;
            paged.current = page;

            return paged;
        }
    }
}