﻿using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class DisponibilidadeController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<DisponibilidadeViewModel> lista = new List<DisponibilidadeViewModel>();

            var query = context.Disponibilidade.Where(dis => dis.Descricao.Contains(descricao));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Descricao));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new DisponibilidadeViewModel(obj as Disponibilidade)));
            return paged;
        }

        [HttpGet]
        public List<DisponibilidadeViewModel> Todos()
        {
            Entities context = new Entities();
            List<DisponibilidadeViewModel> lista = new List<DisponibilidadeViewModel>();

            var query = context.Disponibilidade.ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new DisponibilidadeViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public List<DisponibilidadeViewModel> Usados()
        {
            Entities context = new Entities();
            List<DisponibilidadeViewModel> lista = new List<DisponibilidadeViewModel>();

            var query = context.Disponibilidade.Where(dis => dis.ClienteProfissional.Any(cli => cli.Cliente.Situacao == true));

            query.OrderBy(dis => dis.Descricao).ToList().ForEach(obj =>
            {
                lista.Add(new DisponibilidadeViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public DisponibilidadeViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Disponibilidade.FirstOrDefault(dis => dis.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new DisponibilidadeViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Disponibilidade.FirstOrDefault(dis => dis.Id == id) ?? new Disponibilidade();
            obj.Descricao = param.Descricao.ToString();

            if (id <= 0)
            {
                context.Disponibilidade.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Disponibilidade.FirstOrDefault(dis => dis.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Disponibilidade.Remove(obj);
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