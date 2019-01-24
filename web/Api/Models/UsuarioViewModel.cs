using Api.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class UsuarioViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Token { get; set; }
        public bool FlagAdministrador { get; set; }

        public UsuarioViewModel(Usuario obj)
        {
            if(obj == null)
            {
                return;
            }

            Id = obj.Id;
            Nome = obj.Nome;
            Email = obj.Email;
            Senha = obj.Senha;
            FlagAdministrador = obj.FlagAdministrador == "S" ? true : false;
            Token = EncryptionHelper.Encrypt(Id.ToString());
        }
    }
}