var RecentConnections = [];
var SiteInitted = false;

$(document).ready(function () {
    // Init HtmlTerm
    SetBestFontSize();
    HtmlTerm.Init("HtmlTermContainer");

    // Init Virtual Keyboard
    VK_Init();

    // See if we should skip the About panel
    if (localStorage["SkipAbout"] && (localStorage["SkipAbout"] == "true")) {
        $('#chkSkipAbout').prop('checked', true);
        OpenPanel('HtmlTerm');
    } else {
        OpenPanel('About');
    }

    // Load list of recent connections
    if (localStorage["RecentConnections"]) RecentConnections = JSON.parse(localStorage["RecentConnections"]);
    UpdateRecentMenu();

    // TODO Load dialing directory

    SiteInitted = true;
});

$(window).resize(function () {
    if (SiteInitted) SetBestFontSize();
});

function AddToRecentMenu(newEntry) {
    RecentConnections.push(newEntry);
    while (RecentConnections.length > 5) RecentConnections.shift();
    localStorage["RecentConnections"] = JSON.stringify(RecentConnections);
    UpdateRecentMenu();
}

function Connect() {
    var Hostname = $('#txtHostname').val();
    var Port = parseInt($('#txtPort').val(), 10);
    var Proxy = $('#chkProxy').is(':checked');

    // Validate form
    if (Hostname == "") {
        alert("Enter a hostname");
        return;
    }
    if ((Port < 1) || (Port > 65535)) {
        alert("Port must be between 1 and 65535");
        return;
    }

    // Hides the drop down Connect menu
    if ($('.navbar-toggle').is(':visible')) {
        // Mobile
        $('.navbar-collapse').collapse('toggle');
    } else {
        // Desktop
        $("body").trigger("click");
    }

    // Confirms new connection if already connected
    if (HtmlTerm.Connected()) {
        if (confirm("This will disconnect your existing session -- continue?")) {
            HtmlTerm.Disconnect();
        } else {
            return;
        }
    }

    // Add to recent menu / local storage
    AddToRecentMenu({
        'Hostname': Hostname,
        'Port': Port,
        'Proxy': Proxy
    });

    // Setup new values
    HtmlTerm.ServerName = Hostname;
    HtmlTerm.Hostname = Hostname;
    HtmlTerm.Port = Port;
    HtmlTerm.ProxyHostname = (Proxy ? "proxy.ftelnet.ca" : "");

    // And connect
    HtmlTerm.Connect();
}

function ConnectToRecent(index) {
    var Entry = RecentConnections[index];

    $('#txtHostname').val(Entry.Hostname);
    $('#txtPort').val(Entry.Port)
    $('#chkProxy').prop('checked', Entry.Proxy);

    Connect();
}

function OpenPanel(id) {
    if (!$('#pnl' + id).is(":visible")) {
        $('div[id^="pnl"]').hide('slow');
        $('#pnl' + id).show('slow');
    }
}

function SetBestFontSize() {
    SetFontSize(12, 23) || SetFontSize(10, 19) || SetFontSize(9, 16) || SetFontSize(8, 13) || SetFontSize(8, 12) || SetFontSize(7, 12) || SetFontSize(6, 8, true);
}

function SetFontSize(width, height, force) {
    if (typeof force === 'undefined') force = false;

    if (force || ((($(window).width() - 30) >= (width * 80)) && (($(window).height() - 60) >= (height * 25)))) { // -60 for top nav
        if (SiteInitted) {
            Crt.SetFont(437, width, height);
        } else {
            HtmlTerm.FontWidth = width;
            HtmlTerm.FontHeight = height;
        }

        $('link#VK_CSS').attr('href', VK_CSS_Url.replace("{size}", width * 80));

        return true;
    }

    return false;
}

function SetSkipAbout() {
    if ($('#chkSkipAbout').is(':checked')) {
        localStorage["SkipAbout"] = "true";
    } else {
        localStorage["SkipAbout"] = "false";
    }
}

function UpdateRecentMenu() {
    $('.recent-connection').remove();
    if (RecentConnections && (RecentConnections.length > 0)) {
        var Count = 0;
        for (var i = RecentConnections.length - 1; i >= 0; i--) {
            $('#liAfterRecent').before("<li class=\"recent-connection\"><a href=\"#\" onclick=\"ConnectToRecent(" + i + ");\">" + ++Count + ") " + RecentConnections[i].Hostname + ":" + RecentConnections[i].Port + "</a></li>");
        }
    } else {
        $('#liAfterRecent').before("<li class=\"recent-connection\"><a href=\"#\">No recent connections...</a></li>");
    }
}