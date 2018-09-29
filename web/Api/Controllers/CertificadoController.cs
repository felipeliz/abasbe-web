using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class CertificadoController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;
            
            Entities context = new Entities();
            List<CertificadoViewModel> lista = new List<CertificadoViewModel>();

            var query = context.Certificado.Where(cer => cer.Descricao.Contains(descricao)).ToList();
            
            query.ToList().ForEach(obj =>
            {
                lista.Add(new CertificadoViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public CertificadoViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Certificado.FirstOrDefault(cer => cer.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new CertificadoViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Certificado.FirstOrDefault(cer => cer.Id == id) ?? new Certificado();
            obj.Descricao = param.Descricao.ToString();

            if (id <= 0)
            {
                context.Certificado.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Certificado.FirstOrDefault(cer => cer.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Certificado.Remove(obj);
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