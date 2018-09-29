using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class AssociadoPagamentoViewModel
    {
        public int Id { get; set; }
        public int IdAssociado { get; set; }
        public int IdPlano { get; set; }
        public string Valor { get; set; }
        public int Dias { get; set; }
        public string Descricao { get; set; }
        public string Situacao { get; set; }

        public AssociadoPagamentoViewModel(AssociadoPagamento obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            IdAssociado = obj.IdAssociado;
            IdPlano = obj.IdPlano;
            Valor = "R$ " + obj.Valor;
            Dias = obj.Dias;
            Descricao = obj.Descricao;
            Situacao = GetSituacao(obj.Situacao);
        }

        public string GetSituacao(int s)
        {
            switch (s)
            {
                case 0: return "Pendente";
                case 1: return "Pago";
                case 2: return "Cancelado";
                default: return "Indefinido";
            }
        }
    }
}