using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Reporting.WebForms;
using System.Net.Http;
using System.Net;
using System.Data;
using System.Collections.Generic;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Text.RegularExpressions;

namespace Api.Utils
{
    public class AppExtension
    {
        public static int IdUsuarioLogado()
        {
            try
            {
                string token = HttpContext.Current.Request.Headers["Token"];
                if (string.IsNullOrEmpty(token))
                {
                    throw new Exception("NotLoggedIn");
                }
                int id = Convert.ToInt32(EncryptionHelper.Decrypt(token));
                return id;
            }
            catch (Exception)
            {
                throw new Exception("NotLoggedIn");
            }
        }


        public static HttpResponseMessage Report(DataTable ds, string dsName, string rdlc)
        {
            var report = new Microsoft.Reporting.WebForms.LocalReport();
            report.ReportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Bin/Report/" + rdlc);
            report.DataSources.Add(new ReportDataSource(dsName, ds));
            report.Refresh();

            string mimeType = "";
            string encoding = "";
            string filenameExtension = "";
            string[] streams = null;
            Microsoft.Reporting.WebForms.Warning[] warnings = null;
            byte[] bytes = report.Render("PDF", null, out mimeType, out encoding, out filenameExtension, out streams, out warnings);

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(bytes);
            result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(mimeType);
            return result;
        }

        public static bool EnviarEmail(string destinatario, string assunto, string corpo)
        {
            string SGApiKey = ConfigurationManager.AppSettings["sendgrid_api_key"].ToString();

            string template = File.ReadAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "app/shared/mail-templates/basic.html");
            template = template.Replace("[TITLE]", assunto);
            template = template.Replace("[DESCRIPTION]", corpo);
            template = template.Replace("[ROOTURL]", AppExtension.GetURL());
            template = template.Replace("[LOGOURL]", AppExtension.GetURL("/assets/img/logo.png"));

            SendGridClient client = new SendGridClient(SGApiKey);
            var from = new EmailAddress(ConfigurationManager.AppSettings["sendgrid_address"].ToString());
            var subject = assunto;
            var to = new EmailAddress(destinatario);
            var htmlContent = template;
            var plainTextContent = string.Empty;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = client.SendEmailAsync(msg).Result;

            return true;
        }


        public static bool EnviarEmailGmail(string destinatario, string assunto, string corpo)
        {
            MailMessage mail = new MailMessage();

            mail.From = new MailAddress(ConfigurationManager.AppSettings["gmail_remetente"].ToString());
            mail.To.Add(destinatario); // para
            mail.Subject = assunto; // assunto
            mail.Body = corpo; // mensagem
            mail.IsBodyHtml = true;

            using (var smtp = new SmtpClient("smtp.gmail.com"))
            {
                smtp.EnableSsl = true; // GMail requer SSL
                smtp.Port = 587;       // porta para SSL
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network; // modo de envio
                smtp.UseDefaultCredentials = false; // vamos utilizar credencias especificas

                // seu usuário e senha para autenticação
                smtp.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["gmail_remetente"].ToString(), ConfigurationManager.AppSettings["gmail_senha"].ToString());

                // envia o e-mail
                smtp.Send(mail);
                return true;
            }
        }

        public static DateTime? ToDateTime(dynamic data)
        {
            try
            {
                string d = data?.ToString();
                if (!string.IsNullOrEmpty(d) && d.Length == 8)
                {
                    d = d.Substring(0, 2) + "/" + d.Substring(2, 2) + '/' + d.Substring(4, 4);
                }
                if (!string.IsNullOrEmpty(d) && d.Length == 12)
                {
                    d = d.Substring(0, 2) + "/" + d.Substring(2, 2) + '/' + d.Substring(4, 4) + " " + d.Substring(8, 2) + ":" + d.Substring(10, 2);
                }
                DateTime res = Convert.ToDateTime(d);
                if (res == DateTime.MinValue)
                {
                    throw new Exception("out of range");
                }

                return res;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string GetURL(string endpoint = "")
        {
            string begin = HttpContext.Current.Request.Url.AbsoluteUri.ToLower().Split(new[] { "/api/" }, StringSplitOptions.None)[0];
            return begin + (endpoint.StartsWith("/") ? endpoint : "/" + endpoint);
        }

        public static string GetApiURL(string endpoint = "")
        {
            string begin = HttpContext.Current.Request.Url.AbsoluteUri.ToLower().Split(new[] { "/api/" }, StringSplitOptions.None)[0];
            return begin + "/api" + (endpoint.StartsWith("/") ? endpoint : "/" + endpoint);
        }
    }
}