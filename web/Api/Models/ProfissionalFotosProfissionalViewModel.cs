using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ProfissionalFotosProfissionalViewModel
    {
        public string Id { get; set; }
        public string Imagem { get; set; }
        public int Ordem { get; set; }

        public ProfissionalFotosProfissionalViewModel()
        {
            Imagem = "imgs/placeholder.png";
        }

        public ProfissionalFotosProfissionalViewModel(ProfissionalFotos obj)
        {
            Id = obj.Id;
            Imagem = obj.Imagem;
            Ordem = obj.Ordem;
        }
    }
}