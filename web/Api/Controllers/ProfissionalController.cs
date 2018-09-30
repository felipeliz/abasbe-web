using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class ProfissionalController : ApiController
    {
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string nome = param.Nome;

            Entities context = new Entities();
            List<ProfissionalViewModel> lista = new List<ProfissionalViewModel>();

            var query = context.Profissional.Where(pro => pro.Nome.Contains(nome)).ToList();

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ProfissionalViewModel(obj));
            });

            return PagedList.Create(param.page?.ToString(), 10, lista);
        }

        [HttpGet]
        public ProfissionalViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Profissional.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ProfissionalViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);
            string senha = param.Nomes;

            Entities context = new Entities();

            if (senha.Count() <= 4)
            {
                throw new Exception("Sua senha precisa ter mais do que 4 caracteres.");
            }

            var obj = context.Profissional.FirstOrDefault(pro => pro.Id == id) ?? new Profissional();

            obj.IdProfissao = param.IdProfissao;
            obj.IdDisponibilidade = param.IdDisponibilidade;
            obj.IdCidade = param.IdCidade;
            obj.Nome = param.Nome;
            obj.Foto = param.Foto;
            obj.CPF = Regex.Replace(param.CPF?.ToString(), "[^0-9]", "");
            obj.Email = param.Email;
            obj.Senha = param.Senha;
            obj.Nascimento = AppExtension.ToDateTime(param.Nascimento);
            obj.TelefoneComercial = param.TelefoneComercial;
            obj.TelefoneCelular = param.TelefoneCelular;
            obj.TempoExperiencia = param.TempoExperiencia;
            obj.Bairro = param.Bairro;
            obj.Cep = param.Cep;
            obj.Logradouro = param.Logradouro;
            obj.FlagLeiSalaoParceiro = param.FlagLeiSalaoParceiro;
            obj.FlagBiosseguranca = param.FlagBiosseguranca;
            obj.FlagEpi = param.FlagEpi;
            obj.FlagFilhos = param.FlagFilhos;
            obj.FlagMei = param.FlagMei;
            obj.FlagDiarista = param.FlagDiarista;
            obj.PretensaoSalarial = param.PretensaoSalarial;
            obj.ObservacaoFilhos = param.ObservacaoFilhos;
            obj.Situacao = param.Situacao;

            if (id <= 0)
            {
                context.Profissional.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Profissional.FirstOrDefault(pro => pro.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Profissional.Remove(obj);
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