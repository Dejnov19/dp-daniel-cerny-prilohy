# Illustrator reColor

## Účel

Složka obsahuje samostatný ExtendScript pro Adobe Illustrator, který převádí obsah vrstev do standardizovaného obrysového zobrazení podle názvu vrstvy. Cílem je připravit designerská data pro technologické nebo kontrolní zpracování bez ručního procházení vrstev.

## Technologie

- Jazyk: ExtendScript (`.jsx`)
- Prostředí: Adobe Illustrator
- Konfigurace: textový soubor `knihovna.txt`
- UI: jednoduché loading okno a závěrečný alert

## Obsah složky

| Soubor | Popis |
| --- | --- |
| `reColor_Script.jsx` | Hlavní skript pro přebarvení vrstev. |
| `knihovna.txt` | Mapování textových prefixů na RGB barvy. |
| `reColor_ukazka.png` | Ukázka výsledku. |

## Princip fungování

Skript načte knihovnu prefixů a RGB barev, projde vrstvy aktivního Illustrator dokumentu a u vrstev odpovídajících knihovně nastaví podporovaným objektům barevný tah. Výplň objektů se vypne. Pro průchod složitějšími skupinami používá zásobník místo hluboké rekurze.

## Formát knihovny

Každý řádek v souboru `knihovna.txt` má tvar:

```txt
prefix;255,0,0
```

Pokud záznam nemá explicitní barvu, skript umí použít interní fallback barvy.

## Typické použití

1. V Illustratoru je otevřen dokument s vrstvami pojmenovanými podle typu kamene nebo prvku.
2. V knihovně jsou nastavené odpovídající prefixy a RGB barvy.
3. Uživatel spustí `reColor_Script.jsx`.
4. Skript převede odpovídající vrstvy na barevné obrysové zobrazení.

## Omezení

- Cesta ke `knihovna.txt` je ve skriptu nastavena jako placeholder `xxx/knihovna.txt`.
- Skript přepíná dokument do RGB.
- Vrstvy s nekonzistentním pojmenováním zůstanou bez změny.
- Výstup je vizuální technologické odlišení, nikoli samostatný datový export.

## Vazba na diplomovou práci

Projekt využívá semantiku názvu vrstvy jako vstup pro automatizaci. Stejný princip se objevuje i v pluginu `Illustator_Plugin`.
