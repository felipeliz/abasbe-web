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
        public string Capital { get; set; }
        public string Situacao { get; set; }
        public string EstadoNome { get; set; }


        public int IdEstado { get; set; }
        public CidadeViewModel(Cidade obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            EstadoNome = obj.Estado.Nome;
            Capital = obj.Capital.ToString();
            Situacao = obj.Situacao.ToString();
            IdEstado = obj.IdEstado;
        }
    }
}