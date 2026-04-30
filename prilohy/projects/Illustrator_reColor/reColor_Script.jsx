/**
 * @file Adobe Illustrator script to recolor layers based on a prefix library.
 * @version 2.1
 */

// === LOADING OKNO ===

var loadingWindow = new Window('palette', 'Probíhá zpracování...');
loadingWindow.orientation = 'column';
var text = loadingWindow.add('statictext', undefined, 'Prosím čekejte, skript pracuje...');
text.alignment = 'center';
loadingWindow.center();
loadingWindow.show();
loadingWindow.update(); // Vynutí vykreslení okna

// =================================================================================
// === 1. POMOCNÉ FUNKCE A NAČTENÍ KNIHOVNY =========================================
// =================================================================================

/**
 * Vytvoří objekt barvy RGB pro Illustrator.
 * @param {number} r - Hodnota červené (0-255).
 * @param {number} g - Hodnota zelené (0-255).
 * @param {number} b - Hodnota modré (0-255).
 * @returns {RGBColor} Objekt barvy.
 */
function createRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}

/**
 * Nastaví barvu tahu daného objektu a vypne výplň.
 * @param {PageItem} item - Objekt, který se má obarvit.
 * @param {RGBColor} strokeColor - Barva tahu.
 */
function colorizeItem(item, strokeColor) {
    try {
        // Některé objekty (např. rastrové obrázky) nemusí mít tyto vlastnosti.
        if ("stroked" in item) {
            item.stroked = true; // Povolit tah
        }
        if ("strokeColor" in item) {
            item.strokeColor = strokeColor; // Nastavit barvu tahu
        }
        if ("filled" in item) {
            item.filled = false; // Zakázat výplň
        }
    } catch (e) {
        // Ignorovat chyby pro nepodporované typy objektů.
    }
}

// Pole pro uložení informací o vrstvách a jejich barvách z knihovny.
var vrstvyKnihovna = [];
// Odkaz na soubor s knihovnou (upravte cestu podle potřeby).

// Zadej konkrétní cestu ke knihovna.txt
var knihovnaFile = File("xxx/knihovna.txt");
// Pokud soubor knihovny existuje, načteme jeho obsah.
if (knihovnaFile.exists) {
    knihovnaFile.open('r');
    while (!knihovnaFile.eof) {
        var line = knihovnaFile.readln().replace(/^\s+|\s+$/g, ""); // Odstranění bílých znaků na začátku a konci.
        if (line !== "") {
            var parts = line.split(";"); // Rozdělení řádku na prefix a barvu (např. "prefix;255,0,0").
            var prefix = parts[0].toLowerCase();
            var color = null;

            // Pokud je zadána barva, převedeme ji na RGB.
            if (parts.length > 1 && parts[1] !== "") {
                var rgb = parts[1].split(",").map(function(n) {
                    return parseInt(n, 10);
                });
                if (rgb.length === 3 && !isNaN(rgb[0]) && !isNaN(rgb[1]) && !isNaN(rgb[2])) {
                    color = createRGBColor(rgb[0], rgb[1], rgb[2]);
                }
            }
            vrstvyKnihovna.push({
                prefix: prefix,
                color: color
            });
        }
    }
    knihovnaFile.close();
} else {
    alert("Soubor 'knihovna.txt' nebyl nalezen na cestě:\n" + knihovnaFile.fsName);
    throw new Error("Knihovna s definicí barev vrstev chybí. Skript byl ukončen.");
}

// =================================================================================
// === 2. HLAVNÍ LOGIKA SKRIPTU ====================================================
// =================================================================================

/**
 * Obarví všechny viditelné a neuzamčené objekty ve vrstvě.
 * Používá iterativní přístup (zásobník) místo rekurze.
 * @param {Layer} layer - Vrstva, jejíž obsah se má obarvit.
 * @param {RGBColor} strokeColor - Barva, která se má použít.
 */
