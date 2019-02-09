using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class EstadoViewModel
    {
        public int Id { get; set; }
        public string Sigla { get; set; }
        public string Nome { get; set; }
        public string Situacao { get; set; }

        public EstadoViewModel(Estado obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Sigla = obj.Sigla;
            Nome = obj.Nome;
            Situacao = obj.Situacao.ToString();
        }
    }
}