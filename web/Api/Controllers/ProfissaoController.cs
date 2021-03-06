﻿using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class ProfissaoController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string descricao = param.Descricao;

            Entities context = new Entities();
            List<ProfissaoViewModel> lista = new List<ProfissaoViewModel>();

            var query = context.Profissao.Where(pro => pro.Descricao.Contains(descricao));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Descricao));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new ProfissaoViewModel(obj as Profissao)));
            return paged;
        }

        [HttpGet]
        public List<ProfissaoViewModel> Todos()
        {
            Entities context = new Entities();
            List<ProfissaoViewModel> lista = new List<ProfissaoViewModel>();

            var query = context.Profissao.ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ProfissaoViewModel(obj));
            });

            return lista;
        }


        [HttpGet]
        public List<ProfissaoViewModel> Usados()
        {
            Entities context = new Entities();
            List<ProfissaoViewModel> lista = new List<ProfissaoViewModel>();

            var query = context.Profissao.Where(pro => pro.ClienteProfissional.Any(cli => cli.Cliente.Situacao == true));

            query.OrderBy(pro => pro.Descricao).ToList().ForEach(obj =>
            {
                lista.Add(new ProfissaoViewModel(obj));
            });

            return lista;
        }

        [HttpGet]
        public ProfissaoViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Profissao.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ProfissaoViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Profissao.FirstOrDefault(pro => pro.Id == id) ?? new Profissao();
            obj.Descricao = param.Descricao.ToString();

            if (id <= 0)
            {
                context.Profissao.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Profissao.FirstOrDefault(pro => pro.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Profissao.Remove(obj);
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