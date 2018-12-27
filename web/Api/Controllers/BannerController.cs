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

            Entities context = new Entities();
            List<BannerViewModel> lista = new List<BannerViewModel>();

            var query = context.Banner.Where(ban => ban.Titulo.Contains(titulo)).ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new BannerViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
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
        public List<BannerViewModel> EmExibicao([FromBody] dynamic param)
        {
            Entities context = new Entities();
            List<BannerViewModel> lista = new List<BannerViewModel>();
            DateTime now = DateTime.Now;

            var query = context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao == "A").ToList();

            query.OrderBy(ban => ban.Cadastro).ToList().ForEach(obj =>
            {
                lista.Add(new BannerViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public BannerGroupViewModel MeusBanners([FromBody] dynamic param)
        {
            int cliente = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();
            DateTime now = DateTime.Now;

            BannerGroupViewModel group = new BannerGroupViewModel();

            context.Banner.Where(ban => ban.Expiracao > now && now > ban.Estreia && ban.Situacao != "I").ToList().ForEach(obj =>
            {
                group.EmExibicao.Add(new BannerViewModel(obj));
            });

            context.Banner.Where(ban => ban.Expiracao > now && now < ban.Estreia && ban.Situacao != "I").ToList().ForEach(obj =>
            {
                group.EmEspera.Add(new BannerViewModel(obj));
            });

            context.Banner.Where(ban => ban.Expiracao < now && ban.Situacao != "I").ToList().ForEach(obj =>
            {
                group.Expirados.Add(new BannerViewModel(obj));
            });

            return group;
        }
    }
}