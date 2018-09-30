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
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<BannerViewModel> lista = new List<BannerViewModel>();

            var query = context.Banner.Where(ban => ban.Titulo.Contains(descricao)).ToList();

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
            obj.Descricao = param.Descricao.ToString();
            obj.Titulo = param.Titulo.ToString();
            obj.Expiracao = AppExtension.ToDateTime(param.Expiracao);
            obj.Imagem = param.Imagem?.ToString();

            if (id <= 0)
            {
                context.Banner.Add(obj);
            }
            //upload(param);
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
        public string upload([FromBody] dynamic param)
        {
            if (Convert.ToBoolean(param.hasFile))
            {
                string ext = param.ext.ToString();
                string base64 = param.base64.ToString().Split(',')[1];
                string uploadFolder = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "uploads";
                string fileName = Guid.NewGuid() + ext;

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                string filter = param.filter?.ToString();
               
                File.WriteAllBytes(uploadFolder + "/" + fileName, Convert.FromBase64String(base64));

                Thread.Sleep(1500);

                return "uploads" + "/" + fileName;
            }
            throw new Exception("Não foi possivel adicionar o arquivo.");
        }
    }
}