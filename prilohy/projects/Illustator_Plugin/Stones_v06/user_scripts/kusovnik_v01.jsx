// Zrušení aktuálního výběru
app.selection = null;

// ExtendScript: JSON parser fallback
if (typeof JSON === "undefined") {
    JSON = {};
    JSON.parse = function (s) {
        return eval('(' + s + ')');
    };
}

// Načtení dat z library.json
var scriptFile = File($.fileName);
var libraryFile = File(scriptFile.parent + "/library.json");
libraryFile.open("r");
var libraryData = libraryFile.read();
libraryFile.close();
var json = JSON.parse(libraryData);
var doc = app.activeDocument;

// Funkce pro nalezení nejnižšího (atomického) objektu ve skupině
function getFirstAtomicItem(item) {
    if (item.typename !== "GroupItem") return item;
    for (var i = 0; i < item.pageItems.length; i++) {
        var found = getFirstAtomicItem(item.pageItems[i]);
        if (found) return found;
    }
    return null;
}

// Připrav mapu rozměrů pro tvarové kameny a pole pro kulaté
var tvaroveMap = {};
var kulateRozmery = [];
if (json.kamen && json.kamen.length && typeof json.kamen.length === "number") {
    for (var i = 0; i < json.kamen.length; i++) {
        var kamen = json.kamen[i];
        if (kamen.tvar === "Tvarove") {
            for (var r = 0; r < kamen.rozmery.length; r++) {
                var rozmerObj = kamen.rozmery[r];
                tvaroveMap[rozmerObj.rozmer] = rozmerObj.velikosti || [];
            }
        } else if (kamen.tvar === "Kulate") {
            for (var r = 0; r < kamen.rozmery.length; r++) {
                kulateRozmery.push(kamen.rozmery[r].rozmer);
            }
        }
    }
} else {
    alert("Chyba: json.kamen není pole!");
}

// Projdeme vrstvy a připravíme data pro tabulky
var kulateRows = [], tvaroveRows = [], spatnyNazev = false;
for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];
    if (layer.locked) continue; // Ignoruj zamknuté vrstvy
    var firstObject = layer.pageItems.length > 0 ? getFirstAtomicItem(layer.pageItems[0]) : null;
    var rowText = "";
    var isKulate = false, isTvarove = false;
    // Kulaté kameny: hledání rozměru jako samostatného slova (case-insensitive)
    for (var j = 0; j < kulateRozmery.length; j++) {
        var rozmer = kulateRozmery[j];
        var regex = new RegExp("\\b" + rozmer + "\\b", "i");
        if (regex.test(layer.name)) {
            var count = layer.pageItems.length;
            rowText = rozmer + " / Barva / " + count + " pcs";
            isKulate = true;
            break;
        }
    }
    // Tvarové kameny: hledání rozměru a velikosti (case-insensitive)
    for (var rozmer in tvaroveMap) {
        if (layer.name.toLowerCase().indexOf(rozmer.toLowerCase()) !== -1) {
            var velikosti = tvaroveMap[rozmer];
            var velikostNalezena = "";
            for (var v = 0; v < velikosti.length; v++) {
                if (layer.name.toLowerCase().indexOf(velikosti[v].toLowerCase()) !== -1) {
                    velikostNalezena = velikosti[v];
                    break;
                }
            }
            var count = layer.pageItems.length;
            if (velikostNalezena) {
                rowText = rozmer + " / " + velikostNalezena + " / Barva / " + count + " pcs";
            } else {
                rowText = layer.name + " / Barva / / " + count + " pcs";
                spatnyNazev = true;
            }
            isTvarove = true;
            break;
        }
    }
    // Ulož řádek do správné tabulky
    if (rowText !== "") {
        if (isKulate) kulateRows.push({text: rowText, object: firstObject});
        if (isTvarove) tvaroveRows.push({text: rowText, object: firstObject});
    }
}

// Vytvoření vrstvy pro tabulku
var tableLayer = doc.layers.add();
tableLayer.name = "Table";

// Pomocná funkce pro vykreslení tabulky
function drawTable(rows, startY) {
    var rowHeight = 13, rowWidth = 300, mmToPt = 2.83465, startX = 0;
    for (var i = 0; i < rows.length; i++) {
        var y = startY + i * rowHeight * mmToPt;
        // Obdélník
        var rect = tableLayer.pathItems.rectangle(-y, startX, rowWidth * mmToPt, rowHeight * mmToPt);
        rect.stroked = true;
        rect.strokeWidth = 1;
        rect.filled = false;
        // Text
        var text = tableLayer.textFrames.add();
        text.contents = rows[i].text;
        text.left = startX + 30 * mmToPt;
        text.top = -y + rowHeight * mmToPt - 19 * mmToPt;
        text.textRange.size = 22;
        // Objekt z vrstvy (duplikace, zarovnání doleva, střed řádku, zůstává ve vrstvě)
        if (rows[i].object) {
            var clone = rows[i].object.duplicate(rows[i].object.layer, ElementPlacement.PLACEATEND);
            var centerY = -y - (rowHeight * mmToPt) / 2;
            var leftX = startX + 10 * mmToPt;
            clone.left = leftX;
            clone.top = centerY + (clone.height / 2);
        }
    }
}

// Vykresli tabulky pro kulaté a tvarové kameny
if (kulateRows.length > 0) drawTable(kulateRows, 0);
if (tvaroveRows.length > 0) drawTable(tvaroveRows, (kulateRows.length + 1) * 20 * 2.83465);

// Upozornění na špatný název kamene
if (spatnyNazev) alert("Špatný název kamene");

/*
Kód:
- Načte data z library.json
- Projde vrstvy a hledá kulaté/tvarové kameny podle názvu vrstvy (case-insensitive, rozměr jako samostatné slovo)
- Vytvoří dvě tabulky (kulaté/tvarové) do vrstvy "Table"
- Do tabulky vkládá text a duplikuje první atomický objekt z vrstvy
- Upozorní na špatný název kamene
*/