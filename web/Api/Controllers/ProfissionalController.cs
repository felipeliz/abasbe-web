using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
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
            List<ClienteViewModel> lista = new List<ClienteViewModel>();

            var query = context.Cliente.Where(pro => pro.FlagCliente == "P");
            if (!String.IsNullOrEmpty(nome))
            {
                query = query.Where(pro => pro.Nome.ToLower().Contains(nome.ToLower()));
            }
            if (!String.IsNullOrEmpty(disponibilidade))
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.Disponibilidade.Descricao.ToLower().Contains(disponibilidade.ToLower())));
            }
            if (!String.IsNullOrEmpty(cidade))
            {
                query = query.Where(pro => pro.Cidade.Nome.ToLower().Contains(cidade.ToLower()));
            }
            if (!String.IsNullOrEmpty(profissao))
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.Profissao.Descricao.ToLower().Contains(profissao.ToLower())));
            }

            if (situacao != "Todas")
            {
                bool s = Convert.ToBoolean(situacao);
                query = query.Where(pro => pro.Situacao == s);
            }

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Nome));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new ClienteViewModel(obj as Cliente, false)));
            return paged;
        }

        [HttpGet]
        public ClienteViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id && pro.FlagCliente == "P");

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new ClienteViewModel(obj, true);
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

                var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id && pro.FlagCliente == "P") ?? new Cliente();

                var curr = obj.ClienteProfissional.Count() > 0 ? obj.ClienteProfissional.Last() : new ClienteProfissional();

                obj.Nome = param.Nome;
                obj.Foto = FileController.ConfirmUpload(param.Foto?.ToString());
                obj.CPF = Regex.Replace(param.CPF?.ToString(), "[^0-9]", "");
                obj.Email = param.Email;
                obj.Senha = param.Senha;
                obj.Nascimento = AppExtension.ToDateTime(param.Nascimento);
                obj.TelefoneCelular = Regex.Replace(param.TelefoneCelular?.ToString(), "[^0-9]", "");
                obj.DataExpiracao = param.DataExpiracao == null ? DateTime.Now : AppExtension.ToDateTime(param.DataExpiracao);

                obj.IdCidade = param.IdCidade;
                obj.Bairro = param.Bairro;
                obj.Cep = param.CEP;
                obj.Logradouro = param.Logradouro;

                obj.Situacao = Convert.ToBoolean(param.Situacao);

                curr.IdProfissao = param.Curriculo.IdProfissao;
                curr.IdDisponibilidade = param.Curriculo.IdDisponibilidade;
                curr.Sexo = param.Curriculo.Sexo;
                curr.TelefoneComercial = Regex.Replace(param.Curriculo.TelefoneComercial?.ToString() ?? "", "[^0-9]", "");
                curr.TempoExperiencia = param.Curriculo.TempoExperiencia;
                curr.FlagLeiSalaoParceiro = param.Curriculo.FlagLeiSalaoParceiro ?? false;
                curr.FlagBiosseguranca = param.Curriculo.FlagBiosseguranca ?? false;
                curr.FlagEpi = param.Curriculo.FlagEpi ?? false;
                curr.FlagFilhos = param.Curriculo.FlagFilhos ?? false;
                curr.FlagMei = param.Curriculo.FlagMei ?? false;
                curr.FlagDelivery = param.Curriculo.FlagDelivery ?? false;
                curr.DisponibilidadeDelivery = param.Curriculo.DisponibilidadeDelivery;
                curr.PretensaoSalarial = param.Curriculo.PretensaoSalarial;
                curr.ObservacaoFilhos = param.Curriculo.ObservacaoFilhos;
                curr.Habilidades = param.Curriculo.Habilidades;
                curr.Observacoes = param.Curriculo.Observacoes;

                if (obj.ClienteProfissional.Count() == 0)
                {
                    obj.ClienteProfissional.Add(curr);
                }

                if (id > 0)
                {
                    context.ClienteEquipamentos.RemoveRange(obj.ClienteEquipamentos);
                    context.ClienteCertificado.RemoveRange(obj.ClienteCertificado);
                    context.ClienteExperiencia.RemoveRange(obj.ClienteExperiencia);
                }

                // Equipamentos
                if (param.Equipamentos != null)
                {
                    foreach (var element in param.Equipamentos)
                    {
                        ClienteEquipamentos relation = new ClienteEquipamentos();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdEquipamento = Convert.ToInt32(element.Equipamento.Id);
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        obj.ClienteEquipamentos.Add(relation);
                    }
                }

                // Equipamentos
                context.ProfissionalFotos.RemoveRange(curr.ProfissionalFotos);
                if (param.Curriculo.Fotos != null)
                {
                    int ordem = 1;
                    foreach (var element in param.Curriculo.Fotos)
                    {
                        ProfissionalFotos relation = new ProfissionalFotos();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.Imagem = element.Imagem ?? "imgs/placeholder.png";
                        if(element.Imagem.ToString() != "imgs/placeholder.png")
                        {
                            if(relation.Imagem.StartsWith("temp/"))
                            {
                                relation.Imagem = FileController.ConfirmUpload(element.Imagem?.ToString());
                            }
                        }
                        relation.Ordem = ordem;
                        curr.ProfissionalFotos.Add(relation);
                        ordem++;
                    }
                }

                // Certificados
                if (param.Certificados != null)
                {
                    foreach (var element in param.Certificados)
                    {
                        ClienteCertificado relation = new ClienteCertificado();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdCertificado = Convert.ToInt32(element.Certificado.Id);
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        relation.Descricao = element.Descricao?.ToString() ?? "";
                        obj.ClienteCertificado.Add(relation);
                    }
                }


                // Experiencias
                if (param.Experiencias != null)
                {
                    foreach (var element in param.Experiencias)
                    {
                        ClienteExperiencia relation = new ClienteExperiencia();
                        relation.Id = Guid.NewGuid().ToString();
                        relation.IdProfissao = Convert.ToInt32(element.Profissao.Id);
                        relation.DataInicial = AppExtension.ToDateTime(element.DataInicial);
                        relation.DataFinal = AppExtension.ToDateTime(element.DataFinal);
                        relation.MotivoAfastamento = element.MotivoAfastamento?.ToString();
                        relation.Empresa = element.Empresa?.ToString();
                        relation.DataCadastro = AppExtension.ToDateTime(element.DataCadastro) ?? DateTime.Now;
                        relation.Telefone = element.Telefone;
                        obj.ClienteExperiencia.Add(relation);
                    }
                }

                if (id <= 0)
                {
                    obj.Cadastro = DateTime.Now;
                    obj.FlagCliente = "P";
                    context.Cliente.Add(obj);
                }

                try
                {
                    context.SaveChanges();
                }
                catch (Exception ex)
                {
                    if (ex.InnerException?.InnerException?.Message.Contains("CLI_EMAIL_UNIQUE") ?? false)
                    {
                        throw new Exception("Este e-mail já está sendo utilizado.");
                    }
                    throw ex;
                }

                transaction.Commit();
            }
            return true;
        }

        [HttpGet]
        public bool Excluir(int id)
        {
            Entities context = new Entities();
            var obj = context.Cliente.FirstOrDefault(pro => pro.Id == id && pro.FlagCliente == "P");
            obj.Situacao = false;
            return context.SaveChanges() > 0;
        }

        [HttpPost]
        public string ObterQtdProfissionaisAtivosETotal([FromBody] dynamic param)
        {
            Entities context = new Entities();
            return context.Cliente.Where(pro => pro.Situacao == true).Count().ToString() + " / " + context.Cliente.Count().ToString();
        }


        [HttpPost]
        public List<ClienteViewModel> Buscar([FromBody] dynamic param)
        {
            int pageSize = 3;
            string profissao = param.profissao?.ToString();
            string disponibilidade = param.disponibilidade?.ToString();
            string sexo = param.sexo?.ToString();
            string cidade = param.cidade?.ToString();
            string experiencia = param.experiencia?.ToString();
            string bairro = param.bairro?.ToString();
            bool delivery = Convert.ToBoolean(param.delivery);
            int page = Convert.ToInt32(param.page);

            Entities context = new Entities();
            List<ClienteViewModel> lista = new List<ClienteViewModel>();

            var query = context.Cliente.Where(pro => pro.FlagCliente == "P");
            if (!String.IsNullOrEmpty(profissao))
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.Profissao.Id.ToString() == profissao));
            }
            if (delivery == false && !String.IsNullOrEmpty(disponibilidade))
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.Disponibilidade.Id.ToString() == disponibilidade));
            }
            if (delivery)
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.FlagDelivery == true));
            }
            if (!String.IsNullOrEmpty(sexo))
            {
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.Sexo == sexo));
            }
            if (!String.IsNullOrEmpty(experiencia))
            {
                int tempExp = Convert.ToInt32(experiencia);
                query = query.Where(pro => pro.ClienteProfissional.Any(cp => cp.TempoExperiencia >= tempExp));
            }
            if (!String.IsNullOrEmpty(cidade))
            {
                query = query.Where(pro => pro.Cidade.Id.ToString() == cidade);
            }
            if (!String.IsNullOrEmpty(bairro))
            {
                query = query.Where(pro => pro.Bairro.Contains(bairro));
            }

            query = query.Where(pro => pro.Situacao == true);
            query = query.OrderBy(pro => pro.Nome);
            query = query.Skip(page * pageSize).Take(pageSize);

            query.ToList().ForEach(obj =>
            {
                lista.Add(new ClienteViewModel(obj, false));
            });

            return lista;
        }
    }
}