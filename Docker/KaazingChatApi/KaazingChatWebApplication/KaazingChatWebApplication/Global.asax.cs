using Common;
using System;
using System.IO;
using System.Web.Http;

namespace KaazingTestWebApplication
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            #region 系統Log啟動
            log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(Server.MapPath(@"~\log4net.config")));
            #endregion
            FileInfo IniFile = new FileInfo(Path.Combine(Server.MapPath(""), "common.ini"));
            using (FileStream FS = IniFile.OpenRead())
            {
                Config.ConfigStream = FS;
                Config.ReadParameter();
                Common.LogHelper.Logger.logPath = Path.Combine(Server.MapPath(""), Config.logDir);
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}