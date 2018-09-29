using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class AssociadoViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Telefone { get; set; }
        public string DataExpiracao { get; set; }
        public string Situacao { get; set; }
        public List<AssociadoPagamentoViewModel> Pagamentos { get; set; }
        public string Token { get; set; }

        public AssociadoViewModel(Associado obj)
        {
            if(obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            Email = obj.Email;
            Senha = obj.Senha;
            Telefone = obj.Telefone;
            DataExpiracao = obj.DataExpiracao.ToString("dd/MM/yyyy");
            Situacao = obj.Situacao.ToString();

            Pagamentos = new List<AssociadoPagamentoViewModel>();
            obj.AssociadoPagamento.OrderByDescending(ass => ass.DataCriacao).ToList().ForEach(ass =>
            {
                Pagamentos.Add(new AssociadoPagamentoViewModel(ass));
            });

            Token = EncryptionHelper.Encrypt(Id.ToString());
        }
    }
}