function colorizeLayerContents(layer, strokeColor) {
    var itemsToProcess = [];
    for (var i = 0; i < layer.pageItems.length; i++) {
        itemsToProcess.push(layer.pageItems[i]);
    }

    while (itemsToProcess.length > 0) {
        var item = itemsToProcess.pop();

        // === OPTIMALIZACE: Přeskočíme skryté nebo zamčené objekty, protože je nelze upravit ===
        if (item.hidden || item.locked) {
            continue;
        }

        if (item.typename === "GroupItem") {
            for (var j = 0; j < item.pageItems.length; j++) {
                itemsToProcess.push(item.pageItems[j]);
            }
        } else if (item.typename === "CompoundPathItem") {
            for (var k = 0; k < item.pathItems.length; k++) {
                // I zde kontrolujeme jednotlivé části, ačkoliv by měly dědit stav z rodiče.
                if (!item.pathItems[k].hidden && !item.pathItems[k].locked) {
                    colorizeItem(item.pathItems[k], strokeColor);
                }
            }
        } else {
            colorizeItem(item, strokeColor);
        }
    }
}

// Záložní barvy pro případ, že vrstva má prefix, ale v knihovně není definována barva.
var fallbackColors = [
    createRGBColor(255, 0, 0),    // Červená
    createRGBColor(0, 0, 255),    // Modrá
    createRGBColor(0, 255, 0),    // Zelená
    createRGBColor(255, 0, 255),  // Magenta
    createRGBColor(0, 255, 255),  // Azurová
    createRGBColor(255, 255, 0),  // Žlutá
    createRGBColor(128, 128, 0),  // Olivová
    createRGBColor(125, 78, 36),  // Hnědá
    //-----------------------------------------------------Automat---
    createRGBColor(128, 0, 128),  // Fialová
    createRGBColor(255, 127, 0),  // Oranžová
    createRGBColor(0, 128, 128),  // Tmavá tyrkysová
    createRGBColor(255, 51, 153), // Růžová
    createRGBColor(0, 153, 255),  // Světle modrá
    createRGBColor(255, 165, 0),  // Tmavá oranžová
    createRGBColor(75, 0, 130),   // Indigo
    createRGBColor(220, 20, 60),  // Krymsonová
    createRGBColor(34, 139, 34),  // Tmavá lesní zelená
    createRGBColor(220, 20, 20),  // Sytá červená
    createRGBColor(129, 128, 127) // Šedá
];
var fallbackColorIndex = 0;

// Získání aktuálně otevřeného dokumentu v Illustratoru.
var doc = app.activeDocument;

// === NOVĚ: Přepnutí dokumentu do barevného režimu RGB ===
if (doc.documentColorSpace !== DocumentColorSpace.RGB) {
    doc.documentColorSpace = DocumentColorSpace.RGB;
}

// Hlavní smyčka, která prochází všechny vrstvy v dokumentu.
for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];
    
    // === OPTIMALIZACE: Přeskočíme zamčené nebo neviditelné vrstvy ===
    if (layer.locked || !layer.visible) {
        continue;
    }

    var layerName = layer.name.toLowerCase();

    // Porovnání názvu vrstvy s prefixy v načtené knihovně.
    for (var k = 0; k < vrstvyKnihovna.length; k++) {
        var config = vrstvyKnihovna[k];
        // ZMĚNA: Hledáme prefix kdekoliv v názvu vrstvy, ne jen na začátku
        if (layerName.indexOf(config.prefix) !== -1) {
            // Nalezena shoda prefixu kdekoliv v názvu vrstvy.
            var strokeColor = config.color || fallbackColors[fallbackColorIndex % fallbackColors.length];
            if (!config.color) {
              fallbackColorIndex++; // Použijeme další záložní barvu jen pokud nebyla specifikována.
            }
            colorizeLayerContents(layer, strokeColor);
            break; // Našli jsme shodu, můžeme přejít na další vrstvu.
        }
    }
}


// Zavření loading okna
if (loadingWindow) loadingWindow.close();
alert("Skript dokončen!");
