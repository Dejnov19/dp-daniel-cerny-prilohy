# Illustrator Kusovník

## Účel

Složka obsahuje samostatný ExtendScript pro Adobe Illustrator, který z otevřeného dokumentu generuje kusovník. Skript odvozuje položky z názvů vrstev a objektů v dokumentu, ne z ručně vyplňované tabulky.

## Technologie

- Jazyk: ExtendScript (`.jsx`)
- Prostředí: Adobe Illustrator
- Datový vstup: `library.json`
- Datový výstup: nová vrstva `Table` v aktuálním dokumentu

## Obsah složky

| Soubor | Popis |
| --- | --- |
| `kusovnik_v01.jsx` | Hlavní skript pro generování kusovníku. |
| `library.json` | Knihovna kulatých a tvarových kamenů. |
| `kusovnik_ukazka.png` | Ukázka vygenerované tabulky. |

## Princip fungování

Skript načte knihovnu kamenů, projde vrstvy otevřeného Illustrator dokumentu a podle názvu vrstvy se pokusí rozpoznat typ a velikost kamene. Pro nalezené položky vytvoří novou vrstvu `Table`, do které kreslí řádky kusovníku, textový popis a vizuální referenci kamene.

## Typické použití

1. V Illustratoru je otevřen dokument s konzistentně pojmenovanými vrstvami.
2. Ve stejné složce jako skript je dostupný soubor `library.json`.
3. Uživatel spustí `kusovnik_v01.jsx`.
4. Skript vytvoří kusovník přímo v dokumentu jako novou vrstvu.

## Omezení

- Počet kusů je odvozen z počtu položek ve vrstvě, ne z hluboké analýzy všech vnořených struktur.
- Skript pracuje jen s odemčenými vrstvami.
- Barva se do řádku zapisuje obecně, skutečný odstín se z dokumentu nečte.
- Formátování tabulky je zapsané přímo ve zdrojovém kódu.

## Vazba na diplomovou práci

Projekt ukazuje převod designerských dat do strukturovaného evidenčního výstupu. Stejná logika je dále využitelná jako navazující skript v pluginovém workflow.
