using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class PlanoViewModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public int Dias { get; set; }
        public int Vezes { get; set; }
        public decimal Valor { get; set; }
        public string ValorFormatado { get; set; }
        public string TipoPlano { get; set; }

        public PlanoViewModel(Plano obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Descricao = obj.Descricao;
            Dias = obj.Dias;
            Vezes = obj.Vezes ?? 1;
            Valor = obj.Valor;
            TipoPlano = obj.TipoPlano;
            ValorFormatado = String.Format("{0:C}", Valor);
        }
    }
}