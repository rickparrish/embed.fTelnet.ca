using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace my.fTelnet.ca
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/css/bootstrap.min.css",
                "~/Content/css/bootstrap-theme.min.css",
                "~/Content/css/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jquery-1.11.0.min.js",
                "~/Scripts/bootstrap.min.js"));
        }
    }
}