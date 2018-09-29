using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class EquipamentoViewModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }

        public EquipamentoViewModel(Equipamento obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Descricao = obj.Descricao;
        }
    }
}