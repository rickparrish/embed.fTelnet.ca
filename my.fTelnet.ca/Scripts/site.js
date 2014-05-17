var DialingDirectory = [];
var RecentConnections = [];
var SiteInitted = false;

$(document).ready(function () {
    // Test features
    TestFeatures();

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
    if (false && localStorage["DialingDirectory"]) { // TODO Never use stored dialing directory during testing period
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

function Connect(hostname, port, proxy, connectionType, emulation) {
    // Confirms new connection if already connected
    if (HtmlTerm.Connected()) {
        if (confirm("This will disconnect your existing session -- continue?")) {
            HtmlTerm.Disconnect();
        } else {
            return false;
        }
    }

    // Add to recent menu / local storage
    AddToRecentMenu({
        'ConnectionType': connectionType,
        'Emulation': emulation,
        'Hostname': hostname,
        'Port': port,
        'Proxy': proxy
    });

    // Setup new values
    HtmlTerm.ConnectionType = connectionType;
    HtmlTerm.Hostname = hostname;
    HtmlTerm.Port = port;
    HtmlTerm.ProxyHostname = (proxy ? "my.ftelnet.ca" : "");
    HtmlTerm.ServerName = hostname;
    switch (emulation) {
        case 'c64':
            if (!Crt.C64) {
                Crt.C64 = true;
                Crt.SetFont("PETSCII-Lower", 16, 16);
                Crt.SetScreenSize(40, 25);
            }
            break;
        default:
            if (Crt.C64) {
                Crt.C64 = false;
                SetBestFontSize(true);
                Crt.SetScreenSize(80, 25);
            }
            break;
    }

    // And connect
    HtmlTerm.Connect();
    OpenPanel('HtmlTerm');

    return true;
}

function ConnectToDialingDirectory(index) {
    var Entry = DialingDirectory[index];

    if (Connect(Entry.Hostname, Entry.Port, Entry.Proxy, Entry.ConnectionType, Entry.Emulation)) {
        // Update connection count
        Entry.ConnectionCount += 1;
        DialingDirectory[index] = Entry;
        localStorage["DialingDirectory"] = JSON.stringify(DialingDirectory);
        UpdateDialingDirectory();
    }
}

function ConnectToRecent(index) {
    var Entry = RecentConnections[index];
    Connect(Entry.Hostname, Entry.Port, Entry.Proxy, Entry.ConnectionType, Entry.Emulation);
}

function Download() {
    HtmlTerm.Download();
}

function InitDialingDirectory() {
    DialingDirectory.push({
        'ConnectionCount': 0,
        'ConnectionType': 'telnet',
        'Description': 'fTelnet / HtmlTerm / GameSrv Demo Server',
        'Emulation': 'ansi-bbs',
        'Hostname': 'bbs.ftelnet.ca',
        'Notes': 'Default connection entry',
        'Port': 1123,
        'Proxy': false
    });

    DialingDirectory.push({
        'ConnectionCount': 0,
        'ConnectionType': 'telnet',
        'Description': 'Vertrauen',
        'Emulation': 'ansi-bbs',
        'Hostname': 'vert.synchro.net',
        'Notes': 'Default connection entry<br />Home of <a href="http://www.synchro.net" target="_blank">Synchronet</a>',
        'Port': 23,
        'Proxy': true
    });

    DialingDirectory.push({
        'ConnectionCount': 0,
        'ConnectionType': 'tcp',
        'Description': 'LV-426',
        'Emulation': 'c64',
        'Hostname': 'lv426bbs.homenet.org',
        'Notes': 'Default connection entry<br />A Commodore 64 BBS',
        'Port': 23,
        'Proxy': true
    });

    DialingDirectory.push({
        'ConnectionCount': 0,
        'ConnectionType': 'telnet',
        'Description': 'Starwars Asciimation',
        'Emulation': 'ansi-bbs',
        'Hostname': 'towel.blinkenlights.nl',
        'Notes': 'Default connection entry<br /><a href="http://www.blinkenlights.nl/services.html#starwars" target="_blank">Home Page</a>',
        'Port': 23,
        'Proxy': true
    });

    localStorage["DialingDirectory"] = JSON.stringify(DialingDirectory);
}

function OpenPanel(id) {
    if (!$('#pnl' + id).is(":visible")) {
        $('div[id^="pnl"]').hide('slow');
        $('#pnl' + id).show('slow');
    }
}

function QuickConnect() {
    var Hostname = $('#txtHostname').val();

    // Validate form
    if (Hostname == "") {
        alert("Enter a hostname");
        return;
    }

    if (Connect(Hostname, 23, true, 'telnet', 'ansi-bbs')) {
        // Hides the drop down Connect menu
        if ($('.navbar-toggle').is(':visible')) {
            // Mobile
            $('.navbar-collapse').collapse('toggle');
        } else {
            // Desktop
            $("body").trigger("click");
        }
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

function SetSkipAbout() {
    if ($('#chkSkipAbout').is(':checked')) {
        localStorage["SkipAbout"] = "true";
    } else {
        localStorage["SkipAbout"] = "false";
    }
}

function TestFeatures() {
    // Canvas
    var elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        $('#tdCanvasSupported').text('Yep!');
        $('#tdCanvasSupported').addClass('text-success text-center');
    } else {
        $('#tdCanvasSupported').text('Nope!');
        $('#tdCanvasSupported').addClass('text-danger text-center');
    }

    // WebSocket
    if ('WebSocket' in window) {
        $('#tdWebSocketSupported').text('Yep!');
        $('#tdWebSocketSupported').addClass('text-success text-center');
    } else {
        $('#tdWebSocketSupported').text('Nope!');
        $('#tdWebSocketSupported').addClass('text-danger text-center');
    }

    // WebSocket binaryType
    if (WebSocketSupportsBinaryType) {
        $('#tdWebSocketBinaryTypeSupported').text('Yep!');
        $('#tdWebSocketBinaryTypeSupported').addClass('text-success text-center');
    } else {
        $('#tdWebSocketBinaryTypeSupported').text('Nope!');
        $('#tdWebSocketBinaryTypeSupported').addClass('text-danger text-center');
    }

    // Typed Arrays
    if (WebSocketSupportsTypedArrays) {
        $('#tdTypedArraysSupported').text('Yep!');
        $('#tdTypedArraysSupported').addClass('text-success text-center');
    } else {
        $('#tdTypedArraysSupported').text('Nope!');
        $('#tdTypedArraysSupported').addClass('text-danger text-center');
    }

    // Web Storage
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        $('#tdWebStorageSupported').text('Yep!');
        $('#tdWebStorageSupported').addClass('text-success text-center');
    } catch (e) {
        $('#tdWebStorageSupported').text('Nope!');
        $('#tdWebStorageSupported').addClass('text-danger text-center');
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

function Upload() {
    $('#fuUpload').change(function () {
        HtmlTerm.Upload(this.files);
    });

    $('#fuUpload').trigger('click');
}