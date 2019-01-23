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
    
    public partial class ClienteProfissional
    {
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public string TelefoneComercial { get; set; }
        public int TempoExperiencia { get; set; }
        public bool FlagLeiSalaoParceiro { get; set; }
        public bool FlagBiosseguranca { get; set; }
        public bool FlagEpi { get; set; }
        public bool FlagFilhos { get; set; }
        public bool FlagMei { get; set; }
        public bool FlagDiarista { get; set; }
        public decimal PretensaoSalarial { get; set; }
        public string ObservacaoFilhos { get; set; }
        public string Observacoes { get; set; }
        public string Sexo { get; set; }
        public string Habilidades { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        public virtual Disponibilidade Disponibilidade { get; set; }
        public virtual Profissao Profissao { get; set; }
    }
}
