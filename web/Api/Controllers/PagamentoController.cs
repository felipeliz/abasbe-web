using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Uol.PagSeguro;
using Uol.PagSeguro.Constants;
using Uol.PagSeguro.Domain;
using Uol.PagSeguro.Exception;
using Uol.PagSeguro.Resources;
using Uol.PagSeguro.Service;

namespace Api.Controllers
{
    public class PagamentoController : ApiController
    {
        bool isSandbox = false;


        [HttpPost]
        public bool Notificacao()
        {
            string notificationCode = HttpContext.Current.Request.Params["notificationCode"];
            string notificationType = HttpContext.Current.Request.Params["notificationType"];
            Entities context = new Entities();

            if (notificationType == "transaction")
            {
                EnvironmentConfiguration.ChangeEnvironment(isSandbox);
                try
                {
                    AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);
                    Transaction transaction = NotificationService.CheckTransaction(credentials, notificationCode);

                    Pagamento pagamento = context.Pagamento.FirstOrDefault(pag => pag.CheckoutIdentifier == transaction.Reference);

                    switch (transaction.TransactionStatus)
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
                            pagamento.DataConfirmacao = DateTime.Now;

                            if (pagamento.Plano.TipoPlano == "P" || pagamento.Plano.TipoPlano == "A")
                            {
                                DateTime expiracao = pagamento.Cliente.DataExpiracao ?? DateTime.Now;
                                if(expiracao > DateTime.Now)
                                {
                                    expiracao = expiracao.AddDays(pagamento.Dias);
                                }
                                else
                                {
                                    expiracao = DateTime.Now.AddDays(pagamento.Dias);
                                }
                                pagamento.Cliente.DataExpiracao = expiracao;
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
        public string Pagar(int id)
        {
            Entities context = new Entities();
            Pagamento pagamento = context.Pagamento.Find(id);

            if (pagamento.Url != null)
            {
                return pagamento.Url;
            }

            PagSeguroConfiguration.UrlXmlConfiguration = System.Web.Hosting.HostingEnvironment.MapPath("~/PagSeguroConfig.xml");

            EnvironmentConfiguration.ChangeEnvironment(isSandbox);

            // Instantiate a new payment request
            PaymentRequest payment = new PaymentRequest();

            // Sets the currency
            payment.Currency = Currency.Brl;

            // Add an item for this payment request
            payment.Items.Add(new Item(pagamento.Id.ToString(), pagamento.Descricao, 1, pagamento.Valor));

            // Sets a reference code for this payment request, it is useful to identify this payment in future notifications.
            payment.Reference = pagamento.CheckoutIdentifier;


            // Sets your customer information.
            string ddd = pagamento.Cliente.TelefoneCelular.Substring(0, 2);
            string phone = pagamento.Cliente.TelefoneCelular.Substring(2, 9);

            payment.Sender = new Sender(
                pagamento.Cliente.Nome,
                pagamento.Cliente.Email,
                new Phone(ddd, phone)
            );

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

    }
}
