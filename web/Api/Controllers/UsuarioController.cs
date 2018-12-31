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
    public class UsuarioController : ApiController
    {
        [HttpGet]
        public string Status()
        {
            return "online";
        }

        [HttpPost]
        public UsuarioViewModel Login([FromBody] dynamic param)
        {
            string email = param.email;
            string senha = param.senha;

            Entities context = new Entities();
            var obj = context.Usuario.FirstOrDefault(op => op.Email == email && op.Senha == senha);

            if (obj == null)
            {
                throw new Exception("E-mail ou senha inválidos");
            }

            UsuarioViewModel res = new UsuarioViewModel(obj);
            return res;
        }
        
        [HttpPost]
        public bool AlterarSenha([FromBody] dynamic param)
        {
            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();
            var obj = context.Usuario.FirstOrDefault(op => op.Id == id);

            string senhaanterior = param.SenhaAnterior?.ToString();
            string novasenha = param.NovaSenha?.ToString();
            string confirmarsenha = param.ConfirmarSenha?.ToString();

            if (obj.Senha == senhaanterior)
            {
                if (novasenha == confirmarsenha)
                {
                    if (novasenha.Count() >= 4)
                    {
                        obj.Senha = novasenha;
                        context.SaveChanges();
                        return true;
                    }

                    throw new Exception("Sua senha precisa ter mais do que 4 caracteres.");
                }

                throw new Exception("Confirmar Senha precisa ser igual a Nova Senha.");
            }

            throw new Exception("A Senha Atual está incorreta.");
        }
        
        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string nome = param.Nome;

            Entities context = new Entities();
            List<UsuarioViewModel> lista = new List<UsuarioViewModel>();

            var query = context.Usuario.Where(obj => obj.Nome.Contains(nome));

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(el => el.Nome));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new UsuarioViewModel(obj as Usuario)));
            return paged;
        }

        [HttpGet]
        public UsuarioViewModel Obter(int id)
        {
            Entities context = new Entities();

            var obj = context.Usuario.FirstOrDefault(pro => pro.Id == id);

            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }

            return new UsuarioViewModel(obj);
        }


        [HttpPost]
        public bool Salvar([FromBody] dynamic param)
        {
            int id = Convert.ToInt32(param.Id);

            Entities context = new Entities();
            var obj = context.Usuario.FirstOrDefault(pro => pro.Id == id) ?? new Usuario();

            obj.Nome = param.Nome?.ToString();
            obj.Senha = param.Senha?.ToString();
            obj.Email = param.Email?.ToString();

            if (obj.Senha.Count() < 4)
            {
                throw new Exception("A senha precisa ter mais do que 4 caracteres.");
            }

            if (id <= 0)
            {
                context.Usuario.Add(obj);
            }
            context.SaveChanges();
            return true;
        }

        [HttpGet]
        public void Excluir(int id)
        {
            Entities context = new Entities();

            var obj = context.Usuario.FirstOrDefault(pro => pro.Id == id);
            if (obj == null)
            {
                throw new Exception("Registro não identificado.");
            }
            else
            {
                try
                {
                    context.Usuario.Remove(obj);
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
