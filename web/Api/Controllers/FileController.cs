using Api.Models;
using Api.Utils;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class FileController : ApiController
    {
        [HttpPost]
        public string Upload([FromBody] dynamic param)
        {
            if (Convert.ToBoolean(param.hasFile))
            {
                string ext = param.ext.ToString();
                string base64 = param.base64.ToString().Split(',')[1];
                string uploadFolder = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "uploads";
                string fileName = Guid.NewGuid() + ext;

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                string filter = param.filter?.ToString();
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (filter)
                    {
                        case "ImageSquared": base64 = ImageSquared(base64); break;
                    }
                }

                File.WriteAllBytes(uploadFolder + "/" + fileName, Convert.FromBase64String(base64));

                Thread.Sleep(1500);

                return "uploads" + "/" + fileName;
            }
            throw new Exception("Não foi possivel adicionar o arquivo.");
        }

        public string ImageSquared(string base64)
        {
            try
            {
                Bitmap bmp;
                int size = 256;
                Bitmap res = new Bitmap(size, size);
                using (var ms = new MemoryStream(Convert.FromBase64String(base64)))
                {
                    bmp = new Bitmap(ms);
                    Graphics g = Graphics.FromImage(res);
                    g.FillRectangle(new SolidBrush(Color.White), 0, 0, size, size);
                    int t = 0, l = 0;
                    if (bmp.Height > bmp.Width)
                        t = (bmp.Height - bmp.Width) / 2;
                    else
                        l = (bmp.Width - bmp.Height) / 2;
                    g.DrawImage(bmp, new Rectangle(0, 0, size, size), new Rectangle(l, t, bmp.Width - l * 2, bmp.Height - t * 2), GraphicsUnit.Pixel);
                }
                using (var stream = new MemoryStream())
                {
                    res.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                    return Convert.ToBase64String(stream.ToArray());
                }
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível converter a imagem");
            }
        }

    }
}