# Corel reColor

## Účel

Složka obsahuje VBA makra pro CorelDRAW, která převádějí informaci nesenou obrysem objektu do výplně a obrys poté vypínají. Makra slouží k rychlému čištění dokumentu po převodech mezi aplikacemi.

## Technologie

- Jazyk: VBA
- Prostředí: CorelDRAW
- Rozhraní: objektový model `Document`, `Page`, `Shape`, `Color`
- Spuštění: import `.bas` modulu a spuštění makra v CorelDRAW

## Obsah složky

| Soubor | Popis |
| --- | --- |
| `reColor.bas` | První varianta makra založená na seznamu barev, které se mají převést z obrysu do výplně. |
| `reColor_v02.bas` | Vylepšená varianta založená na seznamu výjimek, které se nemají měnit. |

## Princip fungování

Makra procházejí objekty na aktivní stránce, čte se RGB barva obrysu a podle interního seznamu barev se rozhodne, zda se barva přenese do výplně. Po přenesení barvy se obrys objektu vypne.

## Typické použití

1. Do CorelDRAW se importuje vybraný `.bas` modul.
2. Uživatel otevře dokument po převodu nebo úpravě.
3. Spustí makro nad aktivní stránkou.
4. Výsledkem jsou objekty s výplní místo obrysu.

## Omezení

- Makra pracují pouze s objekty na aktivní stránce.
- Neprocházejí automaticky všechny stránky dokumentu.
- Nezpracovávají rekurzivně složité skupiny.
- Barvy jsou zapsané přímo ve VBA kódu.

## Vazba na diplomovou práci

Projekt doplňuje Illustrator skripty o obdobnou automatizaci pro CorelDRAW a ukazuje přenos stejného principu do jiného grafického prostředí.
