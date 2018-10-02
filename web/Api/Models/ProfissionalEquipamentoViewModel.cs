using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ProfissionalEquipamentoViewModel
    {
        public string Id { get; set; }
        public int IdProfissional { get; set; }
        public int IdEquipamento { get; set; }
        public string DataCadastro { get; set; }
        public EquipamentoViewModel Equipamento { get; set; }

        public ProfissionalEquipamentoViewModel(ProfissionalEquipamentos obj)
        {
            Id = obj.Id;
            IdProfissional = obj.IdProfissional;
            IdEquipamento = obj.IdEquipamento;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Equipamento = new EquipamentoViewModel(obj.Equipamento);
        }
    }
}