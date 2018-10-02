﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class ProfissionalViewModel
    {
        public int Id { get; set; }
        public int IdProfissao { get; set; }
        public int IdDisponibilidade { get; set; }
        public int IdCidade { get; set; }
        public int IdEstado { get; set; }
        public string Nome { get; set; }
        public string Foto { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Sexo { get; set; }
        public string Nascimento { get; set; }
        public string TelefoneComercial { get; set; }
        public string TelefoneCelular { get; set; }
        public int TempoExperiencia { get; set; }
        public string Bairro { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public bool FlagLeiSalaoParceiro { get; set; }
        public bool FlagBiosseguranca { get; set; }
        public bool FlagEpi { get; set; }
        public bool FlagFilhos { get; set; }
        public bool FlagMei { get; set; }
        public bool FlagDiarista { get; set; }
        public decimal PretensaoSalarial { get; set; }
        public string ObservacaoFilhos { get; set; }
        public string Observacoes { get; set; }
        public string CidadeFormatada { get; set; }
        public string ProfissaoFormatada { get; set; }
        public string DisponibilidadeFormatada { get; set; }
        public string Situacao { get; set; }

        public List<ProfissionalEquipamentoViewModel> Equipamentos { get; set; }
        public List<ProfissionalCertificadoViewModel> Certificados { get; set; }
        public List<ProfissionalExperienciaViewModel> Experiencias { get; set; }

        public ProfissionalViewModel(Profissional obj, bool complete)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            IdProfissao = obj.IdProfissao;
            IdDisponibilidade = obj.IdDisponibilidade;
            IdCidade = obj.IdCidade;
            IdEstado = obj.Cidade.Estado.Id;
            Nome = obj.Nome;
            Foto = obj.Foto;
            CPF = obj.CPF;
            Email = obj.Email;
            Senha = obj.Senha;
            Sexo = obj.Sexo;
            Nascimento = obj.Nascimento?.ToString("dd/MM/yyyy");
            TelefoneComercial = obj.TelefoneComercial;
            TelefoneCelular = obj.TelefoneCelular;
            TempoExperiencia = obj.TempoExperiencia;
            Bairro = obj.Bairro;
            CEP = obj.Cep;
            Logradouro = obj.Logradouro;
            FlagLeiSalaoParceiro = obj.FlagLeiSalaoParceiro;
            FlagBiosseguranca = obj.FlagBiosseguranca;
            FlagEpi = obj.FlagEpi;
            FlagFilhos = obj.FlagFilhos;
            FlagMei = obj.FlagMei;
            FlagDiarista = obj.FlagDiarista;
            PretensaoSalarial = obj.PretensaoSalarial;
            ObservacaoFilhos = obj.ObservacaoFilhos;
            Observacoes = obj.Observacoes;

            CidadeFormatada = obj.Cidade.Nome;
            ProfissaoFormatada = obj.Profissao.Descricao;
            DisponibilidadeFormatada = obj.Disponibilidade.Descricao;

            Situacao = obj.Situacao.ToString();

            if (complete)
            {
                Equipamentos = new List<ProfissionalEquipamentoViewModel>();
                obj.ProfissionalEquipamentos.ToList().ForEach(eq =>
                {
                    Equipamentos.Add(new ProfissionalEquipamentoViewModel(eq));
                });

                Certificados = new List<ProfissionalCertificadoViewModel>();
                obj.ProfissionalCertificado.ToList().ForEach(eq =>
                {
                    Certificados.Add(new ProfissionalCertificadoViewModel(eq));
                });

                Experiencias = new List<ProfissionalExperienciaViewModel>();
                obj.ProfissionalExperiencia.ToList().ForEach(eq =>
                {
                    Experiencias.Add(new ProfissionalExperienciaViewModel(eq));
                });
            }
        }
    }
}