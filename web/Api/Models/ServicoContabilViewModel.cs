﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ServicoContabilViewModel
    {
        public int Id { get; set; }
        public string TipoServico { get; set; }
        public string TipoServicoFormatado { get; set; }
        public string DataSolicitacao { get; set; }
        public string DataAlteracao { get; set; }
        public string Status { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Observacao { get; set; }
        public string NomeCompleto { get; set; }
        public string Cpf { get; set; }
        public string DataNascimento { get; set; }
        public string TituloEleitor { get; set; }
        public string Cnpj { get; set; }
        public string SenhaPrefeitura { get; set; }
        public string DataReferencia { get; set; }
        public string CodigoSimplesNacional { get; set; }
        public string CnpjContratante { get; set; }
        public string NomeContratante { get; set; }
        public string DescricaoServico { get; set; }
        public decimal? ValorServico { get; set; }
        public string SituacaoFormatada { get; set; }
        public string SituacaoPagamentoFormatada { get; set; }
        public int SituacaoPagamentoValue { get; set; }
        public SimpleClienteViewModel Cliente { get; set; }
        public List<PagamentoViewModel> Pagamentos { get; set; }
        public string Rg { get; set; }

        public ServicoContabilViewModel(ServicoContabil obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;

            TipoServico = obj.TipoServico;
            DataSolicitacao = obj.DataSolicitacao.ToString("dd/MM/yyyy");
            DataAlteracao = obj.DataAlteracao.ToString("dd/MM/yyyy");
            Status = obj.Status;
            Observacao = obj.Observacao;
            NomeCompleto = obj.NomeCompleto;
            Cpf = obj.Cpf;
            DataNascimento = obj.DataNascimento?.ToString("dd/MM/yyyy");
            TituloEleitor = obj.TituloEleitor;
            Cnpj = obj.Cnpj;
            SenhaPrefeitura = obj.SenhaPrefeitura;
            Email = obj.Email;
            Telefone = obj.Telefone;
            DataReferencia = obj.DataReferencia;
            CodigoSimplesNacional = obj.CodigoSimplesNacional;
            CnpjContratante = obj.CnpjContratante;
            NomeContratante = obj.NomeContratante;
            DescricaoServico = obj.DescricaoServico;
            ValorServico = obj.ValorServico;
            Rg = obj.Rg;

            SituacaoPagamentoFormatada = "N/A";
            SituacaoPagamentoValue = 0;

            switch (obj.Status)
            {
                case "N": SituacaoFormatada = "Novo"; break;
                case "R": SituacaoFormatada = "Resolvido"; break;
                case "C": SituacaoFormatada = "Cancelado"; break;
                case "A": SituacaoFormatada = "Em Andamento"; break;
            }
            
            switch (obj.TipoServico)
            {
                case "MEI": TipoServicoFormatado = "Abertura de MEI"; break;
                case "DAS": TipoServicoFormatado = "Solicitação de DAS"; break;
                case "NFE": TipoServicoFormatado = "Emitir Nota Fiscal"; break;
                case "SME": TipoServicoFormatado = "Declaração Anual (SIMEI)"; break;
                case "REG": TipoServicoFormatado = "Regularizar MEI"; break;
                case "MAT": TipoServicoFormatado = "Solicitar Licença Maternidade"; break;
                case "AUX": TipoServicoFormatado = "Solicitar Auxílio Doença"; break;

            }

            Cliente = new SimpleClienteViewModel(obj.Cliente);

            Pagamentos = new List<PagamentoViewModel>();
            obj.Pagamento.OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                SituacaoPagamentoFormatada = PagamentoViewModel.GetSituacao(pag.Situacao);
                SituacaoPagamentoValue = pag.Situacao;
                Pagamentos.Add(new PagamentoViewModel(pag));
            });
        }
    }
}