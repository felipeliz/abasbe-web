using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class BannerViewModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public string Titulo { get; set; }
        public string Expiracao { get; set; }
        public string Estreia { get; set; }
        public string Imagem { get; set; }
        public string Link { get; set; }
        public string Telefone { get; set; }
        public string Situacao { get; set; }
        public string SituacaoFormatada { get; set; }
        public string SituacaoPagamentoFormatada { get; set; }
        public int Contador { get; set; }
        public SimpleClienteViewModel Cliente { get; set; }
        public List<PagamentoViewModel> Pagamentos { get; set; }

        public BannerViewModel(Banner obj)
        {
            if (obj == null)
            {
                return;
            }

            Id = obj.Id;
            Descricao = obj.Descricao;
            Expiracao = obj.Expiracao.ToString("dd/MM/yyyy hh:mm");
            Estreia = obj.Estreia.ToString("dd/MM/yyyy hh:mm");
            Situacao = obj.Situacao;
            Titulo = obj.Titulo;
            Imagem = obj.Imagem;
            Telefone = obj.Telefone;
            Link = obj.Link;
            Contador = Convert.ToInt32(obj.Contador);
            SituacaoPagamentoFormatada = "N/A";

            switch (obj.Situacao)
            {
                case "A": SituacaoFormatada = "Ativo"; break;
                case "E": SituacaoFormatada = "Em moderação"; break;
                case "I": SituacaoFormatada = "Inativo"; break;
            }

            Cliente = new SimpleClienteViewModel(obj.Cliente);

            Pagamentos = new List<PagamentoViewModel>();
            obj.Pagamento.OrderByDescending(pag => pag.DataCriacao).ToList().ForEach(pag =>
            {
                SituacaoPagamentoFormatada = PagamentoViewModel.GetSituacao(pag.Situacao);
                Pagamentos.Add(new PagamentoViewModel(pag));
            });
        }
    }
}