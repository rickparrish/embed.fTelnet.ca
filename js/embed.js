// Redirect to wizard if there are no querystring parameters
if (GetQueryStringValue('Hostname') == '') {
    location.href = "wizard.html";
}

$(document).ready(function () {
    // Load the remote css, if necessary
    if (GetQueryStringValue('CSS') != '') {
        document.getElementById('EmbedCSS').href = decodeURIComponent(GetQueryStringValue('CSS'));
    }
    
    // Load the remote splash screen, if necessary
    if (GetQueryStringValue('SplashScreen') == '') {
        FinishDocumentReady();
    } else {
        $.getScript(decodeURIComponent(GetQueryStringValue('SplashScreen'))).always(function () {
            FinishDocumentReady();
        });
    }
});

function FinishDocumentReady() {
    // Parse querystring parameters and setup fTelnet properties that can be set before init
    PreInit();

    // Init fTelnet
    fTelnet.Init();

    // Parse querystring parameters and setup fTelnet properties that have to be set after init
    PostInit();
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

function PostInit() {
    switch (GetQueryStringValue('Emulation')) {
        case 'c64':
            Crt.C64 = true;
            Crt.SetFont("C64-Lower");
            Crt.SetScreenSize(40, 25);
            break;
    }

    // Check for auto connect
    if (GetQueryStringValue('AutoConnect') == 'true') {
        fTelnet.Connect();
    }
}

function PreInit() {
    fTelnet.ConnectionType = GetQueryStringValue('ConnectionType');
    fTelnet.Hostname = GetQueryStringValue('Hostname');
    fTelnet.Port = GetQueryStringValue('Port');
    if (GetQueryStringValue('Proxy') != '') {
        if (GetQueryStringValue('Proxy') == 'false') {
            // Legacy: false meant don't use a proxy, so don't do anything here
        } else if (GetQueryStringValue('Proxy') == 'true') {
            // Legacy: true meant use a proxy, so use the primary proxy here
            fTelnet.ProxyHostname = 'proxy-us-ga.ftelnet.ca';
        } else {
            // Any value other than true or false should be the actual proxy hostname
            fTelnet.ProxyHostname = GetQueryStringValue('Proxy');
        }
        fTelnet.ProxyPort = (GetQueryStringValue('ProxyPort') == '') ? '1123' : GetQueryStringValue('ProxyPort');
        fTelnet.ProxyPortSecure = (GetQueryStringValue('ProxyPortSecure') == '') ? '11235' : GetQueryStringValue('ProxyPortSecure');
    }
        
    fTelnet.ButtonBarVisible = (GetQueryStringValue('TopButtons') != 'false');
    fTelnet.VirtualKeyboardVisible = (GetQueryStringValue('VirtualKeyboard') != 'off');
}