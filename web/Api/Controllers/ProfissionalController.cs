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
            string nome = param.Nome?.ToString();
            string disponibilidade = param.Disponibilidade?.ToString();
            string cidade = param.Cidade?.ToString();
            string profissao = param.Profissao?.ToString();
            string situacao = param.Situacao?.ToString();

            Entities context = new Entities();
            List<ProfissionalViewModel> lista = new List<ProfissionalViewModel>();

            var query = context.Profissional.ToList();
            if (!String.IsNullOrEmpty(nome))
            {
                query = query.Where(pro => pro.Nome.ToLower().Contains(nome.ToLower())).ToList();
            }
            if (!String.IsNullOrEmpty(disponibilidade))
            {
                query = query.Where(pro => pro.Disponibilidade.Descricao.ToLower().Contains(disponibilidade.ToLower())).ToList();
            }
            if (!String.IsNullOrEmpty(cidade))
            {
                query = query.Where(pro => pro.Cidade.Nome.ToLower().Contains(cidade.ToLower())).ToList();
            }
            if (!String.IsNullOrEmpty(profissao))
            {
                query = query.Where(pro => pro.Profissao.Descricao.ToLower().Contains(profissao.ToLower())).ToList();
            }
            
            if (situacao != "Todas")
            {
                bool s = Convert.ToBoolean(situacao);
                query = query.Where(pro => pro.Situacao == s).ToList();
            }

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ProfissionalViewModel(obj, false));
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

            return new ProfissionalViewModel(obj, true);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);
            string senha = param.Senha;

            Entities context = new Entities();

            using (var transaction = context.Database.BeginTransaction())
            {


                if (senha.Count() < 4)
                {
                    throw new Exception("Sua senha precisa ter mais do que 4 caracteres.");
                }

                var obj = context.Profissional.FirstOrDefault(pro => pro.Id == id) ?? new Profissional();

                obj.IdProfissao = param.IdProfissao;
                obj.IdDisponibilidade = param.IdDisponibilidade;
                obj.IdCidade = param.IdCidade;
                obj.Nome = param.Nome;
                obj.Foto = FileController.ConfirmUpload(param.Foto?.ToString());
                obj.CPF = Regex.Replace(param.CPF?.ToString(), "[^0-9]", "");
                obj.Sexo = param.Sexo;
                obj.Email = param.Email;
                obj.Senha = param.Senha;
                obj.Nascimento = AppExtension.ToDateTime(param.Nascimento);
                obj.TelefoneComercial = param.TelefoneComercial;
                obj.TelefoneCelular = param.TelefoneCelular;
                obj.TempoExperiencia = param.TempoExperiencia;
                obj.Bairro = param.Bairro;
                obj.Cep = param.CEP;
                obj.Logradouro = param.Logradouro;
                obj.FlagLeiSalaoParceiro = param.FlagLeiSalaoParceiro;
                obj.FlagBiosseguranca = param.FlagBiosseguranca;
                obj.FlagEpi = param.FlagEpi;
                obj.FlagFilhos = param.FlagFilhos;
                obj.FlagMei = param.FlagMei;
                obj.FlagDiarista = param.FlagDiarista;
                obj.PretensaoSalarial = param.PretensaoSalarial;
                obj.ObservacaoFilhos = param.ObservacaoFilhos;
                obj.Observacoes = param.Observacoes;
                obj.Situacao = Convert.ToBoolean(param.Situacao);

                if (id > 0)
                {
                    context.ProfissionalEquipamentos.RemoveRange(obj.ProfissionalEquipamentos);
                    context.ProfissionalCertificado.RemoveRange(obj.ProfissionalCertificado);
                    context.ProfissionalExperiencia.RemoveRange(obj.ProfissionalExperiencia);
                    context.SaveChanges();
                }

                // Equipamentos
                if (param.Equipamentos != null)
                {
                    foreach (var element in param.Equipamentos)
                    {
                        ProfissionalEquipamentos relation = new ProfissionalEquipamentos();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdEquipamento = Convert.ToInt32(element.Equipamento.Id);
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        obj.ProfissionalEquipamentos.Add(relation);
                    }
                }

                // Certificados
                if (param.Certificados != null)
                {
                    foreach (var element in param.Certificados)
                    {
                        ProfissionalCertificado relation = new ProfissionalCertificado();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdCertificado = Convert.ToInt32(element.Certificado.Id);
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        obj.ProfissionalCertificado.Add(relation);
                    }
                }


                // Experiencias
                if (param.Experiencias != null && param.Experiencias.Count > 0)
                {
                    foreach (var element in param.Experiencias)
                    {
                        ProfissionalExperiencia relation = new ProfissionalExperiencia();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdDisponibilidade = Convert.ToInt32(element.Disponibilidade.Id);
                        relation.IdProfissao = Convert.ToInt32(element.Profissao.Id);
                        relation.DataInicial = AppExtension.ToDateTime(element.DataInicial);
                        relation.DataFinal = AppExtension.ToDateTime(element.DataFinal);
                        relation.Descricao = element.Descricao?.ToString();
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        obj.ProfissionalExperiencia.Add(relation);
                    }
                }
                   
                if (id <= 0)
                {
                    context.Profissional.Add(obj);
                }
                context.SaveChanges();

                transaction.Commit();
            }
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
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        context.ProfissionalCertificado.RemoveRange(obj.ProfissionalCertificado);
                        context.ProfissionalEquipamentos.RemoveRange(obj.ProfissionalEquipamentos);
                        context.ProfissionalExperiencia.RemoveRange(obj.ProfissionalExperiencia);
                        context.SaveChanges();
                        context.Profissional.Remove(obj);
                        context.SaveChanges();
                        transaction.Commit();
                    }
                }
                catch
                {
                    throw new Exception("Não foi possível excluir, existem registros dependentes.");
                }

            }
        }

        [HttpPost]
        public string ObterQtdProfissionaisAtivosETotal([FromBody] dynamic param)
        {
            Entities context = new Entities();
            return context.Profissional.Where(pro => pro.Situacao == true).Count().ToString() + " / " + context.Profissional.Count().ToString();
        }
    }
}