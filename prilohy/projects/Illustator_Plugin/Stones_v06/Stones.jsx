//Načte konkrétní skript z pevně dané cesty a spustí jej
#targetengine "stones_session"

(function () {
    var targetFilePath = "xxx/Stones_main.jsx";
    var targetScript = File(targetFilePath);

    if (!targetScript.exists) {
        alert("Nenalezen soubor: " + targetFilePath);
        return;
    }

    try {
        targetScript.open("r");
        var code = targetScript.read();
        targetScript.close();
        eval(code);
    } catch (e) {
        alert("Chyba při spouštění skriptu:\n" + e);
    }
})();