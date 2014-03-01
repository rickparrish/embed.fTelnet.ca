$(document).ready(function () {
    HtmlTerm.Init("HtmlTermContainer", ClientVars);
    VK_Init();
});

function OpenPanel(id) {
    $('.panel').hide('slow');
    $('#pnl' + id).show('slow');
}