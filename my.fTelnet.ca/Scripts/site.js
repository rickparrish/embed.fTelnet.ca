$(document).ready(function () {
    SetFontSize(12, 23) || SetFontSize(10, 19) || SetFontSize(9, 16) || SetFontSize(8, 13) || SetFontSize(8, 12) || SetFontSize(7, 12) || SetFontSize(6, 8, true);
    HtmlTerm.Init("HtmlTermContainer", ClientVars);
    VK_Init();
});

function OpenPanel(id) {
    $('.panel').hide('slow');
    $('#pnl' + id).show('slow');
}

function SetFontSize(width, height, force) {
    if (typeof force === 'undefined') force = false;

    if (force || (($(window).width() >= (width * 80)) && (($(window).height() - 60) >= (height * 25)))) { // -60 for top nav
        ClientVars.FontWidth = width;
        ClientVars.FontHeight = height;
        return true;
    }

    return false;
}