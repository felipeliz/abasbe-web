using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class CidadeViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string EstadoSigla { get; set; }
        public bool Capital { get; set; }
        public string Situacao { get; set; }

        public CidadeViewModel(Cidade obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            EstadoSigla = obj.Estado.Sigla;
            Capital = obj.Capital;
            Situacao = obj.Situacao.ToString();
        }
    }
}