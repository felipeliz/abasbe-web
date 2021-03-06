﻿using Api.Models;
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
        public PagedList Lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<EquipamentoViewModel> lista = new List<EquipamentoViewModel>();

            var query = context.Equipamento.Where(equ => equ.Descricao.Contains(descricao));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Descricao));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new EquipamentoViewModel(obj as Equipamento)));
            return paged;
        }

        [HttpGet]
        public List<EquipamentoViewModel> Todos()
        {
            Entities context = new Entities();
            List<EquipamentoViewModel> lista = new List<EquipamentoViewModel>();

            var query = context.Equipamento.ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new EquipamentoViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public EquipamentoViewModel Obter(int id)
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
        public bool Salvar([FromBody] dynamic param)
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