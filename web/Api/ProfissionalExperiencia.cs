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
    
    public partial class ProfissionalExperiencia
    {
        public int Id { get; set; }
        public int IdProfissional { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public string Descricao { get; set; }
        public System.DateTime DataInicial { get; set; }
        public Nullable<System.DateTime> DataFinal { get; set; }
    
        public virtual Disponibilidade Disponibilidade { get; set; }
        public virtual Profissao Profissao { get; set; }
        public virtual Profissional Profissional { get; set; }
    }
}
