using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ProfissionalCertificadoViewModel
    {
        public string Id { get; set; }
        public int IdProfissional { get; set; }
        public int IdCertificado { get; set; }
        public string DataCadastro { get; set; }
        public CertificadoViewModel Certificado { get; set; }

        public ProfissionalCertificadoViewModel(ProfissionalCertificado obj)
        {
            Id = obj.Id;
            IdProfissional = obj.IdProfissional;
            IdCertificado = obj.IdCertificado;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Certificado = new CertificadoViewModel(obj.Certificado);
        }
    }
}