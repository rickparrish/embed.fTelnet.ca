var SiteInitted = false;

$(document).ready(function () {
    // Init HtmlTerm
    SetBestFontSize();
    HtmlTerm.Init("HtmlTermContainer", ClientVars);
    Crt.Window(1, 1, 80, 24);
    Crt.FastWrite(" Not connected                                                                  ", 1, 25, new TCharInfo(' ', 31, false, false), true);

    // Init Virtual Keyboard
    VK_Init();

    SiteInitted = true;
});

$(window).resize(function () {
    if (SiteInitted) SetBestFontSize();
});

function OpenPanel(id) {
    $('.panel').hide('slow');
    $('#pnl' + id).show('slow');
}

function SetBestFontSize() {
    SetFontSize(12, 23) || SetFontSize(10, 19) || SetFontSize(9, 16) || SetFontSize(8, 13) || SetFontSize(8, 12) || SetFontSize(7, 12) || SetFontSize(6, 8, true);
}

function SetFontSize(width, height, force) {
    if (typeof force === 'undefined') force = false;

    if (force || (($(window).width() >= (width * 80)) && (($(window).height() - 60) >= (height * 25)))) { // -60 for top nav
        if (SiteInitted) {
            Crt.SetFont(437, width, height);
        } else {
            ClientVars.FontWidth = width;
            ClientVars.FontHeight = height;
        }

        $('link#VK_CSS').attr('href', VK_CSS_Url.replace("{size}", width * 80));

        return true;
    }

    return false;
}