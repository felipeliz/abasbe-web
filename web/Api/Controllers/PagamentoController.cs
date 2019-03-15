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

namespace Api.Controllers
{
    public class PagamentoController : ApiController
    {
        [HttpGet]
        public string Pagar(int id)
        {
            Entities context = new Entities();
            Pagamento pagamento = context.Pagamento.Find(id);

            bool isSandbox = false;
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
            string phone = pagamento.Cliente.TelefoneCelular.Substring(2, 11);

            payment.Sender = new Sender(
                pagamento.Cliente.Nome,
                pagamento.Cliente.Email,
                new Phone(ddd, phone)
            );

            SenderDocument document = new SenderDocument(Documents.GetDocumentByType("CPF"), pagamento.Cliente.CPF.Replace(".", "").Replace("-", ""));
            payment.Sender.Documents.Add(document);

            // Sets the url used by PagSeguro for redirect user after ends checkout process
            payment.RedirectUri = new Uri("http://google.com");

            // Add installment without addition per payment method
            payment.AddPaymentMethodConfig(PaymentMethodConfigKeys.MaxInstallmentsNoInterest, pagamento.Vezes, PaymentMethodGroup.CreditCard);

            // Add installment limit per payment method
            payment.AddPaymentMethodConfig(PaymentMethodConfigKeys.MaxInstallmentsLimit, pagamento.Vezes, PaymentMethodGroup.CreditCard);

            // Add and remove groups and payment methods
            List<string> accept = new List<string>();
            payment.AcceptPaymentMethodConfig(PaymentMethodGroup.CreditCard, accept);

            try
            {
                /// Create new account credentials
                /// This configuration let you set your credentials from your ".cs" file.
                AccountCredentials credentials = new AccountCredentials("alys.freitas@gmail.com", "392550106A1E44DBB4756279EF723353");

                /// @todo with you want to get credentials from xml config file uncommend the line below and comment the line above.
                //AccountCredentials credentials = PagSeguroConfiguration.Credentials(isSandbox);

                Uri paymentRedirectUri = payment.Register(credentials);

                return paymentRedirectUri.ToString();
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