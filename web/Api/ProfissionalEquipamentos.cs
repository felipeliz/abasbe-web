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
    
    public partial class ProfissionalEquipamentos
    {
        public string Id { get; set; }
        public int IdProfissional { get; set; }
        public int IdEquipamento { get; set; }
        public Nullable<System.DateTime> DataCadastro { get; set; }
    
        public virtual Equipamento Equipamento { get; set; }
        public virtual Profissional Profissional { get; set; }
    }
}
