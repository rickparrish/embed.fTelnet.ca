var DialingDirectory = [];
var RecentConnections = [];

$(document).ready(function () {
    // Init virtual keyboard visibility
    InitVirtualKeyboard();
    
    // Init fTelnet
    fTelnet.ButtonBarVisible = false;
    fTelnet.Init();

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
});

$('#chkVirtualKeyboard').change(function () {
    localStorage["VirtualKeyboard"] = JSON.stringify($('#chkVirtualKeyboard').is(':checked'));
    fTelnet.VirtualKeyboardVisible = $('#chkVirtualKeyboard').is(':checked');
});

function AddToRecentMenu(newEntry) {
    RecentConnections.unshift(newEntry);
    while (RecentConnections.length > 5) RecentConnections.pop();
    localStorage["RecentConnections"] = JSON.stringify(RecentConnections);
    UpdateRecentMenu();
}

function Connect(hostname, port, proxy, connectionType, emulation) {
    // Disconnect first
    if (!fTelnet.Disconnect(true)) {
        return false;
    }
    
    // Clean up the hostname in case someony copy/pastes it in there with extra spaces
    hostname = $.trim(hostname);

    // Add to recent menu / local storage
    AddToRecentMenu({
        'ConnectionType': connectionType,
        'Emulation': emulation,
        'Hostname': hostname,
        'Port': port,
        'Proxy': proxy
    });

    // Setup new values
    fTelnet.ConnectionType = connectionType;
    fTelnet.Hostname = hostname;
    fTelnet.Port = port;
    fTelnet.ProxyHostname = (proxy ? "proxy-us-ga.ftelnet.ca" : "");
    fTelnet.ProxyPort = 1123;
    switch (emulation) {
        case 'c64':
            if (!Crt.C64) {
                Crt.C64 = true;
                Crt.SetFont("C64-Lower");
            }
            break;
        default:
            if (Crt.C64) {
                Crt.C64 = false;
                Crt.SetFont("CP437");
            }
            break;
    }

    // And connect
    fTelnet.Connect();

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
        $('#DialingDirectory').modal('hide')
    }
}

function ConnectToRecent(index) {
    var Entry = RecentConnections[index];
    Connect(Entry.Hostname, Entry.Port, Entry.Proxy, Entry.ConnectionType, Entry.Emulation);
}

function InitDialingDirectory() {
    DialingDirectory.push({
        'ConnectionCount': 0,
        'ConnectionType': 'telnet',
        'Description': 'fTelnet / GameSrv Demo Server',
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

function InitVirtualKeyboard() {
    var ShowVK = true;

    // Override if we have a saved preference
    if (localStorage["VirtualKeyboard"]) ShowVK = JSON.parse(localStorage["VirtualKeyboard"]);
    
    // If we want it hidden, then hide it
    fTelnet.VirtualKeyboardVisible = ShowVK;
    $("#chkVirtualKeyboard").attr("checked", ShowVK);
}

function QuickConnect() {
    var Hostname = $('#txtHostname').val();

    // Validate form
    if (Hostname == "") {
        Hostname = $('#txtHostname').attr("placeholder");
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
