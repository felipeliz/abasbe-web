using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ClienteProfissionalViewModel
    {
        public int Id { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public string Sexo { get; set; }
        public string SexoFormatado { get; set; }
        public string TelefoneComercial { get; set; }
        public int TempoExperiencia { get; set; }
        public bool FlagLeiSalaoParceiro { get; set; }
        public bool FlagBiosseguranca { get; set; }
        public bool FlagEpi { get; set; }
        public bool FlagFilhos { get; set; }
        public bool FlagMei { get; set; }
        public bool FlagDiarista { get; set; }
        public decimal PretensaoSalarial { get; set; }
        public string PretensaoSalarialFormatada { get; set; }
        public string ObservacaoFilhos { get; set; }
        public string Observacoes { get; set; }
        public string CidadeFormatada { get; set; }
        public string ProfissaoFormatada { get; set; }
        public string DisponibilidadeFormatada { get; set; }

        public ClienteProfissionalViewModel(ClienteProfissional obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            IdProfissao = obj.IdProfissao;
            IdDisponibilidade = obj.IdDisponibilidade;
            Sexo = obj.Sexo;
            TelefoneComercial = string.IsNullOrEmpty(obj.TelefoneComercial) ? obj.TelefoneComercial : Convert.ToUInt64(obj.TelefoneComercial).ToString(@"(00) 0000-0000");
            TempoExperiencia = obj.TempoExperiencia;
            FlagLeiSalaoParceiro = obj.FlagLeiSalaoParceiro;
            FlagBiosseguranca = obj.FlagBiosseguranca;
            FlagEpi = obj.FlagEpi;
            FlagFilhos = obj.FlagFilhos;
            FlagMei = obj.FlagMei;
            FlagDiarista = obj.FlagDiarista;
            PretensaoSalarial = obj.PretensaoSalarial;
            ObservacaoFilhos = obj.ObservacaoFilhos;
            Observacoes = obj.Observacoes;

            ProfissaoFormatada = obj.Profissao.Descricao;
            DisponibilidadeFormatada = obj.Disponibilidade.Descricao;

            PretensaoSalarialFormatada = String.Format("{0:C}", PretensaoSalarial);

            switch (Sexo)
            {
                case "M": SexoFormatado = "Homem"; break;
                case "F": SexoFormatado = "Mulher"; break;
                default: SexoFormatado = ""; break;
            }
        }
    }
}