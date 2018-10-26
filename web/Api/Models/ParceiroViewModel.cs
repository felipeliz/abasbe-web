﻿using Api;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ParceiroViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string NomeEmpresa { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Telefone { get; set; }
        public string DataExpiracao { get; set; }
        public string Situacao { get; set; }
        public string Cnpj { get; set; }
        public string Token { get; set; }
        public List<ParceiroPagamentoViewModel> Pagamentos { get; set; }

        public ParceiroViewModel(Parceiro obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            NomeEmpresa = obj.NomeEmpresa;
            Email = obj.Email;
            Senha = obj.Senha;
            Telefone = string.IsNullOrEmpty(obj.Telefone) ? obj.Telefone : Convert.ToUInt64(obj.Telefone).ToString(@"(00) 00000-0000");
            DataExpiracao = obj.DataExpiracao.ToString("dd/MM/yyyy");
            Situacao = obj.Situacao.ToString();
            Cnpj = Convert.ToUInt64(obj.Cnpj).ToString(@"00\.000\.000/0000-00");

            Pagamentos = new List<ParceiroPagamentoViewModel>();
            obj.ParceiroPagamento.OrderByDescending(par => par.DataCriacao).ToList().ForEach(par =>
            {
                Pagamentos.Add(new ParceiroPagamentoViewModel(par));
            });

            Token = EncryptionHelper.Encrypt(Id.ToString());
        }
    }
}