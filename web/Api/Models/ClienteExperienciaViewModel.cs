using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ClienteExperienciaViewModel
    {
        public string Id { get; set; }
        public int IdCliente { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public string DataInicial { get; set; }
        public string DataFinal { get; set; }
        public string Descricao { get; set; }
        public string DataCadastro { get; set; }
        public string Telefone { get; set; }
        public DisponibilidadeViewModel Disponibilidade { get; set; }
        public ProfissaoViewModel Profissao { get; set; }


        public ClienteExperienciaViewModel(ClienteExperiencia obj)
        {
            Id = obj.Id;
            IdCliente = obj.IdCliente;
            IdProfissao = obj.IdProfissao;
            IdDisponibilidade = obj.IdDisponibilidade;
            DataInicial = obj.DataInicial.ToString("dd/MM/yyyy");
            DataFinal = obj.DataFinal?.ToString("dd/MM/yyyy");
            Descricao = obj.Descricao;
            Telefone = obj.Telefone;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Disponibilidade = new DisponibilidadeViewModel(obj.Disponibilidade);
            Profissao = new ProfissaoViewModel(obj.Profissao);
        }
    }
}