using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class BannerController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string titulo = param.Titulo;
            string situacaoPagamento = param.SituacaoPagamento;
            string situacao = param.Situacao;
            string estreia = param.Estreia;
            string expiracao = param.Expiracao;

            Entities context = new Entities();

            var query = context.Banner.Where(ban => ban.Titulo.Contains(titulo));

            if (!string.IsNullOrEmpty(situacao))
            {
                query = query.Where(ban => ban.Situacao == situacao);
            }

            if (!string.IsNullOrEmpty(situacaoPagamento))
            {
                int situPag = Convert.ToInt32(situacaoPagamento);
                query = query.Where(ban => ban.Pagamento.Any(pag => pag.Situacao == situPag));
            }

            if (!string.IsNullOrEmpty(estreia))
            {
                DateTime dtEstreia = AppExtension.ToDateTime(param.Estreia);

                query = query.Where(ban => ban.Estreia >= dtEstreia);
            }

            if (!string.IsNullOrEmpty(expiracao))
            {
                DateTime dtExpiracao = AppExtension.ToDateTime(param.Expiracao);
                query = query.Where(ban => ban.Expiracao <= dtExpiracao);
            }

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderByDescending(ban => ban.Cadastro));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new BannerViewModel(obj as Banner)));

            return paged;
        }

        [HttpGet]
        public BannerViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Banner.FirstOrDefault(ban => ban.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new BannerViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Banner.FirstOrDefault(ban => ban.Id == id) ?? new Banner();
            if (Convert.ToInt32(param.IdTipoAcao) == 0)
            {
                obj.Link = param.Link.ToString();
                obj.Telefone = null;
            }
            else
            {
                obj.Link = null;
                obj.Telefone = param.Telefone.ToString();
            }
            obj.IdCliente = Convert.ToInt32(param.Cliente.Id);
            obj.Descricao = param.Descricao.ToString();
            obj.Titulo = param.Titulo.ToString();
            obj.Estreia = AppExtension.ToDateTime(param.Estreia);
            obj.Expiracao = AppExtension.ToDateTime(param.Expiracao);
            obj.Imagem = FileController.ConfirmUpload(param.Imagem?.ToString());
            obj.Situacao = param.Situacao.ToString();

            if (id <= 0)
            {
                obj.Cadastro = DateTime.Now;
                context.Banner.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpPost]
        public bool Publicar([FromBody] dynamic param)
        {
            Entities context = new Entities();
            Banner obj = new Banner();
            Plano plano = context.Plano.Find(Convert.ToInt32(param.IdPlano));
            Cliente cliente = context.Cliente.Find(AppExtension.IdUsuarioLogado());

            if (AppExtension.ToDateTime(param.Estreia) < DateTime.Today)
            {
                throw new Exception("Você não pode publicar um banner retroativo.");
            }

            if (Convert.ToInt32(param.IdTipoAcao) == 0)
            {
                obj.Link = param.Link.ToString();
                obj.Telefone = null;
            }
            else
            {
                obj.Link = null;
                obj.Telefone = param.Telefone.ToString();
            }
            obj.IdCliente = cliente.Id;
            obj.Descricao = param.Descricao.ToString();
            obj.Titulo = param.Titulo.ToString();
            obj.Estreia = Convert.ToDateTime(param.Estreia?.ToString() + " " + param.EstreiaHorario?.ToString());
            obj.Expiracao = obj.Estreia.AddDays(plano.Dias);
            obj.Situacao = param.Situacao.ToString();

            obj.Cadastro = DateTime.Now;
            obj.Imagem = FileController.SaveFile(param.Imagem?.ToString(), ".jpg");

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

            obj.Pagamento.Add(pagamento);

            context.Banner.Add(obj);

            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Banner.FirstOrDefault(ban => ban.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Banner.Remove(obj);
                    context.SaveChanges();
                }
                catch
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }
        }

        [HttpPost]
        public string ObterQtdBannersAtivosETotal([FromBody] dynamic param)
        {
            Entities context = new Entities();
            return context.Banner.Where(ban => ban.Expiracao.Day > DateTime.Today.Day).Count().ToString() + " / " + context.Banner.Count().ToString();
        }

        [HttpPost]
        public InfinityPagedList<BannerViewModel> EmExibicao([FromBody] dynamic param)
        {
            int pageSize = 3;

            Entities context = new Entities();
            List<BannerViewModel> lista = new List<BannerViewModel>();
            DateTime now = DateTime.Now;

            List<int> excludes = new List<int>();

            foreach (int exc in param.Excludes)
            {
                excludes.Add(exc);
            }

            int page = Convert.ToInt32(param.page);

            var query = context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "A");
            query = query.Where(ban => excludes.Contains(ban.Id) == false);
            query = query.OrderBy(r => Guid.NewGuid());
            query = query.Take(pageSize);

            query.ToList().ForEach(obj =>
            {
                obj.Contador = obj.Contador == null ? 1 : obj.Contador + 1;
                lista.Add(new BannerViewModel(obj));
            });

            context.SaveChanges();

            InfinityPagedList<BannerViewModel> paged = new InfinityPagedList<BannerViewModel>();
            paged.list = lista;
            paged.pageSize = pageSize;
            paged.current = page;

            return paged;
        }

        [HttpPost]
        public InfinityPagedList<BannerViewModel> MeusBanners([FromBody] dynamic param)
        {
            int page = Convert.ToInt32(param.page);
            int pageSize = 5;
            string status = param.status.ToString();

            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();
            DateTime now = DateTime.Now;

            List<BannerViewModel> list = new List<BannerViewModel>();
            var query = context.Banner.AsQueryable();

            if (status == "EXIBICAO")
            {
                query = query.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "A" && ban.IdCliente == cliente);
            }
            else if (status == "ESPERA")
            {
                query = query.Where(ban =>
                ((ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "E") ||
                (ban.Expiracao > now && now < ban.Estreia && ban.Situacao != "I")) &&
                ban.IdCliente == cliente);
            }
            else if (status == "EXPIRADO")
            {
                query = query.Where(ban => ban.Expiracao < now && ban.Situacao != "I" && ban.IdCliente == cliente);
            }

            query.OrderByDescending(ban => ban.Cadastro).Skip(page * pageSize).Take(pageSize).ToList().ForEach(obj =>
            {
                list.Add(new BannerViewModel(obj));
            });

            InfinityPagedList<BannerViewModel> paged = new InfinityPagedList<BannerViewModel>();
            paged.list = list;
            paged.pageSize = pageSize;
            paged.current = page;

            return paged;
        }

        [HttpGet]
        public bool Desabilitar(int id)
        {
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var banner = context.Banner.FirstOrDefault(ban => ban.Id == id && ban.IdCliente == cliente);
            if (banner == null)
            {
                throw new Exception("Registro não identificado.");
            }

            banner.Situacao = "I";
            return context.SaveChanges() > 0;
        }
    }
}