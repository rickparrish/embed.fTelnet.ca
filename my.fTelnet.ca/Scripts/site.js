var SiteInitted = false;

$(document).ready(function () {
    SetBestFontSize();
    HtmlTerm.Init("HtmlTermContainer", ClientVars);
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
        return true;
    }

    return false;
}