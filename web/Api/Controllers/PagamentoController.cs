﻿using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using Uol.PagSeguro;
using Uol.PagSeguro.Constants;
using Uol.PagSeguro.Domain;
using Uol.PagSeguro.Exception;
using Uol.PagSeguro.Resources;
using Uol.PagSeguro.Service;
using Api.Utils;


namespace Api.Controllers
{
    public class PagamentoController : ApiController
    {
        bool isSandbox = ParametroController.ObterParam("PagSeguroSandBox") == "S" ? true : false;


        [HttpPost]
        public PagedList Lista([FromBody] dynamic param)
        {
            string status = param.Situacao?.ToString();
            string cliente = param.Cliente?.ToString();
            string referencia = param.CheckoutIdentifier?.ToString();
            string tipoplano = param.TipoPlano?.ToString();
            string de = param.De?.ToString();
            string ate = param.Ate?.ToString();
            string estado = param.Estado?.Id?.ToString();
            string deconfirmacao = param.DeConfirmacao?.ToString();
            string ateconfirmacao = param.AteConfirmacao?.ToString();

            Entities context = new Entities();

            var query = context.Pagamento.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                int s = Convert.ToInt32(status);
                query = query.Where(ms => ms.Situacao == s);
            }

            if (!string.IsNullOrEmpty(cliente))
            {
                query = query.Where(pag => pag.Cliente.Nome.Contains(cliente) || pag.Cliente.CPF.Contains(cliente));
            }

            if (!string.IsNullOrEmpty(referencia))
            {
                query = query.Where(pag => pag.CheckoutIdentifier.Contains(referencia));
            }

            if (!string.IsNullOrEmpty(de))
            {
                DateTime datacriacao = AppExtension.ToDateTime(param.De);

                query = query.Where(pag => pag.DataCriacao >= datacriacao);
            }

            if (!string.IsNullOrEmpty(ate))
            {
                DateTime dataconfirmacao = AppExtension.ToDateTime(param.Ate);
                dataconfirmacao = dataconfirmacao.AddHours(23);
                dataconfirmacao = dataconfirmacao.AddMinutes(59);
                dataconfirmacao = dataconfirmacao.AddSeconds(59);
                query = query.Where(pag => pag.DataCriacao <= dataconfirmacao);
            }

            if (!string.IsNullOrEmpty(estado))
            {
                int idestado = Convert.ToInt32(estado);
                query = query.Where(obj => obj.Cliente.Cidade.Estado.Id == idestado);
            }

            if (!string.IsNullOrEmpty(tipoplano))
            {
                query = query.Where(obj => obj.TipoPlano == tipoplano);
            }

            if (!string.IsNullOrEmpty(deconfirmacao))
            {
                DateTime datacriacao = AppExtension.ToDateTime(param.DeConfirmacao);

                query = query.Where(pag => pag.DataConfirmacao >= datacriacao);
            }

            if (!string.IsNullOrEmpty(ateconfirmacao))
            {
                DateTime dataconfirmacao = AppExtension.ToDateTime(param.AteConfirmacao);
                dataconfirmacao = dataconfirmacao.AddHours(23);
                dataconfirmacao = dataconfirmacao.AddMinutes(59);
                dataconfirmacao = dataconfirmacao.AddSeconds(59);
                query = query.Where(pag => pag.DataConfirmacao <= dataconfirmacao);
            }

            PagedList paged = PagedList.Create(param.page?.ToString(), 10, query.OrderBy(pag => pag.Situacao).ThenByDescending(pag => pag.DataCriacao));
            paged.ReplaceList(paged.list.ConvertAll<object>(obj => new PagamentoViewModel(obj as Pagamento)));

            return paged;

        }

