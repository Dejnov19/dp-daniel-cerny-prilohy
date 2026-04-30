function insertStone(args) {
    // --- NASTAVENÍ PRO KONZISTENCI ---
    var oldInteraction = app.userInteractionLevel;
    var oldPreviewBounds;
    var oldScaleStrokes;

    try {
        if (app.documents.length === 0) throw new Error("Není otevřený žádný dokument.");
        var targetDoc = app.activeDocument;

        oldPreviewBounds = app.preferences.getBooleanPreference('previewBounds');
        oldScaleStrokes = app.preferences.getBooleanPreference('scaleLineWeight');
        
        // Vypneme problematická nastavení
        app.preferences.setBooleanPreference('previewBounds', false);
        app.preferences.setBooleanPreference('scaleLineWeight', false);

        // --- PROMĚNNÉ ---
        var newLayerName = args.name;
        var odsazeniOdRohu = 10; 
        var marginPt = odsazeniOdRohu * 2.834645;
        var actionSetName = "StonesActions";
        var actionNameCircle = "MakeCircle";
        var actionNameOffset = "MakeOffset";

        // --- POMOCNÉ FUNKCE ---
        function getBlackColor() {
            if (targetDoc.documentColorSpace === DocumentColorSpace.RGB) {
                var c = new RGBColor(); c.red = 0; c.green = 0; c.blue = 0; return c;
            } else {
                var c = new CMYKColor(); c.cyan = 0; c.magenta = 0; c.yellow = 0; c.black = 100; return c;
            }
        }

        function moveToTopRight(item) {
            var abIndex = targetDoc.artboards.getActiveArtboardIndex();
            var abRect = targetDoc.artboards[abIndex].artboardRect;
            var abRight = abRect[2];
            var abTop = abRect[1];
            item.position = [abRight - item.width - marginPt, abTop - marginPt];
        }

        function najdiCistyTvar(item) {
            if (item.typename === 'PathItem') { if (!item.clipping) return item; }
            else if (item.typename === 'CompoundPathItem') { return item; }
            else if (item.typename === 'GroupItem') {
                var items = item.pageItems;
                for (var i=0; i<items.length; i++) { var f = najdiCistyTvar(items[i]); if(f) return f; }
            }
            return null;
        }

        function runActionByName(actName) {
            var originalLevel = app.userInteractionLevel;
            try {
                app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
                app.doScript(actName, actionSetName);
            } catch(e) {
                throw new Error("Nepodařilo se spustit akci '" + actName + "'.");
            } finally {
                app.userInteractionLevel = originalLevel;
            }
        }

        function getTopObjectInLayer(layer) {
            if (layer.pageItems.length > 0) return layer.pageItems[0];
            return null;
        }

        // --- HLAVNÍ FUNKCE: Seskupit a opravit styly (OPRAVENO) ---
        function finalizeLayer(layer, groupName, blackColor) {
            app.executeMenuCommand('deselectall');
            var items = layer.pageItems;

            if (items.length > 1) {
                // === VARIANTA A: KÁMEN + OBRYS (Více objektů) ===
                // Tady CHCEME seskupovat
                for (var i = 0; i < items.length; i++) {
                    items[i].selected = true;
                }
                app.executeMenuCommand('group');

                if (app.activeDocument.selection.length > 0) {
                    var finalGroup = app.activeDocument.selection[0];
                    finalGroup.name = groupName;

                    // Oprava vzhledu uvnitř skupiny
                    if (finalGroup.pageItems.length >= 2) {
                        var itemA = finalGroup.pageItems[0];
                        var itemB = finalGroup.pageItems[1];
                        
                        // Větší je obrys, menší je kámen
                        var border, stone;
                        if (itemA.width > itemB.width) { border = itemA; stone = itemB; }
                        else { border = itemB; stone = itemA; }
                        
                        // Styl obrysu
                        if (border.typename === 'PathItem' || border.typename === 'CompoundPathItem') {
                            border.filled = false;
                            border.stroked = true;
                            border.strokeWidth = 0.25;
                            border.strokeColor = blackColor;
                        }
                        // Styl kamene
                        if (stone.typename === 'PathItem' || stone.typename === 'CompoundPathItem') {
                            stone.filled = true;
                            stone.fillColor = blackColor;
                            stone.stroked = false;
                        }
                    }
                }
            } 
            else if (items.length === 1) {
                // === VARIANTA B: JEN KÁMEN (Jeden objekt) ===
                // Tady NESESKUPOVAT! Jen pojmenovat a obarvit.
                var singleItem = items[0];
                singleItem.name = groupName; // Pojmenujeme přímo ten objekt
                
                if (singleItem.typename === 'PathItem' || singleItem.typename === 'CompoundPathItem') {
                    singleItem.filled = true;
                    singleItem.fillColor = blackColor;
                    singleItem.stroked = false;
                }
            }
        }

        // --- HLAVNÍ LOGIKA ---
        var newLayer = targetDoc.layers.add(); 
        newLayer.name = newLayerName;
        var black = getBlackColor();

        if (args.isRound) {
            // --- KULATÉ ---
            var diameterPt = args.size * 2.834645;

            app.executeMenuCommand('deselectall'); 
            runActionByName(actionNameCircle); 
            
            var circle = getTopObjectInLayer(newLayer);
            if (!circle) throw new Error("Akce MakeCircle nevytvořila žádný objekt.");

            circle.move(newLayer, ElementPlacement.PLACEATEND); 
            // Základní nastavení
            circle.filled = true; circle.fillColor = black; circle.stroked = false; 
            circle.width = diameterPt; circle.height = diameterPt; 
            moveToTopRight(circle); 
            
            if (args.addBorder) { 
                app.executeMenuCommand('deselectall');
                circle.selected = true; 
                runActionByName(actionNameOffset);
            }
            
            // Finální úklid
            finalizeLayer(newLayer, newLayerName, black);

        } else {
            // --- TVAROVÉ ---
            var f = new File(args.path);
            if (f.exists) {
                var item = targetDoc.placedItems.add();
                item.file = f;
                moveToTopRight(item);
                item.embed();
                
                if (targetDoc.selection.length > 0) {
                    var obal = targetDoc.selection[0];
                    var finalShape = najdiCistyTvar(obal);
                    
                    if (finalShape) {
                        finalShape.move(newLayer, ElementPlacement.PLACEATEND);
                        obal.remove();
                        
                        finalShape.filled = true; finalShape.fillColor = black; finalShape.stroked = false;
                        
                        app.executeMenuCommand('deselectall');
                        finalShape.selected = true;
                        
                        if (args.addBorder) {
                            try { app.executeMenuCommand('compoundPath'); } catch(e) {}
                            runActionByName(actionNameOffset);
                        }
                        
                        // Finální úklid
                        finalizeLayer(newLayer, newLayerName, black);
                    }
                }
            }
        }
        
    } catch(e) { 
        app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
        alert('Chyba insertStone: ' + e.message); 
    } finally {
        if (oldPreviewBounds !== undefined) app.preferences.setBooleanPreference('previewBounds', oldPreviewBounds);
        if (oldScaleStrokes !== undefined) app.preferences.setBooleanPreference('scaleLineWeight', oldScaleStrokes);
        app.userInteractionLevel = oldInteraction;
    }
}