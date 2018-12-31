using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class PagamentoGroupViewModel
    {
        public List<PagamentoViewModel> Pendente { get; set; }
        public List<PagamentoViewModel> Pago { get; set; }

        public PagamentoGroupViewModel()
        {
            Pendente = new List<PagamentoViewModel>();
            Pago = new List<PagamentoViewModel>();
        }
    }

    public class PagamentoViewModel
    {
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public int IdPlano { get; set; }
        public string Valor { get; set; }
        public int Dias { get; set; }
        public string Descricao { get; set; }
        public string DataCriacao { get; set; }
        public string DataConfirmacao { get; set; }
        public string CheckoutIdentifier { get; set; }
        public string TipoPlanoFormatado { get; set; }
        public string Situacao { get; set; }

        public PagamentoViewModel(Pagamento obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            IdCliente = obj.IdCliente;
            IdPlano = obj.IdPlano;
            Valor = String.Format("{0:C}", obj.Valor);
            Dias = obj.Dias;
            Descricao = obj.Descricao;
            DataCriacao = obj.DataCriacao.ToString("dd/MM/yyyy");
            DataConfirmacao = obj.DataConfirmacao?.ToString("dd/MM/yyyy");
            CheckoutIdentifier = obj.CheckoutIdentifier;
            TipoPlanoFormatado = obj.Plano.TipoPlano == "A" ? "Pagamento de assinatura" : "Pagamento de banner";
            Situacao = GetSituacao(obj.Situacao);
        }

        public static string GetSituacao(int s)
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