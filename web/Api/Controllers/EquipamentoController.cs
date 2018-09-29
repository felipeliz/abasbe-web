using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class EquipamentoController : ApiController
    {

        [HttpPost]
        public PagedList lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<EquipamentoViewModel> lista = new List<EquipamentoViewModel>();

            var query = context.Equipamento.Where(equ => equ.Descricao.Contains(descricao)).ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new EquipamentoViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public EquipamentoViewModel obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Equipamento.FirstOrDefault(equ => equ.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new EquipamentoViewModel(obj);
        }


        [HttpPost]
        public bool salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Equipamento.FirstOrDefault(equ => equ.Id == id) ?? new Equipamento();
            obj.Descricao = param.Descricao.ToString();

            if (id <= 0)
            {
                context.Equipamento.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Equipamento.FirstOrDefault(equ => equ.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Equipamento.Remove(obj);
                    context.SaveChanges();
                }
                catch
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }

        }
    }
}