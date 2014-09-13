var SiteInitted = false;

$(document).ready(function () {
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

    // Parse querystring parameters and setup HtmlTerm properties
    ParseQueryString();
    
    SiteInitted = true;
}

$(window).resize(function () {
    if (SiteInitted) SetBestFontSize();
});

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

function ParseQueryString() {
    HtmlTerm.ConnectionType = GetQueryStringValue('ConnectionType');
    HtmlTerm.Hostname = GetQueryStringValue('Hostname');
    HtmlTerm.Port = GetQueryStringValue('Port');
    if (GetQueryStringValue('Proxy') != '') {
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
    }
    HtmlTerm.ServerName = HtmlTerm.Hostname;
    
    switch (GetQueryStringValue('Emulation')) {
        case 'c64':
            Crt.C64 = true;
            Crt.SetFont("PETSCII-Lower", 16, 16);
            Crt.SetScreenSize(40, 25);
            break;
    }
    
    switch (GetQueryStringValue('VirtualKeyboard')) {
        case 'auto':
            // From: http://detectmobilebrowsers.com/ on Sep 11, 2014
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test((navigator.userAgent||navigator.vendor||window.opera))||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4))) {
                // Likely a mobile device -- show keyboard by default but allow user to toggle
                // NB: Nothing to do, since it's shown by default
            } else {
                // Likely not a mobile device -- hide keyboard by default but allow user to toggle
                $('#vk-keyboard').css("display", "none");
            }
            break;
        case 'hide':
            // Hide keyboard by default but allow user to toggle
            $('#vk-keyboard').css("display", "none");
            break;
        case 'off':
            // Hide keyboard and toggle button
            $('#vk-keyboard').css("display", "none");
            $('#cmdVirtualKeyboard').css("display", "none");
            break;
        case 'on':
            // Show keyboard and hide toggle button
            $('#cmdVirtualKeyboard').css("display", "none");
            break;
        case 'show':
            // Show keyboard by default but allow user to toggle
            // NB: Nothing to do, since it's shown by default
            break;
    }
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

function ToggleVirtualKeyboard() {
    $('#vk-keyboard').toggle();
}

function Upload() {
    $('#fuUpload').change(function () {
        HtmlTerm.Upload(this.files);
    });

    $('#fuUpload').trigger('click');
}
