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
    
    public partial class ClienteExperiencia
    {
        public string Id { get; set; }
        public int IdCliente { get; set; }
        public int IdProfissao { get; set; }
        public string MotivoAfastamento { get; set; }
        public System.DateTime DataInicial { get; set; }
        public Nullable<System.DateTime> DataFinal { get; set; }
        public Nullable<System.DateTime> DataCadastro { get; set; }
        public string Telefone { get; set; }
        public string Empresa { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        public virtual Profissao Profissao { get; set; }
    }
}
