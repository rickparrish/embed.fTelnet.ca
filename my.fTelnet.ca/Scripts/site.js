$(document).ready(function () {
    HtmlTerm.Init("HtmlTermContainer", ClientVars);
    VirtualKeyboard_Init();
});

function OpenPanel(id) {
    $('.panel').hide('slow');
    $('#pnl' + id).show('slow');
}