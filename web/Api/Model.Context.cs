﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Entities : DbContext
    {
        public Entities()
            : base("name=Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Banner> Banner { get; set; }
        public virtual DbSet<Certificado> Certificado { get; set; }
        public virtual DbSet<Cidade> Cidade { get; set; }
        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<ClienteCertificado> ClienteCertificado { get; set; }
        public virtual DbSet<ClienteEquipamentos> ClienteEquipamentos { get; set; }
        public virtual DbSet<ClienteExperiencia> ClienteExperiencia { get; set; }
        public virtual DbSet<ClienteProfissional> ClienteProfissional { get; set; }
        public virtual DbSet<Disponibilidade> Disponibilidade { get; set; }
        public virtual DbSet<Equipamento> Equipamento { get; set; }
        public virtual DbSet<Estado> Estado { get; set; }
        public virtual DbSet<Pagamento> Pagamento { get; set; }
        public virtual DbSet<Parametro> Parametro { get; set; }
        public virtual DbSet<Plano> Plano { get; set; }
        public virtual DbSet<Profissao> Profissao { get; set; }
        public virtual DbSet<ProfissionalFotos> ProfissionalFotos { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
    }
}
