#target illustrator

/**
 * Scripts_Launcher.jsx
 * Spouští vybrané skripty ze složky Skripty
 * Podporuje spouštění s vlastní session nebo v hlavním kontextu
 */

function runScript(scriptPath, useSession) {
    var scriptFile = new File(scriptPath);
    
    if (!scriptFile.exists) {
        alert("Chyba: Soubor skriptu neexistuje!\nCesta: " + scriptPath);
        return;
    }
    
    try {
        if (useSession) {
            // Spustit v samostatné session (vlastní okno/kontext)
            var bt = new BridgeTalk();
            bt.target = "illustrator";
            bt.body = "$.evalFile('" + scriptFile.fsName.replace(/\\/g, "\\\\") + "');";
            bt.send();
        } else {
            // Spustit v hlavním kontextu
            scriptFile.open("r");
            var code = scriptFile.read();
            scriptFile.close();
            eval(code);
        }
    } catch (e) {
        alert("Chyba při spouštění skriptu:\n" + e.message);
    }
}
