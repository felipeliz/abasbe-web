using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class BannerViewModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public string Titulo { get; set; }
        public string Expiracao { get; set; }
        public string Imagem { get; set; }
        public string Link { get; set; }
        public string Telefone { get; set; }
        
        public BannerViewModel(Banner obj)
        {
            if (obj == null)
            {
                return;
            }
           
            Id = obj.Id;
            Descricao = obj.Descricao;
            Expiracao = obj.Expiracao?.ToString("dd/MM/yyyy");
            Titulo = obj.Titulo;
            Imagem = obj.Imagem;
            Telefone = obj.Telefone;
            Link = obj.Link;
        }
    }
}