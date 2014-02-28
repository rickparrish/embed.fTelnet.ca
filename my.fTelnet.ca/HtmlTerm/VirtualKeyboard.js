var FAlt = false;
var FCapsLock = false;
var FCtrl = false;
var FShift = false;

var FCharCodes = Array();

function OnCharUp(e) {
    var KeyCode = parseInt(e.target.getAttribute("data-keycode"), 10);
    var CharCode = 0;
    if ((KeyCode >= 65) && (KeyCode <= 90)) {
        // Alphanumeric takes shift AND capslock into account
        CharCode = parseInt((FShift ^ FCapsLock) ? FCharCodes[KeyCode].Shifted : FCharCodes[KeyCode].Normal, 10);
    } else {
        // Other keys just take shift into account
        CharCode = parseInt(FShift ? FCharCodes[KeyCode].Shifted : FCharCodes[KeyCode].Normal, 10);
    }

    // Determine if ctrl, alt or shift were held down
    var NeedReDraw = false;
    var RegularKey = true;
    if (FAlt) {
        NeedReDraw = true;
        RegularKey = false;
    }
    if (FCtrl) {
        NeedReDraw = true;
        RegularKey = false;
    }
    if (FShift) {
        NeedReDraw = true;
    }

    // Always dispatch onKeyDown, and then only OnTextEvent for regular keypresses
    Crt.PushKeyDown(0, KeyCode, FCtrl, FAlt, FShift);
    if (RegularKey) Crt.PushKeyPress(CharCode, 0, FCtrl, FAlt, FShift);

    // Reset flags and redraw, if necessary
    if (NeedReDraw) {
        FAlt = false;
        FCtrl = false;
        FShift = false;
        ReDraw();
    }
}

function OnCodeUp(e) {
    var KeyCode = parseInt(e.target.getAttribute("data-keycode"), 10);

    var NeedReset = false;
    switch (KeyCode) {
        case Keyboard.ALTERNATE:
            FAlt = !FAlt;
            ReDraw();
            break;
        case Keyboard.CAPS_LOCK:
            FCapsLock = !FCapsLock;
            ReDraw();
            break;
        case Keyboard.CONTROL:
            FCtrl = !FCtrl;
            ReDraw();
            break;
        case Keyboard.SHIFT:
            FShift = !FShift;
            ReDraw();
            break;
        default:
            NeedReset = true;
            break;
    }

    Crt.PushKeyDown(0, KeyCode, FCtrl, FAlt, FShift);

    if (NeedReset) {
        FAlt = false;
        FCtrl = false;
        FShift = false;
        ReDraw();
    }
}

function HighlightKey(className, lit) {
    var Keys = document.getElementsByClassName(className);
    for (var i = 0; i < Keys.length; i++) {
        Keys[i].style.color = lit ? "#00ff00" : "#eee";
    }
}

function ReDraw() {
    HighlightKey("caps", FCapsLock);
    HighlightKey("shift", FShift);
    HighlightKey("ctrl", FCtrl);
    HighlightKey("alt", FAlt);
}

function VirtualKeyboard_Init() {
    // KeyCode to CharCode mapping
    for (var i = 65; i <= 90; i++) {
        FCharCodes[i] = { Normal: i + 32, Shifted: i };
    }
    FCharCodes[192] = { Normal: 96, Shifted: 126 }; // `
    FCharCodes[49] = { Normal: 49, Shifted: 33 }; // 1
    FCharCodes[50] = { Normal: 50, Shifted: 64 }; // 2
    FCharCodes[51] = { Normal: 51, Shifted: 35 }; // 3
    FCharCodes[52] = { Normal: 52, Shifted: 36 }; // 4
    FCharCodes[53] = { Normal: 53, Shifted: 37 }; // 5
    FCharCodes[54] = { Normal: 54, Shifted: 94 }; // 6
    FCharCodes[55] = { Normal: 55, Shifted: 38 }; // 7
    FCharCodes[56] = { Normal: 56, Shifted: 42 }; // 8
    FCharCodes[57] = { Normal: 57, Shifted: 40 }; // 9
    FCharCodes[48] = { Normal: 48, Shifted: 41 }; // 0
    FCharCodes[173] = { Normal: 45, Shifted: 95 }; // -
    FCharCodes[61] = { Normal: 61, Shifted: 43 }; // =
    FCharCodes[219] = { Normal: 91, Shifted: 123 }; // [
    FCharCodes[221] = { Normal: 93, Shifted: 125 }; // ]
    FCharCodes[220] = { Normal: 92, Shifted: 124 }; // \
    FCharCodes[59] = { Normal: 59, Shifted: 58 }; // ;
    FCharCodes[222] = { Normal: 39, Shifted: 34 }; // '
    FCharCodes[188] = { Normal: 44, Shifted: 60 }; // ,
    FCharCodes[190] = { Normal: 46, Shifted: 62 }; // .
    FCharCodes[191] = { Normal: 47, Shifted: 63 }; // /

    // Handle click events for all keys
    var Keys = document.getElementsByClassName("key");
    for (var i = 0; i < Keys.length; i++) {
        if (Keys[i].addEventListener) {  // all browsers except IE before version 9
            var KeyCode = Keys[i].getAttribute("data-keycode");
            if (FCharCodes[KeyCode]) {
                // Regular character
                Keys[i].addEventListener("click", OnCharUp, false);
            } else {
                // Special character
                Keys[i].addEventListener("click", OnCodeUp, false);
            }
        }
    }
}
