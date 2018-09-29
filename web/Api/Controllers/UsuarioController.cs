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
        [HttpPost]
        public UsuarioViewModel login([FromBody] dynamic param)
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
        public bool alterarSenha([FromBody] dynamic param)
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
    }
}
