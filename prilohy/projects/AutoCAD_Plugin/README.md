# AutoCAD Plugin

## Účel

Složka obsahuje AutoCAD .NET plugin napsaný v C#, který automatizuje technickou přípravu dat po převodu grafiky do CAD prostředí. Plugin řeší normalizaci geometrie, tvorbu výplní, parcelaci motivu, řazení objektů pro laserové workflow a export kružnic do výrobního textového formátu.

## Dostupnost zdrojového kódu

Zdrojový kód pluginu není v této příloze poskytnut z důvodu ochrany firemního tajemství. Plugin je ve firmě aktivně používán a počítá se s jeho dalším rozšiřováním. V příloze je proto uveden pouze popis funkcí, použitých technologií a ukázkové podpůrné soubory.

## Technologie

- Jazyk: C#
- Typ výstupu: `.dll` knihovna pro načtení přes `NETLOAD`
- Framework: .NET Framework 4.8
- IDE / build system: Visual Studio, klasický `.csproj`
- Cílové prostředí: AutoCAD 2024
- Hlavní reference: `acmgd.dll`, `acdbmgd.dll`, `accoremgd.dll`, `acdbmgdbrep.dll`

## Funkční oblasti

| Oblast | Popis |
| --- | --- |
| Tvorba výplní | Tvorba plných hatch výplní nad vybranou geometrií. |
| Export dat | Export kružnic do `.asc` souboru pro navazující výrobní zpracování. |
| Normalizace geometrie | Převod `ELLIPSE` a `SPLINE` entit na kružnice. |
| Parcelace motivu | Rozdělení motivu do obdélníkových segmentů. |
| Řazení objektů | Řazení objektů podle polohy a volitelné číslování. |
| Technologická výplň | Výplň uzavřených oblastí soustavou úseček. |
| Uživatelská nastavení | Dialogy pro nastavení parametrů příkazů. |

## Dostupné příkazy

| Příkaz | Popis |
| --- | --- |
| `VYPLNOBJ` | Vytvoří plné hatch výplně nad vybranými křivkami a přesune je za ostatní objekty. |
| `Strass` | Exportuje kružnice jako výrobní záznamy s polohou, velikostí a barvou. |
| `EL2CIR` | Převede elipsy na kružnice se zadaným průměrem. |
| `SPL2CIR` | Převede spline křivky na kružnice se zadaným průměrem. |
| `RASTR_OPT` | Rozdělí vybraný motiv na obdélníkové parcely podle zadaných limitů. |
| `LBSORTNET` | Seřadí vybrané objekty po řádcích pro navazující laserové workflow. |
| `SPLDASH` | Vytvoří technologickou výplň z krátkých úseček. |

## Typické použití

1. Projekt se zkompiluje ve Visual Studiu na počítači s instalovaným AutoCADem.
2. V AutoCADu se výsledná `.dll` načte příkazem `NETLOAD`.
3. Uživatel spouští jednotlivé příkazy podle fáze zpracování dat.
4. Výsledkem jsou vyčištěná, seřazená nebo exportovaná data pro další výrobní workflow.

## Omezení

- Zdrojový kód není součástí veřejné přílohy z důvodu ochrany firemního tajemství.
- Projekt je vázaný na lokální instalaci AutoCADu 2024.
- Část velikostí a barev je zapsána přímo v interní implementaci pluginu.
- Některé operace pracují s bounding boxy, ne s plnou topologickou analýzou motivu.
- Příkaz `LBSORTNET` mění pořadí objektů klonováním a mazáním původních entit.

## Vazba na diplomovou práci

Plugin navazuje na prototypy ve složce `AutoCAD_LispScripts` a převádí je do robustnější podoby nad AutoCAD .NET API. Na rozdíl od ostatních přiložených projektů nejde pouze o historický nebo nahrazený prototyp; tento nástroj se ve firmě používá a je určený k dalšímu rozvoji.
