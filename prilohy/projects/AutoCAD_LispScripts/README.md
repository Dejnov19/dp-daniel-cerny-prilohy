# AutoCAD LispScripts

## Účel

Složka obsahuje menší AutoLISP utility pro AutoCAD, které vznikly jako první automatizace problémů s geometrií po převodech mezi grafickými a CAD aplikacemi. Skripty slouží hlavně k normalizaci entit a ke kopírování vzorového tvaru na cílové objekty.

## Technologie

- Jazyk: AutoLISP / Visual LISP
- Prostředí: AutoCAD
- Rozhraní: ActiveX / COM přes `vl-load-com`
- Spuštění: načtení souboru přes `APPLOAD` a vyvolání definovaného příkazu

## Obsah složky

| Soubor | Příkaz | Popis |
| --- | --- | --- |
| `spl2circle_v02.lsp` | `spl2cir` | Nahrazuje vybrané `SPLINE` entity kružnicemi se zadaným průměrem. |
| `elToCircle_v02.lsp` | `el2cir` | Nahrazuje vybrané `ELLIPSE` entity kružnicemi se zadaným průměrem. |
| `ObjToMid.lsp` | `VlozitSRotaci` | Kopíruje vzorový objekt do středu cílových objektů a natáčí jej podle jejich orientace. |

## Princip fungování

Skripty `spl2cir` a `el2cir` používají střed vypočtený z `BoundingBox`, zachovávají vrstvu a barvu původní entity a původní objekt nahrazují novou kružnicí. Skript `VlozitSRotaci` se pokouší určit střed přes region a centroid, při selhání použije bounding box. Orientaci odhaduje podle nejvzdálenějšího bodu od středu.

## Typické použití

1. V AutoCADu se načte požadovaný `.lsp` soubor přes `APPLOAD`.
2. Uživatel spustí příkaz `spl2cir`, `el2cir` nebo `VlozitSRotaci`.
3. Skript upraví vybrané objekty v aktuálním výkresu.
4. Výsledkem je čistší geometrie vhodná pro další CAD nebo výrobní zpracování.

## Omezení

- Cílový průměr kružnice zadává uživatel ručně.
- Střed vypočtený z bounding boxu nemusí odpovídat skutečnému centroidu.
- Odhad orientace je nejednoznačný u symetrických tvarů.
- Skripty neřeší validaci proti knihovně standardizovaných kamenů.

## Vazba na diplomovou práci

Tyto skripty představují prototypovou fázi automatizace před pozdějším C# pluginem ve složce `AutoCAD_Plugin`.
