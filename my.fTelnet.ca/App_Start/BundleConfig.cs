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
                "~/Content/css/site.css",
                "~/HtmlTerm/VirtualKeyboard.css"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/site.js",
                "~/HtmlTerm/ClientVars.js",
                "~/HtmlTerm/HtmlTerm.compiled.js",
                "~/HtmlTerm/HtmlTerm.font-437.js",
                "~/HtmlTerm/VirtualKeyboard.js"));
        }
    }
}