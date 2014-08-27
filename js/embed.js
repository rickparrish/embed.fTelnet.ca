var SiteInitted = false;

$(document).ready(function () {
    // Init HtmlTerm
    SetBestFontSize();
    HtmlTerm.Init("HtmlTermContainer");

    // Init Virtual Keyboard
    VK_Init();

    // Detect when focus has been lost
    var HasFocus = true;
    setInterval(function () {
        if (document.hasFocus() && !HasFocus) {
            HasFocus = true;
            $('#FocusWarning').hide();
        } else if (!document.hasFocus() && HasFocus) {
            HasFocus = false;
            $('#FocusWarning').show();
        }
    }, 500);

    SiteInitted = true;
});

$(window).resize(function () {
    if (SiteInitted) SetBestFontSize();
});

function Connect() {
    HtmlTerm.ConnectionType = GetQueryStringValue('ConnectionType');
    HtmlTerm.Hostname = GetQueryStringValue('Hostname');
    HtmlTerm.Port = GetQueryStringValue('Port');
    if (GetQueryStringValue('Proxy') == 'false') {
        // Legacy: false meant don't use a proxy, so don't do anything here
    } else if (GetQueryStringValue('Proxy') == 'true') {
        // Legacy: true meant use a proxy, so use the primary proxy here
        HtmlTerm.ProxyHostname = 'proxy-us-atl.ftelnet.ca';
    } else {
        // Any value other than true or false should be the actual proxy hostname
        HtmlTerm.ProxyHostname = GetQueryStringValue('Proxy');
    }
    HtmlTerm.ProxyPort = (GetQueryStringValue('ProxyPort') == '') ? '1123' : GetQueryStringValue('ProxyPort');
    HtmlTerm.ServerName = HtmlTerm.Hostname;
    
    switch (GetQueryStringValue('Emulation')) {
        case 'c64':
            Crt.C64 = true;
            Crt.SetFont("PETSCII-Lower", 16, 16);
            Crt.SetScreenSize(40, 25);
            break;
    }

    // And connect
    HtmlTerm.Connect();
}

function Download() {
    HtmlTerm.Download();
}

// From: http://css-tricks.com/snippets/javascript/get-url-variables/
function GetQueryStringValue(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function SetBestFontSize(force) {
    if (typeof force === 'undefined') force = false;

    // Abort if we don't have a numeric codepage
    if (SiteInitted && !force) {
        if (isNaN(parseInt(Crt.Font.CodePage, 10))) return;
    }

    // Try to set the biggest font that fits the screen
    SetFontSize(12, 23) ||
        SetFontSize(10, 19) ||
        SetFontSize(9, 16) ||
        SetFontSize(8, 14) ||
        SetFontSize(8, 13) ||
        SetFontSize(8, 12) ||
        SetFontSize(8, 8) ||
        SetFontSize(7, 12) ||
        SetFontSize(6, 8, true);
}

function SetFontSize(width, height, force) {
    if (typeof force === 'undefined') force = false;

    if (force || ((($(window).width() - 30) >= (width * 80)) && (($(window).height() - 60) >= (height * 25)))) { // -60 for top nav
        if (SiteInitted) {
            Crt.SetFont("437", width, height);
        } else {
            HtmlTerm.FontWidth = width;
            HtmlTerm.FontHeight = height;
        }

        $('link#VK_CSS').attr('href', VK_CSS_Url.replace("{size}", width * 80));

        return true;
    }

    return false;
}

function Upload() {
    $('#fuUpload').change(function () {
        HtmlTerm.Upload(this.files);
    });

    $('#fuUpload').trigger('click');
}
