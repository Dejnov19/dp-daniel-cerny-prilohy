#target illustrator
function main() {
    // --- 1. CESTY (DYNAMICKÉ) ---
    // Získáme cestu k právě spuštěnému skriptu a vezmeme jeho rodičovskou složku
    var scriptFile = new File($.fileName);
    var rootPath = "xxx/Stones_v06/";    
    // Nyní se vše odkazuje relativně k místu, kde leží tento skript
    var shapesFolder = new Folder(rootPath + "/Tvary");
    var skriptsFolder = new Folder(rootPath + "/user_scripts");
    var jsonFile = new File(rootPath + "/sizes.json");
    var actionFile = new File(rootPath + "/StonesActions.aia");
    var insertStoneFile = new File(rootPath + "/insertStone.jsx");
    var metadataFile = new File(rootPath + "/scripts_metadata.json");
    var launcherFile = new File(rootPath + "/Scripts_Launcher.jsx");

    // Cesta k logu
    var logoFile = new File(rootPath + "/logo.png");

    // --- 2. KONTROLA SOUBORŮ ---
    if (!shapesFolder.exists) { alert("Chyba: Složka 'Tvary' neexistuje!\nCesta: " + shapesFolder.fsName); return; }
    if (!jsonFile.exists) { alert("Chyba: Soubor 'sizes.json' neexistuje!\nCesta: " + jsonFile.fsName); return; }
    if (!actionFile.exists) { alert("Chyba: Soubor 'StonesActions.aia' neexistuje!\nCesta: " + actionFile.fsName); return; }
    if (!insertStoneFile.exists) { alert("Chyba: Soubor insertStone.jsx neexistuje\nCesta: " + insertStoneFile.fsName); return; }
    // --- 3. PRE-LOAD AKCE ---
    try {
        var actionSetName = "StonesActions";
        try {
            app.unloadAction(actionSetName, "");
        } catch(ignore) {}
        app.loadAction(actionFile);
    } catch(e) {
        alert("Chyba při načítání Akce:\n" + e.message);
        return;
    }

    // --- 4. NAČTENÍ DAT ---
    var fileList = shapesFolder.getFiles("*.ai");
    var shapeNames = [];
    var shapePaths = [];
    
    // Seřadíme soubory abecedně (volitelné, ale lepší pro UI)
    fileList.sort();

    for (var i = 0; i < fileList.length; i++) {
        var fName = decodeURI(fileList[i].name);
        if (fName.indexOf("_") === 0) continue; // Ignorovat soubory začínající podtržítkem
        shapeNames.push(fName.replace(".ai", ""));
        shapePaths.push(fileList[i].fsName);
    }

    var roundNames = [];
    var roundSizes = [];
    try {
        jsonFile.open('r');
        var jsonContent = jsonFile.read();
        jsonFile.close();
        var jsonData = eval("(" + jsonContent + ")");
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                roundNames.push(key);
                roundSizes.push(jsonData[key]);
            }
        }
    } catch(e) {
        alert("Chyba při čtení sizes.json: " + e.message);
        return;
    }

    // --- NAČTENÍ METADAT A SKRIPTŮ ---
    var scriptNames = [];
    var scriptPaths = [];
    var scriptMetadata = {};
    var scriptFileNames = [];
    
    if (metadataFile.exists) {
        try {
            metadataFile.open('r');
            scriptMetadata = eval("(" + metadataFile.read() + ")");
            metadataFile.close();
        } catch(e) {}
    }
    
    if (skriptsFolder.exists) {
        var scriptFiles = skriptsFolder.getFiles();
        scriptFiles.sort();
        
        for (var i = 0; i < scriptFiles.length; i++) {
            var scriptName = decodeURI(scriptFiles[i].name);
            if (scriptFiles[i] instanceof Folder || scriptName.indexOf(".") === 0) continue;
            var isJsFile = (scriptName.substr(-3) === ".js" || scriptName.substr(-4) === ".jsx");
            if (!isJsFile) continue;
            
            var metadata = scriptMetadata[scriptName];
            if (metadata && metadata.name) {
                scriptNames.push(metadata.name);
                scriptFileNames.push(scriptName);
                scriptPaths.push(scriptFiles[i].fsName);
            }
        }
    }

    // --- 5. PANEL (UI) ---
    var win = new Window("palette", "Knihovna Tvarů", undefined);
    win.orientation = "column"; 
    win.spacing = 20; win.margins = 20;

    // --- LOGO ---
    if (logoFile.exists) {
        var img = win.add("image", undefined, logoFile);
        img.alignment = "center";
    }

    var tpanel = win.add("tabbedpanel");
    tpanel.preferredSize = [300, 200];

    // Záložka 1: Tvary
    var tab1 = tpanel.add("tab", undefined, "Tvary");
    tab1.alignChildren = "fill";
    var dropShapes = tab1.add("dropdownlist", undefined, shapeNames);
    if (shapeNames.length > 0) dropShapes.selection = 0;
    
    var chkShapeBorder = tab1.add("checkbox", undefined, "Hranice");
    chkShapeBorder.value = false;

    // Záložka 2: Kulaté
    var tab2 = tpanel.add("tab", undefined, "Kulaté");
    tab2.alignChildren = "fill";
    var dropRound = tab2.add("dropdownlist", undefined, roundNames);
    if (roundNames.length > 0) dropRound.selection = 0;
    
    var chkRoundBorder = tab2.add("checkbox", undefined, "Hranice");
    chkRoundBorder.value = false;

    // Záložka 3: Skripty
    var tab3 = tpanel.add("tab", undefined, "Skripty");
    tab3.orientation = "row";
    tab3.alignChildren = "top";
    tab3.spacing = 10;
    
    // Levá strana - seznam skriptů
    var scriptList = tab3.add("listbox", undefined, scriptNames);
    scriptList.preferredSize = [140, 150];
    
    // Pravá strana - popis skriptu
    var scriptDescBox = tab3.add("statictext", undefined, "", {multiline: true, scrolling: true});
    scriptDescBox.preferredSize = [110, 100];
    scriptDescBox.characters = 15;
    
    if (scriptNames.length > 0) {
        scriptList.selection = 0;
        scriptDescBox.text = scriptMetadata[scriptFileNames[0]].desc || "(bez popisu)";
    }
    
    scriptList.onChange = function() {
        if (this.selection) {
            scriptDescBox.text = scriptMetadata[scriptFileNames[this.selection.index]].desc || "(bez popisu)";
        }
    };

    var btnAdd = win.add("button", undefined, "VLOŽIT");
    btnAdd.preferredSize.width = 250;
    btnAdd.preferredSize.height = 40;

    var btnClose = win.add("button", undefined, "Zavřít");
    btnClose.preferredSize.width = 250;

    // --- FUNKCE PRO AKTUALIZACI TLAČÍTKA ---
    function updateButtonText() {
        if (tpanel.selection == tab3) {
            btnAdd.text = "Spustit";
        } else {
            btnAdd.text = "VLOŽIT";
        }
    }
    
    // Aktualizace při změně záložky
    tpanel.onChange = function() {
        updateButtonText();
    };
    
    // Inicializace tlačítka
    updateButtonText();

    // --- 6. ODESLÁNÍ DAT ---
    btnAdd.onClick = function() {
        updateButtonText(); // Aktualizace před zpracováním
        var isScriptsTab = (tpanel.selection == tab3);
        var isRoundTab = (tpanel.selection == tab2);
        
        if (isScriptsTab) {
            if (!scriptList.selection) return;
            
            var idx = scriptList.selection.index;
            var metadata = scriptMetadata[scriptFileNames[idx]];
            var launcherCode = "#include '" + launcherFile.fsName + "'\n" +
                               "runScript('" + scriptPaths[idx].replace(/\\/g, "\\\\") + "', " + metadata.session + ");";
            
            var bt = new BridgeTalk();
            bt.target = "illustrator";
            bt.body = launcherCode;
            bt.send();
        } else {
            // TVARY A KULATÉ - původní logika
            var dataObj = {};
            dataObj.isRound = isRoundTab;
            
            if (isRoundTab) {
                if (!dropRound.selection) return;
                dataObj.name = dropRound.selection.text;
                dataObj.size = roundSizes[dropRound.selection.index];
                dataObj.addBorder = chkRoundBorder.value; 
            } else {
                if (!dropShapes.selection) return;
                dataObj.name = dropShapes.selection.text;
                // Cesta k .ai souboru tvaru je nyní plná systémová cesta (fsName)
                dataObj.path = shapePaths[dropShapes.selection.index].replace(/\\/g, "\\\\");
                dataObj.addBorder = chkShapeBorder.value; 
            }
            
            var jsonArgs = dataObj.toSource();

            var codeAsString = "#include '" + insertStoneFile.fsName + "'\n" + "insertStone(" + jsonArgs + ");";
            var bt = new BridgeTalk();
            bt.target = "illustrator";
            bt.body = codeAsString;
            bt.send();
        }
    };

    btnClose.onClick = function() { win.close(); };
    win.center();
    win.show();
}

main();