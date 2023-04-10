export function getInstalledFonts() {
    var baseFonts = ["monospace", "sans-serif", "serif"];
    var fontList = [
        "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
        "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
        "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
        "Garamond", "Geneva", "Georgia",
        "Helvetica", "Helvetica Neue",
        "Impact",
        "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
        "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
        "Palatino", "Palatino Linotype",
        "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
        "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Ubuntu",
        "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
    ];
    var testString = "mimimimimimimimimimimimimimimimimimimimimimimimimimimi";

    var testSize = "72px";

    var h = document.getElementsByTagName("body")[0];

    var s = document.createElement("span");
    s.style.position = "absolute";
    s.style.left = "-9999px";
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index = 0, length = baseFonts.length; index < length; index++) {
        //get the default width for the three base fonts
        s.style.fontFamily = baseFonts[index];
        h.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font

        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
        h.removeChild(s);
    }
    var detect = function (font) {
        var detected = false;
        for (var index = 0, l = baseFonts.length; index < l; index++) {
            s.style.fontFamily = font + "," + baseFonts[index]; // name of the font along with the base font for fallback.
            h.appendChild(s);
            var matched = (s.offsetWidth !== defaultWidth[baseFonts[index]] || s.offsetHeight !== defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    };

    var available = [];
    //var jsInstalledFonts = '';
    for (var i = 0, l = fontList.length; i < l; i++) {
        if(detect(fontList[i])) {
            available.push(fontList[i])    
        }
    }
    return available

}