$(document).ready(function () {
    // Update, just in case they refreshed while on that page
    Update();
});

$('#cboAutoConnect').change(function () {
    Update();
});

$('#cboConnectionType').change(function () {
    Update();
});

$('#cboEmulation').change(function () {
    Update();
});

$('#cboProxyServer').change(function () {
    Update();
});

$('#cboVirtualKeyboard').change(function () {
    Update();
});

$('#txtCSS').keyup(function () {
    Update();
});

$('#txtHostname').keyup(function () {
    Update();
});

$('#txtPort').keyup(function () {
    Update();
});

$('#txtSplashScreen').keyup(function () {
    Update();
});

function Update() {
    var fTelnetAutoConnect = '';
    var fTelnetCss = '';
    var fTelnetScript = '';
    var IframeUrl = '//embed.ftelnet.ca/';

    // Clean up the hostname in case someone copy/pastes it in there with extra spaces
    $('#txtHostname').val($.trim($('#txtHostname').val()));
    
    // Ensure we have a hostname
    if ($('#txtHostname').val() == '') {
        $('#pnlSnippet').addClass('hide');
        return;
    } else {
        $('#pnlSnippet').removeClass('hide');
    }

    // Hostname
    fTelnetScript += ' &nbsp; &nbsp; fTelnet.Hostname = "' + $('#txtHostname').val() + '";<br />';
    IframeUrl += '?Hostname=' + $('#txtHostname').val();
    
    // Port
    if ($('#txtPort').val() == '') {
        // No port, use default
        if ($('#cboProxyServer').val() == 'none') {
            // No proxy, use 1123
            fTelnetScript += ' &nbsp; &nbsp; fTelnet.Port = 1123;<br />';
            IframeUrl += '&Port=1123';
        } else {
            // Proxy, use 23
            fTelnetScript += ' &nbsp; &nbsp; fTelnet.Port = 23;<br />';
            IframeUrl += '&Port=23';
        }
    } else {
        fTelnetScript += ' &nbsp; &nbsp; fTelnet.Port = ' + $('#txtPort').val() + ';<br />';
        IframeUrl += '&Port=' + $('#txtPort').val();
    }
    
    // Proxy
    if ($('#cboProxyServer').val() != 'none') {
        var HostPorts = $('#cboProxyServer').val().split(':');
        fTelnetScript += ' &nbsp; &nbsp; fTelnet.ProxyHostname = "proxy-' + HostPorts[0] + '.ftelnet.ca";<br />';
        fTelnetScript += ' &nbsp; &nbsp; fTelnet.ProxyPort = ' + HostPorts[1] + ';<br />';
        fTelnetScript += ' &nbsp; &nbsp; fTelnet.ProxyPortSecure = ' + HostPorts[2] + ';<br />';
        IframeUrl += '&Proxy=proxy-' + HostPorts[0] + '.ftelnet.ca';
        IframeUrl += '&ProxyPort=' + HostPorts[1];
        IframeUrl += '&ProxyPortSecure=' + HostPorts[2];
    }
    
    // Auto connect
    if ($('#cboAutoConnect').val() == 'true') {
        fTelnetAutoConnect = '<br /> &nbsp; &nbsp; fTelnet.Connect();';
    }
    IframeUrl += '&AutoConnect=' + $('#cboAutoConnect').val();
    
    // Connection type
    fTelnetScript += ' &nbsp; &nbsp; fTelnet.ConnectionType = "' + $('#cboConnectionType').val() + '";<br />';
    IframeUrl += '&ConnectionType=' + $('#cboConnectionType').val();
    
    // Emulation
    fTelnetScript += ' &nbsp; &nbsp; fTelnet.Emulation = "' + $('#cboEmulation').val() + '";<br />';
    IframeUrl += '&Emulation=' + $('#cboEmulation').val();
    
    // Virtual keyboard
    if ($('#cboVirtualKeyboard').val() != 'auto') {
      fTelnetScript += ' &nbsp; &nbsp; fTelnet.VirtualKeyboardVisible = ' + ($('#cboVirtualKeyboard').val() != 'off') + ';<br />';
    }
    IframeUrl += '&VirtualKeyboard=' + $('#cboVirtualKeyboard').val();
    
    // CSS
    if ($('#txtCSS').val() != '') {
        fTelnetCss = '&lt;link id="fTelnetCss" type="text/css" rel="stylesheet" href="' + $('#txtCSS').val() + '" /&gt;<br />';
        IframeUrl += '&CSS=' + encodeURIComponent($('#txtCSS').val());
    }

    // Splash screen
    if ($('#txtSplashScreen').val() != '') {
        fTelnetScript += ' &nbsp; &nbsp; fTelnet.SplashScreen = "' + $('#txtSplashScreen').val() + '";<br />';
        IframeUrl += '&SplashScreen=' + encodeURIComponent($('#txtSplashScreen').val());
    }

    // Update the page with the snippets
    $('#hlTest').attr("href", IframeUrl);
    $('#lblJavascript').html(fTelnetCss + '&lt;div id="fTelnetContainer"&gt;&lt;/div&gt;<br />&lt;script src="//embed.ftelnet.ca/ftelnet/ftelnet.min.js" id="fTelnetScript"&gt;&lt;/script&gt;<br />&lt;script&gt;<br />' + fTelnetScript + ' &nbsp; &nbsp; fTelnet.Init();' + fTelnetAutoConnect + '<br />&lt;/script&gt;');
    $('#lblIframe').html('&lt;iframe src="' + IframeUrl + '" width="100%" height="1000"&gt;&lt;/iframe&gt;');
    
}