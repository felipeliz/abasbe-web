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
    
    public partial class Cliente
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Cliente()
        {
            this.Banner = new HashSet<Banner>();
            this.Pagamento = new HashSet<Pagamento>();
            this.ClienteCertificado = new HashSet<ClienteCertificado>();
            this.ClienteEquipamentos = new HashSet<ClienteEquipamentos>();
            this.ClienteExperiencia = new HashSet<ClienteExperiencia>();
            this.ClienteProfissional = new HashSet<ClienteProfissional>();
            this.ServicoContabil = new HashSet<ServicoContabil>();
        }
    
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Foto { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public Nullable<System.DateTime> Nascimento { get; set; }
        public string TelefoneCelular { get; set; }
        public int IdCidade { get; set; }
        public string Bairro { get; set; }
        public string Cep { get; set; }
        public string Logradouro { get; set; }
        public bool Situacao { get; set; }
        public Nullable<System.DateTime> DataExpiracao { get; set; }
        public string NomeEmpresa { get; set; }
        public string Cnpj { get; set; }
        public string FlagCliente { get; set; }
        public Nullable<int> IdPlano { get; set; }
        public Nullable<System.DateTime> Cadastro { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Banner> Banner { get; set; }
        public virtual Cidade Cidade { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Pagamento> Pagamento { get; set; }
        public virtual Plano Plano { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ClienteCertificado> ClienteCertificado { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ClienteEquipamentos> ClienteEquipamentos { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ClienteExperiencia> ClienteExperiencia { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ClienteProfissional> ClienteProfissional { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ServicoContabil> ServicoContabil { get; set; }
    }
}
