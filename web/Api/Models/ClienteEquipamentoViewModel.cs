using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ClienteEquipamentoViewModel
    {
        public string Id { get; set; }
        public int IdCliente { get; set; }
        public int IdEquipamento { get; set; }
        public string DataCadastro { get; set; }
        public EquipamentoViewModel Equipamento { get; set; }

        public ClienteEquipamentoViewModel(ClienteEquipamentos obj)
        {
            Id = obj.Id;
            IdCliente = obj.IdCliente;
            IdEquipamento = obj.IdEquipamento;

            DataCadastro = obj.DataCadastro?.ToString("dd/MM/yyyy HH:mm:ss");

            Equipamento = new EquipamentoViewModel(obj.Equipamento);
        }
    }
}