//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Api
{
    using System;
    using System.Collections.Generic;
    
    public partial class ServicoContabil
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ServicoContabil()
        {
            this.Pagamento = new HashSet<Pagamento>();
        }
    
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public string TipoServico { get; set; }
        public System.DateTime DataSolicitacao { get; set; }
        public System.DateTime DataAlteracao { get; set; }
        public string Status { get; set; }
        public string Observacao { get; set; }
        public string NomeCompleto { get; set; }
        public string Cpf { get; set; }
        public Nullable<System.DateTime> DataNascimento { get; set; }
        public string TituloEleitor { get; set; }
        public string Cnpj { get; set; }
        public string SenhaPrefeitura { get; set; }
        public string DataReferencia { get; set; }
        public string CodigoSimplesNacional { get; set; }
        public string CnpjContratante { get; set; }
        public string NomeContratante { get; set; }
        public string DescricaoServico { get; set; }
        public Nullable<decimal> ValorServico { get; set; }
        public string Endereco { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Rg { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Pagamento> Pagamento { get; set; }
    }
}