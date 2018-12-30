using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class SimpleClienteViewModel
    {
        public int Id { get; set; }
        public int IdCidade { get; set; }
        public int IdEstado { get; set; }
        public string Nome { get; set; }
        public string Foto { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string TelefoneCelular { get; set; }
        public string FlagCliente { get; set; }
        public string DataExpiracao { get; set; }


        public SimpleClienteViewModel(Cliente obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            IdCidade = obj.IdCidade;
            IdEstado = obj.Cidade.Estado.Id;
            Nome = obj.Nome;
            Foto = obj.Foto;
            DataExpiracao = obj.DataExpiracao?.ToString("dd/MM/yyyy");
            CPF = string.IsNullOrEmpty(obj.CPF) ? obj.CPF : Convert.ToUInt64(obj.CPF).ToString(@"000\.000\.000-00");
            Email = obj.Email;
            TelefoneCelular = string.IsNullOrEmpty(obj.TelefoneCelular) ? obj.TelefoneCelular : Convert.ToUInt64(obj.TelefoneCelular).ToString(@"(00) 00000-0000");
            FlagCliente = obj.FlagCliente;
        }
    }

    public class ClienteViewModel : SimpleClienteViewModel
    {
        public string Senha { get; set; }
        public string Nascimento { get; set; }
        public string Bairro { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public string CidadeFormatada { get; set; }
        public string EnderecoFormatado { get; set; }
        public string Situacao { get; set; }

        // for associado

        public string Token { get; set; }
        public string Cnpj { get; set; }
        public string NomeEmpresa { get; set; }
        public List<PagamentoViewModel> Pagamentos { get; set; }
        public ClienteProfissionalViewModel Curriculo { get; set; }
        public List<ClienteEquipamentoViewModel> Equipamentos { get; set; }
        public List<ClienteCertificadoViewModel> Certificados { get; set; }
        public List<ClienteExperienciaViewModel> Experiencias { get; set; }

        public ClienteViewModel(Cliente obj, bool complete) : base(obj)
        {
            if (obj == null)
            {
                return;
            }
            
            Senha = obj.Senha;
            Nascimento = obj.Nascimento?.ToString("dd/MM/yyyy");
            Bairro = obj.Bairro;
            CEP = obj.Cep;
            Logradouro = obj.Logradouro;
            CidadeFormatada = obj.Cidade.Nome;
            Situacao = obj.Situacao.ToString();

            EnderecoFormatado = CidadeFormatada;
            if(!string.IsNullOrEmpty(Bairro))
            {
                EnderecoFormatado += " - " + Bairro;
            }


            NomeEmpresa = obj.NomeEmpresa;
            Cnpj = string.IsNullOrEmpty(obj.Cnpj) ? obj.Cnpj : Convert.ToUInt64(obj.Cnpj).ToString(@"00\.000\.000/0000-00");

            Token = EncryptionHelper.Encrypt(Id.ToString());
            Curriculo = new ClienteProfissionalViewModel(obj.ClienteProfissional.LastOrDefault());

            if (complete)
            {

                Equipamentos = new List<ClienteEquipamentoViewModel>();
                obj.ClienteEquipamentos.ToList().ForEach(eq =>
                {
                    Equipamentos.Add(new ClienteEquipamentoViewModel(eq));
                });

                Certificados = new List<ClienteCertificadoViewModel>();
                obj.ClienteCertificado.ToList().ForEach(eq =>
                {
                    Certificados.Add(new ClienteCertificadoViewModel(eq));
                });

                Experiencias = new List<ClienteExperienciaViewModel>();
                obj.ClienteExperiencia.ToList().ForEach(eq =>
                {
                    Experiencias.Add(new ClienteExperienciaViewModel(eq));
                });

                Pagamentos = new List<PagamentoViewModel>();
                obj.Pagamento.OrderByDescending(ass => ass.DataCriacao).ToList().ForEach(ass =>
                {
                    Pagamentos.Add(new PagamentoViewModel(ass));
                });
            }
        }
    }
}