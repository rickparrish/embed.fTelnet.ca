$(document).ready(function () {
    // Update, just in case they refreshed while on that page
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
    // Clean up the hostname in case someony copy/pastes it in there with extra spaces
    $('#txtHostname').val($.trim($('#txtHostname').val()));
    
    // Ensure we have a hostname
    if ($('#txtHostname').val() == '') {
        $('#lblIframe').html('Please enter a hostname!');
        $('#hlTest').attr("href", "javascript:alert('Please enter a hostname!');");
        return;
    }

    // Hostname
    var Values = 'Hostname=' + $('#txtHostname').val();
    
    // Port
    if ($('#txtPort').val() == '') {
        // No port, use default
        if ($('#cboProxyServer').val() == 'none') {
            // No proxy, use 1123
            Values += '&Port=1123';
        } else {
            // Proxy, use 23
            Values += '&Port=23';
        }
    } else {
        Values += '&Port=' + $('#txtPort').val();
    }
    
    // Proxy
    if ($('#cboProxyServer').val() != 'none') {
        var HostPort = $('#cboProxyServer').val().split(':');
        Values += '&Proxy=proxy-' + HostPort[0] + '.ftelnet.ca';
        Values += '&ProxyPort=' + HostPort[1];
        Values += '&ProxyPortSecure=' + HostPort[2];
    }
    
    // Connection type
    Values += '&ConnectionType=' + $('#cboConnectionType').val();
    
    // Emulation
    Values += '&Emulation=' + $('#cboEmulation').val();
    
    // Virtual keyboard
    Values += '&VirtualKeyboard=' + $('#cboVirtualKeyboard').val();
    
    // Splash screen
    if ($('#txtSplashScreen').val() != '') {
        Values += '&SplashScreen=' + encodeURIComponent($('#txtSplashScreen').val());
    }

    // Build the url and full tag, and update the page
    var Url = 'http://embed.ftelnet.ca/?' + Values;
    var Tag = '&lt;iframe src="' + Url + '" width="100%" height="1000"&gt;&lt;/iframe&gt;';
    $('#lblIframe').html(Tag);
    $('#hlTest').attr("href", Url);
}