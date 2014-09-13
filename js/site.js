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
    InitVirtualKeyboard();

    // See if we should load a specific panel
    if (location.hash) {
        var Panel = location.hash.replace('#', '');
        if (!OpenPanel(Panel)) OpenPanel('HtmlTerm');
    } else {
        OpenPanel('HtmlTerm');
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

$('#chkVirtualKeyboard').change(function () {
    localStorage["VirtualKeyboard"] = JSON.stringify($('#chkVirtualKeyboard').is(':checked'));
    if ($('#chkVirtualKeyboard').is(':checked')) {
        $('#vk-keyboard').css("display", "block");
    } else {
        $('#vk-keyboard').css("display", "none");
    }
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
    HtmlTerm.ConnectionType = connectionType;
    HtmlTerm.Hostname = hostname;
    HtmlTerm.Port = port;
    HtmlTerm.ProxyHostname = (proxy ? "proxy-us-atl.ftelnet.ca" : "");
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

function InitVirtualKeyboard() {
    // Init the click handlers
    VK_Init();
    
    // Detect whether to show or hide the virtual keyboard based on whether the user is mobile or not
    var HideVK = true;
    // From: http://detectmobilebrowsers.com/ on Sep 11, 2014
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test((navigator.userAgent||navigator.vendor||window.opera))||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4))) {
        // Likely a mobile device -- so we don't want to hide the keyboard
        HideVK = false;
    }
    
    // Override above detection if we have a saved preference
    if (localStorage["VirtualKeyboard"]) HideVK = !JSON.parse(localStorage["VirtualKeyboard"]);
    
    // If we want it hidden, then hide it
    if (HideVK) {
        $('#vk-keyboard').css("display", "none");
        $("#chkVirtualKeyboard").attr("checked", false);
    }
}

function OpenPanel(id) {
    if (!$('#pnl' + id).is(":visible")) {
        $('div[id^="pnl"]').hide('slow');
        $('#pnl' + id).show('slow');
        return true;
    }

    return false;
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
