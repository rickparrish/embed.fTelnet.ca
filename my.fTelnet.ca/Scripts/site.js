var DialingDirectory = [];
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

    // Load dialing directory
    if (localStorage["DialingDirectory"]) {
        DialingDirectory = JSON.parse(localStorage["DialingDirectory"]);
    } else {
        InitDialingDirectory();
    }
    UpdateDialingDirectory();
    $("#tblDialingDirectory").tablesorter();

    SiteInitted = true;
});

$(window).resize(function () {
    if (SiteInitted) SetBestFontSize();
});

function AddToRecentMenu(newEntry) {
    RecentConnections.unshift(newEntry);
    while (RecentConnections.length > 5) RecentConnections.pop();
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

    // Confirms new connection if already connected
    if (HtmlTerm.Connected()) {
        if (confirm("This will disconnect your existing session -- continue?")) {
            HtmlTerm.Disconnect();
        } else {
            return false;
        }
    }

    // Hides the drop down Connect menu
    if ($('.navbar-toggle').is(':visible')) {
        // Mobile
        $('.navbar-collapse').collapse('toggle');
    } else {
        // Desktop
        $("body").trigger("click");
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
    OpenPanel('HtmlTerm');

    return true;
}

function ConnectToDialingDirectory(index) {
    var Entry = DialingDirectory[index];

    $('#txtHostname').val(Entry.Hostname);
    $('#txtPort').val(Entry.Port)
    $('#chkProxy').prop('checked', Entry.Proxy);

    if (Connect()) {
        // Update connection count
        Entry.ConnectionCount += 1;
        DialingDirectory[index] = Entry;
        localStorage["DialingDirectory"] = JSON.stringify(DialingDirectory);
        UpdateDialingDirectory();
    }
}

function ConnectToRecent(index) {
    var Entry = RecentConnections[index];

    $('#txtHostname').val(Entry.Hostname);
    $('#txtPort').val(Entry.Port)
    $('#chkProxy').prop('checked', Entry.Proxy);

    Connect();
}

function InitDialingDirectory() {
    DialingDirectory.push({
        Description: 'fTelnet / HtmlTerm / GameSrv Demo Server',
        Hostname: 'bbs.ftelnet.ca',
        Port: 1123,
        Proxy: false,
        Notes: 'Default connection entry',
        ConnectionCount: 0
    });

    DialingDirectory.push({
        Description: 'Vertrauen',
        Hostname: 'vert.synchro.net',
        Port: 23,
        Proxy: true,
        Notes: 'Default connection entry<br />Home of <a href="http://www.synchro.net" target="_blank">Synchronet</a>',
        ConnectionCount: 0
    });

    DialingDirectory.push({
        Description: 'Starwars Asciimation',
        Hostname: 'towel.blinkenlights.nl',
        Port: 23,
        Proxy: true,
        Notes: 'Default connection entry<br /><a href="http://www.blinkenlights.nl/services.html#starwars" target="_blank">Home Page</a>',
        ConnectionCount: 0
    });

    localStorage["DialingDirectory"] = JSON.stringify(DialingDirectory);
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

function UpdateDialingDirectory() {
    $('#tblDialingDirectory tbody tr').remove();
    if (DialingDirectory && (DialingDirectory.length > 0)) {
        for (var i = 0; i < DialingDirectory.length; i++) {
            var NewRow = '<tr>';
            NewRow += '<td>' + (i + 1) + '</td>';
            NewRow += '<td><a href="#" onclick="ConnectToDialingDirectory(' + i + ');">' + DialingDirectory[i].Description + '</a></td>';
            NewRow += '<td>' + DialingDirectory[i].Hostname + '</td>';
            NewRow += '<td>' + DialingDirectory[i].Port + '</td>';
            NewRow += '<td>' + (DialingDirectory[i].Proxy ? 'yep' : 'nope') + '</td>';
            NewRow += '<td>' + DialingDirectory[i].Notes + '</td>';
            NewRow += '<td class="text-center">' + DialingDirectory[i].ConnectionCount + '</td>';
            NewRow += '</tr>';
            $('#tblDialingDirectory tbody').append(NewRow);
        }
        $("#tblDialingDirectory").trigger('update');
    } else {
        $('#tblDialingDirectory tbody').append('<tr><td colspan="7">You have no dialing directory entries</td></tr>');
    }
}

function UpdateRecentMenu() {
    $('.recent-connection').remove();
    if (RecentConnections && (RecentConnections.length > 0)) {
        for (var i = 0; i < RecentConnections.length; i++) {
            $('#liAfterRecent').before('<li class="recent-connection"><a href="#" onclick="ConnectToRecent(' + i + ');">' + (i + 1) + ') ' + RecentConnections[i].Hostname + ':' + RecentConnections[i].Port + '</a></li>');
        }
    } else {
        $('#liAfterRecent').before('<li class="recent-connection"><a href="#">No recent connections...</a></li>');
    }
}