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
    
    public partial class Cidade
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Cidade()
        {
            this.Profissional = new HashSet<Profissional>();
        }
    
        public int Id { get; set; }
        public string Nome { get; set; }
        public int IdEstado { get; set; }
        public bool Capital { get; set; }
    
        public virtual Estado Estado { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Profissional> Profissional { get; set; }
    }
}
