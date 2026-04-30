# Zdrojové kódy vytvořených nástrojů

Tato složka obsahuje zdrojové kódy a podpůrné soubory nástrojů vytvořených v rámci praktické části diplomové práce. Projekty jsou rozděleny podle prostředí, ve kterém se používají.

## Přehled projektů

| Projekt | Prostředí | Popis |
| --- | --- | --- |
| `AutoCAD_LispScripts/` | AutoCAD | AutoLISP prototypy pro převod geometrií a kopírování orientovaných objektů. |
| `AutoCAD_Plugin/` | AutoCAD | C# .NET plugin pro přípravu CAD dat, parcelaci, řazení a export. |
| `Corel_reColor/` | CorelDRAW | VBA makra pro převod barev z obrysu do výplně. |
| `Illustator_Plugin/` | Adobe Illustrator | ExtendScript plugin pro vkládání kamenů a spouštění navazujících automatizací. |
| `Illustrator_Kusovnik/` | Adobe Illustrator | Skript pro generování kusovníku přímo z vrstev dokumentu. |
| `Illustrator_reColor/` | Adobe Illustrator | Skript pro přebarvení vrstev podle knihovny prefixů a RGB barev. |

## Společné principy

- Většina nástrojů využívá existující semantiku dokumentu, zejména vrstvy, barvy, názvy objektů a geometrii.
- Část nástrojů vznikla jako prototyp a později byla rozšířena do komplexnějšího workflow.
- Některé skripty obsahují lokální nebo placeholder cesty, které je před spuštěním nutné upravit.
- Projekty nejsou univerzální knihovny, ale praktické nástroje navržené pro konkrétní workflow popsané v diplomové práci.

## Detailní dokumentace

Každá podsložka obsahuje vlastní `README.md` s detailnějším popisem účelu, obsahu, použití a omezení.
