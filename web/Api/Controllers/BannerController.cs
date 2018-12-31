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

                query = query.Where(ban => ban.Estreia >= dtEstreia );
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
                obj.Telefone = "";
            }
            else
            {
                obj.Link = "";
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
                obj.Telefone = "";
            }
            else
            {
                obj.Link = "";
                obj.Telefone = param.Telefone.ToString();
            }
            obj.IdCliente = cliente.Id;
            obj.Descricao = param.Descricao.ToString();
            obj.Titulo = param.Titulo.ToString();
            obj.Estreia = AppExtension.ToDateTime(param.Estreia);
            obj.Expiracao = obj.Estreia.AddDays(plano.Dias);
            obj.Situacao = param.Situacao.ToString();
            obj.Imagem = FileController.ConfirmUpload(param.Imagem?.ToString());
            obj.Cadastro = DateTime.Now;

            Pagamento pagamento = new Pagamento();
            pagamento.Cliente = cliente;
            pagamento.Plano = plano;
            pagamento.Situacao = 0;
            pagamento.Valor = plano.Valor;
            pagamento.CheckoutIdentifier = Guid.NewGuid().ToString();
            pagamento.DataCriacao = DateTime.Now;
            pagamento.Dias = plano.Dias;
            pagamento.Descricao = plano.Descricao;

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

        [HttpGet]
        public List<BannerViewModel> EmExibicao()
        {
            Entities context = new Entities();
            List<BannerViewModel> lista = new List<BannerViewModel>();
            DateTime now = DateTime.Now;

            var query = context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "A").ToList();

            query.OrderBy(ban => ban.Cadastro).ToList().ForEach(obj =>
            {
                obj.Contador = obj.Contador == null ? 1 : obj.Contador + 1;
                lista.Add(new BannerViewModel(obj));
            });

            context.SaveChanges();

            return lista;
        }

        [HttpGet]
        public BannerGroupViewModel MeusBanners()
        {
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();
            DateTime now = DateTime.Now;

            BannerGroupViewModel group = new BannerGroupViewModel();

            context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "A" && ban.IdCliente == cliente).ToList().ForEach(obj =>
            {
                group.EmExibicao.Add(new BannerViewModel(obj));
            });

            context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "E" && ban.IdCliente == cliente).ToList().ForEach(obj =>
            {
                group.EmEspera.Add(new BannerViewModel(obj));
            });

            context.Banner.Where(ban => ban.Expiracao > now && now < ban.Estreia && ban.Situacao != "I" && ban.IdCliente == cliente).ToList().ForEach(obj =>
            {
                group.EmEspera.Add(new BannerViewModel(obj));
            });

            context.Banner.Where(ban => ban.Expiracao < now && ban.Situacao != "I" && ban.IdCliente == cliente).ToList().ForEach(obj =>
            {
                group.Expirados.Add(new BannerViewModel(obj));
            });

            return group;
        }

        [HttpGet]
        public BannerGroupViewModel Desabilitar(int id)
        {
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var banner = context.Banner.FirstOrDefault(ban => ban.Id == id && ban.IdCliente == cliente);
            if (banner == null)
            {
                throw new Exception("Registro não identificado.");
            }

            banner.Pagamento.Where(pag => pag.Situacao == 0).ToList().ForEach(pag =>
            {
                pag.Situacao = 2;
            });

            banner.Situacao = "I";
            context.SaveChanges();

            return MeusBanners();
        }
    }
}