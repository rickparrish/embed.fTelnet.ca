var VK_AltPressed = false;
var VK_CapsLockEnabled = false;
var VK_CtrlPressed = false;
var VK_ShiftPressed = false;

var VK_CharCodes = Array();

function VK_HighlightKey(className, lit) {
    var Keys = document.getElementsByClassName(className);
    for (var i = 0; i < Keys.length; i++) {
        if (lit) {
            Keys[i].style.color = "#00ff00";
        } else {
            Keys[i].removeAttribute("style");
        }
    }
}

function VK_Init() {
    // KeyCode to CharCode mapping
    for (var i = 65; i <= 90; i++) {
        VK_CharCodes[i] = { Normal: i + 32, Shifted: i };
    }
    VK_CharCodes[192] = { Normal: 96, Shifted: 126 }; // `
    VK_CharCodes[49] = { Normal: 49, Shifted: 33 }; // 1
    VK_CharCodes[50] = { Normal: 50, Shifted: 64 }; // 2
    VK_CharCodes[51] = { Normal: 51, Shifted: 35 }; // 3
    VK_CharCodes[52] = { Normal: 52, Shifted: 36 }; // 4
    VK_CharCodes[53] = { Normal: 53, Shifted: 37 }; // 5
    VK_CharCodes[54] = { Normal: 54, Shifted: 94 }; // 6
    VK_CharCodes[55] = { Normal: 55, Shifted: 38 }; // 7
    VK_CharCodes[56] = { Normal: 56, Shifted: 42 }; // 8
    VK_CharCodes[57] = { Normal: 57, Shifted: 40 }; // 9
    VK_CharCodes[48] = { Normal: 48, Shifted: 41 }; // 0
    VK_CharCodes[173] = { Normal: 45, Shifted: 95 }; // -
    VK_CharCodes[61] = { Normal: 61, Shifted: 43 }; // =
    VK_CharCodes[219] = { Normal: 91, Shifted: 123 }; // [
    VK_CharCodes[221] = { Normal: 93, Shifted: 125 }; // ]
    VK_CharCodes[220] = { Normal: 92, Shifted: 124 }; // \
    VK_CharCodes[59] = { Normal: 59, Shifted: 58 }; // ;
    VK_CharCodes[222] = { Normal: 39, Shifted: 34 }; // '
    VK_CharCodes[188] = { Normal: 44, Shifted: 60 }; // ,
    VK_CharCodes[190] = { Normal: 46, Shifted: 62 }; // .
    VK_CharCodes[191] = { Normal: 47, Shifted: 63 }; // /

    // Handle click events for all keys
    var Keys = document.getElementsByClassName("vk-key");
    for (var i = 0; i < Keys.length; i++) {
        if (Keys[i].addEventListener) {  // all browsers except IE before version 9
            var KeyCode = Keys[i].getAttribute("data-keycode");
            if (VK_CharCodes[KeyCode]) {
                // Regular character
                Keys[i].addEventListener("click", VK_OnCharCode, false);
            } else {
                // Special character
                Keys[i].addEventListener("click", VK_OnKeyCode, false);
            }
        }
    }
}

function VK_OnCharCode(e) {
    var KeyCode = parseInt(e.target.getAttribute("data-keycode"), 10);
    var CharCode = 0;
    if ((KeyCode >= 65) && (KeyCode <= 90)) {
        // Alphanumeric takes shift AND capslock into account
        CharCode = parseInt((VK_ShiftPressed ^ VK_CapsLockEnabled) ? VK_CharCodes[KeyCode].Shifted : VK_CharCodes[KeyCode].Normal, 10);
    } else {
        // Other keys just take shift into account
        CharCode = parseInt(VK_ShiftPressed ? VK_CharCodes[KeyCode].Shifted : VK_CharCodes[KeyCode].Normal, 10);
    }

    // Determine if ctrl, alt or shift were held down
    var NeedReDraw = false;
    var RegularKey = true;
    if (VK_AltPressed) {
        NeedReDraw = true;
        RegularKey = false;
    }
    if (VK_CtrlPressed) {
        NeedReDraw = true;
        RegularKey = false;
    }
    if (VK_ShiftPressed) {
        NeedReDraw = true;
    }

    // Always dispatch onKeyDown, and then only OnTextEvent for regular keypresses
    Crt.PushKeyDown(0, KeyCode, VK_CtrlPressed, VK_AltPressed, VK_ShiftPressed);
    if (RegularKey) Crt.PushKeyPress(CharCode, 0, VK_CtrlPressed, VK_AltPressed, VK_ShiftPressed);

    // Reset flags and redraw, if necessary
    if (NeedReDraw) {
        VK_AltPressed = false;
        VK_CtrlPressed = false;
        VK_ShiftPressed = false;
        VK_ReDrawSpecialKeys();
    }
}

function VK_OnKeyCode(e) {
    var KeyCode = parseInt(e.target.getAttribute("data-keycode"), 10);

    var NeedReset = false;
    switch (KeyCode) {
        case Keyboard.ALTERNATE:
            VK_AltPressed = !VK_AltPressed;
            VK_ReDrawSpecialKeys();
            break;
        case Keyboard.CAPS_LOCK:
            VK_CapsLockEnabled = !VK_CapsLockEnabled;
            VK_ReDrawSpecialKeys();
            break;
        case Keyboard.CONTROL:
            VK_CtrlPressed = !VK_CtrlPressed;
            VK_ReDrawSpecialKeys();
            break;
        case Keyboard.SHIFT:
            VK_ShiftPressed = !VK_ShiftPressed;
            VK_ReDrawSpecialKeys();
            break;
        default:
            NeedReset = true;
            break;
    }

    Crt.PushKeyDown(0, KeyCode, VK_CtrlPressed, VK_AltPressed, VK_ShiftPressed);

    if (NeedReset) {
        VK_AltPressed = false;
        VK_CtrlPressed = false;
        VK_ShiftPressed = false;
        VK_ReDrawSpecialKeys();
    }
}

function VK_ReDrawSpecialKeys() {
    VK_HighlightKey("vk-capslock", VK_CapsLockEnabled);
    VK_HighlightKey("vk-lshift", VK_ShiftPressed);
    VK_HighlightKey("vk-rshift", VK_ShiftPressed);
    VK_HighlightKey("vk-ctrl", VK_CtrlPressed);
    VK_HighlightKey("vk-alt", VK_AltPressed);
}
