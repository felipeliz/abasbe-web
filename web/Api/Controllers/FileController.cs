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
                string folder = "temp";
                string ext = param.ext.ToString().ToLower();
                if(ext != ".jpeg" && ext != ".png" && ext != ".jpg")
                {
                    throw new Exception("Formato de imagem inválido.");
                }

                string base64 = param.base64.ToString().Split(',')[1];
                string uploadFolder = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + folder;
                string fileName = Guid.NewGuid() + ext;

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                string filter = param.filter?.ToString();
                string size = param.size?.ToString();
                string width = param.width?.ToString();
                string heigth = param.heigth?.ToString();
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (filter)
                    {
                        case "ImageSquared": base64 = ImageSquared(base64, Convert.ToInt32(size)); break;
                        case "ImageResize": base64 = ImageResize(base64, Convert.ToInt32(width), Convert.ToInt32(heigth)); break;
                    }
                }

                File.WriteAllBytes(uploadFolder + "/" + fileName, Convert.FromBase64String(base64));
                return folder + "/" + fileName;
            }
            throw new Exception("Não foi possivel adicionar o arquivo.");
        }

        public static string SaveFile(string base64, string ext)
        {
            base64 = base64.ToString().Split(',')[1];
            string folder = "uploads";
            string uploadFolder = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + folder;
            string fileName = Guid.NewGuid() + ext;
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }
            File.WriteAllBytes(uploadFolder + "/" + fileName, Convert.FromBase64String(base64));
            return folder + "/" + fileName;
        }

        public static string ConfirmUpload(string temp)
        {
            if (temp != null && temp.StartsWith("temp/"))
            {
                string folder = "uploads";
                string fileName = temp.Split('/').Last();
                string uploadAbsolutePath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + folder + "/" + fileName;
                string tempAbsolutePath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + temp;
                if (File.Exists(tempAbsolutePath))
                {
                    File.Move(tempAbsolutePath, uploadAbsolutePath);
                    return folder + "/" + fileName;
                }
            }
            return temp;
        }

        public string ImageSquared(string base64, int size)
        {
            return ImageResize(base64, size, size);
        }

        public string ImageResize(string base64, int width, int heigth)
        {
            try
            {
                Bitmap bmp;
                Bitmap res = new Bitmap(width, heigth);
                using (var ms = new MemoryStream(Convert.FromBase64String(base64)))
                {
                    bmp = new Bitmap(ms);
                    Graphics g = Graphics.FromImage(res);
                    g.FillRectangle(new SolidBrush(Color.White), 0, 0, width, heigth);
                    int t = 0, l = 0;
                    if (bmp.Height > bmp.Width)
                        t = (bmp.Height - bmp.Width) / 2;
                    else
                        l = (bmp.Width - bmp.Height) / 2;
                    g.DrawImage(bmp, new Rectangle(0, 0, width, heigth), new Rectangle(l, t, bmp.Width - l * 2, bmp.Height - t * 2), GraphicsUnit.Pixel);
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