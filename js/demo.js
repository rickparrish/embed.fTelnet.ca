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

function Download() {
    HtmlTerm.Download();
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
