using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ProfissionalExperienciaViewModel
    {
        public string Id { get; set; }
        public int IdProfissional { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public string DataInicial { get; set; }
        public string DataFinal { get; set; }
        public string Descricao { get; set; }
        public string DataCadastro { get; set; }
        public DisponibilidadeViewModel Disponibilidade { get; set; }
        public ProfissaoViewModel Profissao { get; set; }


        public ProfissionalExperienciaViewModel(ProfissionalExperiencia obj)
        {
            Id = obj.Id;
            IdProfissional = obj.IdProfissional;
            IdProfissao = obj.IdProfissao;
            IdDisponibilidade = obj.IdDisponibilidade;
            DataInicial = obj.DataInicial.ToString("dd/MM/yyyy");
            DataFinal = obj.DataFinal?.ToString("dd/MM/yyyy");
            Descricao = obj.Descricao;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Disponibilidade = new DisponibilidadeViewModel(obj.Disponibilidade);
            Profissao = new ProfissaoViewModel(obj.Profissao);
        }
    }
}