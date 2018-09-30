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
        public bool Capital { get; set; }

        public CidadeViewModel(Cidade obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            Capital = obj.Capital;
        }
    }
}