        [HttpPost]
        public bool Notificacao()
        {
            string notificationCode = HttpContext.Current.Request.Params["notificationCode"];
            string notificationType = HttpContext.Current.Request.Params["notificationType"];
            Entities context = new Entities();

            if (notificationType == "transaction")
            {
                PagSeguroConfiguration.UrlXmlConfiguration = System.Web.Hosting.HostingEnvironment.MapPath("~/PagSeguroConfig.xml");
                EnvironmentConfiguration.ChangeEnvironment(isSandbox);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                try
                {
                    AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);
                    Transaction transaction = NotificationService.CheckTransaction(credentials, notificationCode);

                    Pagamento pagamento = context.Pagamento.FirstOrDefault(pag => pag.CheckoutIdentifier == transaction.Reference);

                    pagamento = Sincronizar(transaction.TransactionStatus, transaction.LastEventDate, pagamento);

                    context.SaveChanges();

                    return true;
                }
                catch (PagSeguroServiceException exception)
                {
                    Console.WriteLine(exception.Message + "\n");
                    foreach (ServiceError element in exception.Errors)
                    {
                        throw new Exception(element.Message);
                    }

                    return false;
                }
            }
            return false;
        }

        [HttpGet]
        public PagamentoViewModel Atualizar(int id)
        {
            Entities context = new Entities();
            Pagamento pagamento = context.Pagamento.Find(id);

            PagSeguroConfiguration.UrlXmlConfiguration = System.Web.Hosting.HostingEnvironment.MapPath("~/PagSeguroConfig.xml");

            EnvironmentConfiguration.ChangeEnvironment(isSandbox);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            try
            {
                AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);

                // Realizando a consulta
                TransactionSearchResult result = TransactionSearchService.SearchByReference(credentials, pagamento.CheckoutIdentifier);

                if (result.Transactions.Count <= 0)
                {
                    // pagamento não integrado com pagseguro ainda
                    return (new PagamentoViewModel(pagamento));
                }
                foreach (TransactionSummary transaction in result.Transactions)
                {
                    pagamento = Sincronizar(transaction.TransactionStatus, transaction.LastEventDate, pagamento);
                }

                context.SaveChanges();

                return (new PagamentoViewModel(pagamento));
            }
            catch (PagSeguroServiceException exception)
            {
                Console.WriteLine(exception.Message + "\n");
                foreach (ServiceError element in exception.Errors)
                {
                    throw new Exception(element.Message);
                }

                return (new PagamentoViewModel(pagamento));
            }
        }


        [HttpGet]
        public bool Excluir(int id)
        {
            Entities context = new Entities();
            Pagamento pagamento = context.Pagamento.Find(id);

            if (pagamento.Banner != null)
            {
                throw new Exception("Não é possível excluir um pagamento de banner");
            }

            if (pagamento.ServicoContabil != null)
            {
                throw new Exception("Não é possível excluir um pagamento de serviço contábil");
            }

            if (pagamento.Situacao != 0)
            {
                throw new Exception("Não é possível excluir um pagamento processado ou em processamento");
            }

            PagSeguroConfiguration.UrlXmlConfiguration = System.Web.Hosting.HostingEnvironment.MapPath("~/PagSeguroConfig.xml");

            EnvironmentConfiguration.ChangeEnvironment(isSandbox);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            try
            {
                AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);

                // Realizando a consulta
                TransactionSearchResult result = TransactionSearchService.SearchByReference(credentials, pagamento.CheckoutIdentifier);

                if (result.Transactions.Count <= 0)
                {
                    pagamento.Situacao = 7;
                    context.SaveChanges();
                }
                else
                {
                    throw new Exception("Não é possível excluir um pagamento sincronizado com o PagSeguro");
                }

                return true;
            }
            catch (PagSeguroServiceException exception)
            {
                Console.WriteLine(exception.Message + "\n");
                foreach (ServiceError element in exception.Errors)
                {
                    throw new Exception(element.Message);
                }

                return false;
            }
        }


        [HttpGet]
        public string Pagar(int id)
        {
            Entities context = new Entities();
            Pagamento pagamento = context.Pagamento.Find(id);

            if (pagamento.Situacao != 0)
            {
                if (pagamento.Situacao == 1 && pagamento.Url != null)
                {
                    return pagamento.Url;
                }

                throw new Exception("Pagamento com status diferente de novo");
            }

            PagSeguroConfiguration.UrlXmlConfiguration = System.Web.Hosting.HostingEnvironment.MapPath("~/PagSeguroConfig.xml");

            EnvironmentConfiguration.ChangeEnvironment(isSandbox);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            // Instantiate a new payment request
            PaymentRequest payment = new PaymentRequest();

            // Sets the currency
            payment.Currency = Currency.Brl;

            // Add an item for this payment request
            payment.Items.Add(new Item(pagamento.Id.ToString(), pagamento.Descricao, 1, pagamento.Valor));

            // Sets a reference code for this payment request, it is useful to identify this payment in future notifications.
            payment.Reference = pagamento.CheckoutIdentifier;


            // Sets your customer information.
            //string ddd = pagamento.Cliente.TelefoneCelular.Substring(0, 2);
            //string phone = pagamento.Cliente.TelefoneCelular.Substring(2, 9);

            //payment.Sender = new Sender(
            //    pagamento.Cliente.Nome,
            //    pagamento.Cliente.Email,
            //    new Phone(ddd, phone)
            //);

            // Sets the url used by PagSeguro for redirect user after ends checkout process
            payment.RedirectUri = new Uri("http://admin.belezamaisforte.com.br/app/shared/messages/pagamento.html");

            // Add installment without addition per payment method
            if (pagamento.Vezes > 1)
            {
                payment.AddPaymentMethodConfig(PaymentMethodConfigKeys.MaxInstallmentsNoInterest, pagamento.Vezes, PaymentMethodGroup.CreditCard);
            }

            // Add installment limit per payment method
            //payment.AddPaymentMethodConfig(PaymentMethodConfigKeys.MaxInstallmentsLimit, pagamento.Vezes, PaymentMethodGroup.CreditCard);

            // Add and remove groups and payment methods
            List<string> accept = new List<string>();
            payment.AcceptPaymentMethodConfig(PaymentMethodGroup.CreditCard, accept);

            try
            {
                AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);

                Uri paymentRedirectUri = payment.Register(credentials);

                pagamento.Url = paymentRedirectUri.ToString();
                context.SaveChanges();

                return pagamento.Url;
            }
            catch (PagSeguroServiceException exception)
            {
                Console.WriteLine(exception.Message + "\n");
                foreach (ServiceError element in exception.Errors)
                {
                    throw new Exception(element.Message);
                }

                return null;
            }
        }

        [HttpPost]
        public InfinityPagedList<PagamentoViewModel> MeusPagamentos([FromBody] dynamic param)
        {
            int page = Convert.ToInt32(param.page);
            int pageSize = 5;

            int id = AppExtension.IdUsuarioLogado();

            Entities context = new Entities();

            var cliente = context.Cliente.FirstOrDefault(cli => cli.Id == id && cli.Situacao == true);

            if (cliente == null)
            {
                throw new Exception("Objeto não encontrado");
            }

            List<PagamentoViewModel> obj = new List<PagamentoViewModel>();

            var query = cliente.Pagamento.Where(pag => pag.Situacao != 7);
            query = query.Where(pag => pag.Banner == null || pag.Banner.Situacao != "I");
            query = query.Where(pag => pag.ServicoContabil == null || pag.ServicoContabil.Status != "C");

            query.OrderBy(pag => pag.Situacao).ThenByDescending(pag => pag.DataCriacao).Skip(page * pageSize).Take(pageSize).ToList().ForEach(pag =>
            {
                obj.Add(new PagamentoViewModel(pag));
            });

            InfinityPagedList<PagamentoViewModel> paged = new InfinityPagedList<PagamentoViewModel>();
            paged.list = obj;
            paged.pageSize = pageSize;
            paged.current = page;

            return paged;
        }


        public Pagamento Sincronizar(Uol.PagSeguro.Enums.TransactionStatus status, DateTime lastEvent, Pagamento pagamento)
        {
            switch (status)
            {
                case Uol.PagSeguro.Enums.TransactionStatus.Initiated:
                    pagamento.Situacao = 0;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.WaitingPayment:
                    pagamento.Situacao = 1;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.InAnalysis:
                    pagamento.Situacao = 2;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.Paid:
                    pagamento.Situacao = 3;
                    if (pagamento.BeneficioAplicado == "N")
                    {
                        pagamento.DataConfirmacao = lastEvent;
                        pagamento.BeneficioAplicado = "S";
                        if (pagamento.TipoPlano == "P" || pagamento.TipoPlano == "A")
                        {
                            DateTime expiracao = pagamento.Cliente.DataExpiracao ?? DateTime.Now;
                            if (expiracao > DateTime.Now)
                            {
                                expiracao = expiracao.AddDays(pagamento.Dias);
                            }
                            else
                            {
                                expiracao = DateTime.Now.AddDays(pagamento.Dias);
                            }
                            pagamento.Cliente.DataExpiracao = expiracao;
                        }
                        if(pagamento.IdServicoContabil != null)
                        {
                            string line = "<p><strong>{0}: </strong><span>{1}</span></p>";
                            string body = "<strong>Pagamento de serviço contábil confirmado!</strong><br/>";
                            body += string.Format(line, "Cliente", pagamento.ServicoContabil.NomeCompleto);
                            body += string.Format(line, "E-mail", pagamento.ServicoContabil.Email);
                            body += string.Format(line, "Telefone", pagamento.ServicoContabil.Telefone);
                            AppExtension.EnviarEmailGmail(ParametroController.ObterParam("EmailContabilidade"), "Beleza Mais Forte - Pagamento Confirmado", body);
                        }
                        if(pagamento.IdBanner != null)
                        {
                            string line = "<p><strong>{0}: </strong><span>{1}</span></p>";
                            string body = "<strong>Pagamento de banner confirmado!</strong><br/>";
                            body += string.Format(line, "Titulo", pagamento.Banner.Titulo);
                            body += string.Format(line, "Estreia em", pagamento.Banner.Estreia.ToString("dd/MM/yyyy"));
                            body += string.Format(line, "Expira em", pagamento.Banner.Expiracao.ToString("dd/MM/yyyy"));
                            body += string.Format(line, "Cadastrado em", pagamento.Banner.Cadastro.ToString("dd/MM/yyyy"));
                            AppExtension.EnviarEmailGmail(ParametroController.ObterParam("EmailContato"), "Beleza Mais Forte - Pagamento Confirmado", body);
                        }
                    }
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.Available:
                    pagamento.Situacao = 4;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.InDispute:
                    pagamento.Situacao = 5;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.Refunded:
                    pagamento.Situacao = 6;
                    break;
                case Uol.PagSeguro.Enums.TransactionStatus.Cancelled:
                    pagamento.Situacao = 7;
                    break;
                default:
                    break;
            }
            return pagamento;
        }
    }
}
