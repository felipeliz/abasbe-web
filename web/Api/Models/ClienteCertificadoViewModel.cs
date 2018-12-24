using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ClienteCertificadoViewModel
    {
        public string Id { get; set; }
        public int IdCliente { get; set; }
        public int IdCertificado { get; set; }
        public string DataCadastro { get; set; }
        public CertificadoViewModel Certificado { get; set; }

        public ClienteCertificadoViewModel(ClienteCertificado obj)
        {
            Id = obj.Id;
            IdCliente = obj.IdCliente;
            IdCertificado = obj.IdCertificado;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Certificado = new CertificadoViewModel(obj.Certificado);
        }
    }
}