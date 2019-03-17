﻿using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class PagamentoViewModel
    {
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public int IdPlano { get; set; }
        public string Valor { get; set; }
        public int Dias { get; set; }
        public string Descricao { get; set; }
        public string Observacao { get; set; }
        public string DataCriacao { get; set; }
        public string DataConfirmacao { get; set; }
        public string CheckoutIdentifier { get; set; }
        public string TipoPlanoFormatado { get; set; }
        public string Referencia { get; set; }
        public string Situacao { get; set; }
        public int SituacaoValue { get; set; }
        public int Vezes { get; set; }
        public string ValorDivididoFormatado { get; set; }
        public string NomeCliente { get; set; }
        public string CPFCliente { get; set; }
        public string NomeEstado { get; set; }
        public string NomeCidade { get; set; }
        public string TipoPlanoFormatadoCompleto { get; set; }


        public PagamentoViewModel()
        {

        }

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
            SituacaoValue = obj.Situacao;
            Vezes = obj.Vezes;
            ValorDivididoFormatado = String.Format("{0:C}", obj.Valor / Vezes);
            NomeCliente = obj.Cliente.Nome;
            CPFCliente =  string.IsNullOrEmpty(obj.Cliente.CPF) ? obj.Cliente.CPF : Convert.ToUInt64(obj.Cliente.CPF).ToString(@"000\.000\.000-00");
            NomeEstado = obj.Cliente.Cidade.Estado.Nome;
            NomeCidade = obj.Cliente.Cidade.Nome;


            if (obj.Plano.TipoPlano == "A")
            {
                TipoPlanoFormatadoCompleto = "Associado";
            }
            else if (obj.Plano.TipoPlano == "P")
            {
                TipoPlanoFormatadoCompleto = "Profissional";
            }
            else
            {
                TipoPlanoFormatadoCompleto = "Banner";
            }


            if (obj.Banner != null)
            {
                Referencia = obj.Banner.Titulo;
            }

            Observacao = obj.Plano.TipoPlano == "A" ? "Renovação da assinatura por " + obj.Dias + " dias" : "Publicação de banner por " + obj.Dias + " dias";

        }

        public static string GetSituacao(int s)
        {
            switch (s)
            {
                case 0: return "Novo";
                case 1: return "Esperando pagamento";
                case 2: return "Em análise";
                case 3: return "Pago";
                case 4: return "Disponível";
                case 5: return "Em disputa";
                case 6: return "Reembolsado";
                case 7: return "Cancelado";
                default: return "Indefinido";
            }
        }
    }
}