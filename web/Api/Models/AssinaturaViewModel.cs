using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class AssinaturaViewModel
    {
        public SimpleClienteViewModel Cliente { get; set; }
        public PlanoViewModel Plano { get; set; }
        public AssinaturaViewModel(Cliente cli, Plano pla)
        {
            Cliente = new SimpleClienteViewModel(cli);
            Plano = new PlanoViewModel(pla);
        }
    }
}