# Illustrator Plugin - Stones

## Účel

Složka obsahuje komplexnější ExtendScript plugin pro Adobe Illustrator. Plugin poskytuje jednotné rozhraní pro vkládání tvarových a kulatých kamenů, standardizuje vznik vrstev a umožňuje spouštět navazující skripty, například kusovník nebo přebarvení.

## Technologie

- Jazyk: ExtendScript (`.jsx`)
- Prostředí: Adobe Illustrator
- UI: ScriptUI
- Meziskriptová komunikace: BridgeTalk
- Datové soubory: JSON, `.aia`, `.ai`

## Obsah složky

| Soubor / složka | Popis |
| --- | --- |
| `Stones_v06/Stones.jsx` | Vstupní skript pluginu. |
| `Stones_v06/Stones_main.jsx` | Hlavní UI a načítání konfigurace. |
| `Stones_v06/insertStone.jsx` | Vkládání a finalizace kamenů v dokumentu. |
| `Stones_v06/Tvary/` | Knihovna tvarových předloh ve formátu `.ai`. |
| `Stones_v06/sizes.json` | Mapování kulatých velikostí na průměr v mm. |
| `Stones_v06/scripts_metadata.json` | Metadata navazujících skriptů zobrazovaných v panelu. |
| `Stones_v06/user_scripts/` | Navazující skripty spouštěné z pluginu. |
| `Stones_v06/StonesActions.aia` | Illustrator akce pro generování kružnic a offsetu. |
| `plugin_ukazka.png` | Ukázka pluginu. |

## Princip fungování

Plugin načítá knihovnu tvarů, tabulku kulatých velikostí a metadata pomocných skriptů. Uživatel vybírá kámen nebo navazující skript v panelu. Vlastní zásah do dokumentu probíhá přes BridgeTalk a samostatné skripty, které vloží objekt, vytvoří vrstvu, nastaví vzhled a případně doplní hranici.

## Typické použití

1. Uživatel spustí skript `Stones.jsx` v Adobe Illustratoru.
2. V panelu vybere tvarový nebo kulatý kámen.
3. Plugin vytvoří standardizovanou vrstvu a vloží kámen do dokumentu.
4. Ze stejného panelu lze spustit navazující automatizace.

## Omezení

- V některých souborech jsou cesty uvedené jako placeholder `xxx`, proto je nutná lokální úprava cest.
- Plugin závisí na souboru `StonesActions.aia`.
- Implementace používá starší ExtendScript a BridgeTalk, nikoli modernější CEP nebo UXP.
- Metadata skriptů a skutečné názvy souborů je potřeba při nasazení udržovat konzistentní.

## Vazba na diplomovou práci

Jde o nejkomplexnější projekt v přílohách. Spojuje uživatelské rozhraní, datovou konfiguraci a další automatizační skripty do jednoho pracovního toku pro přípravu designerských dat.
