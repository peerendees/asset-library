# Website-Motor — Leitplanken für KI-native Websites (BERENT)

> Verbindlich für jede Website, die BERENT baut oder betreibt — die eigene und die von Kunden.
> Stand: 2026-09-21 · v1.0 · Schwester-Dokumente: `ENGINEERING-PRINCIPLES.md` (Wirkung) ·
> `infrastructure-playbook.md` §5a (wo es läuft) · `systems-register.md` (was zusammenhängt) · berent-ci-Skill (Aussehen).
> Bauanleitung mit allen Stufen: Vault, `04 Ressourcen/Website-Motor/` (bis zur Ablage: `01 Inbox/ki-native-website-motor.md`).
> Referenzumsetzung: `peerendees/berentai-nativ` (Beleg: Bau am 21.09.2026, Nachbau von www.berent.ai).

## 0 · Der Prüfstein

Eine Website ist KI-nativ, wenn die KI das Einzige liefert, was das System frisst — strukturierte Daten gegen
einen Vertrag — und alles danach deterministisch passiert. Zwei Fragen entscheiden:

- *Nimm die KI weg.* Läuft es nur langsamer, ist es KI-first (ein schneller Texter vor einer alten Werkbank).
  Steht es still, ist es KI-nativ.
- *Nimm den Menschen weg.* Es läuft weiter — aber niemand entscheidet mehr. Deshalb sind Veröffentlichen,
  Löschen und Preise Tore für einen Menschen (Engineering §1.1).

## 1 · Die sieben Leitplanken

1. **Form im Code, Inhalt als Daten.** Die KI schreibt nie HTML. Sie füllt Felder eines Schemas; ein Baustein
   ist Schema + Vorgaben + reine `render()`-Funktion + CSS. Gestaltung ist Code, nicht Verhandlungssache — nur
   deshalb darf ein Ergebnis ohne Layout-Kontrolle öffentlich werden. Wer die KI Markup erzeugen lässt, baut
   KI-first.
2. **Fakten nie aus dem Modell.** Preise, Adressen, Termine, Links, Impressum stehen in einer Datei
   (`config/facts.json`), im Betrieb änderbar über das Cockpit; ein Tor stempelt sie beim Rendern ein. Fehlt ein
   Wert, erscheint sichtbar `[…]` — nie eine Erfindung (Engineering §2.7).
3. **Eine Quelle, viele Ansichten.** Übersichten speichern keine Listen, sie lesen den Bestand bei jedem Aufruf.
   Zahlen in Texten werden gerechnet, nie getippt.
4. **Goldreferenz vor Generator.** Für jeden Seitentyp erst eine Seite von Hand perfekt machen (mit echtem
   Inhalt), dann den Generator bauen, dann das Ergebnis gegen die Referenz abnehmen.
5. **Die Statuskette ist heilig.** `draft → generated → edited → approved → published → archived`. Was ein
   Mensch geändert hat, überschreibt keine Neugenerierung ohne ausdrückliches Force. Der Generator schreibt
   nie `published`.
6. **Nichts Nebensächliches blockiert.** SEO, Bilder, Vorschauen, Benachrichtigungen sind austauschbare
   Schichten. Anfragen werden ZUERST gespeichert, DANN gemeldet; eine scheiternde Mail verliert nichts
   (Engineering §2.2, §2.6).
7. **Fertig heißt sichtbar.** Publizierte Seiten liegen unter festen Adressen; kein Build, kein Deploy
   zwischen „freigegeben" und „öffentlich". Der Render-Cache hält höchstens eine Minute.

## 2 · Was BERENT darüber hinaus festlegt

- **Löschen gibt es nicht.** Seiten werden archiviert — bei veröffentlichten mit Pflicht-Umleitung —, Medien
  wandern in einen Papierkorb (Engineering §1.1).
- **Umbenennen hinterlässt eine Spur.** Ein Slug-Wechsel einer öffentlichen Seite erzeugt die 301 von allein,
  nicht als Angebot.
- **Navigation ist Daten**, kein Code. Ein Menü, das nur ein Entwickler ändern kann, ist KI-first mit Umweg.
- **Fail-closed.** Ohne Kennwort und Sitzungs-Geheimnis ist das Cockpit zu; Secrets nur in der Umgebung,
  Labels im `systems-register.md` (Engineering §1.3, §5.3).
- **Eine Handlung je Seite.** Genau ein gefüllter Knopf, alles andere Textlinks. Die Handlung landet in einer
  Tabelle, die ein Mensch im Cockpit sieht.
- **Schriften lokal, kein Google-CDN** (berent-ci). **Kein Service-Worker** — beim Nachbau einer Website mit
  Service-Worker liegt unter derselben Adresse ein Aufräumer, der Altinstallationen abmeldet (Beleg: berent.ai,
  Cache-first-Worker mit toter Cache-Liste, 2026).
- **Das Handbuch schreibt sich mit.** Jeder manuelle Ablauf steht im Cockpit lesbar mit den echten Knopfnamen;
  ändert ein Commit einen Knopf, zieht er das Handbuch nach. Fallstricke kommen aus Vorfällen, nicht aus
  Vermutungen (`LEARNINGS.md`).
- **Nachbau vor Neubau.** Existiert eine Website, wird sie nachgebaut: Seiten zählen, die eine Handlung finden,
  Gestaltung aus dem echten CSS lesen, Fakten trennen, Umleitungstabelle alt → neu — und die Gelegenheit nutzen,
  loszuwerden, was nie gefiel. Bei fremden Vorlagen: Aufbau als Vorbild, Inhalte neu (Playbook §10).
- **Hosting:** Coolify auf dem BERENT-VPS, Bauart Dockerfile, Laufzeitdaten auf einem benannten Volume,
  Labels von Hand (Playbook §5a). Zuerst SQLite; Postgres ist ein Umgebungs-Eintrag, kein Umbau.
- **Prüfen am laufenden System**, nie am Quelltext: jede alte Adresse, Umleitungen, Header, sichtbare `[…]`
  (`scripts/pruefen.mjs` in der Referenzumsetzung).
- **Suche und Assistent zuletzt.** Sie bestimmen die Datenbankwahl nicht; bei ein paar hundert Absätzen reicht
  Volltext (Engineering §4.1).

## 3 · Abnahme — die Website ist fertig, wenn alles davon stimmt

- [ ] Jede Seite antwortet mit 200, mit und ohne Schrägstrich; alte Adressen leiten per 301, keine ins Leere
- [ ] Auf dem Telefon lesbar, kein waagerechtes Scrollen
- [ ] Kein `[…]` auf einer öffentlichen Seite; Impressum und Datenschutz vorhanden und verlinkt
- [ ] Entwürfe tragen `noindex`, die Sitemap führt nur Veröffentlichtes
- [ ] Ein Mensch kann ohne Entwickler eine Seite anlegen, ins Menü hängen, bebildern, veröffentlichen,
      umbenennen und archivieren — und eine Anfrage empfangen und einen Preis ändern
- [ ] Navigation in der Datenbank; Slug-Wechsel erzeugt die 301 von allein
- [ ] Bilder an einem dauerhaften Ort mit Alt-Text; das Handbuch nennt die echten Knopfnamen
- [ ] Die eine Handlung ist auf jeder Seite erreichbar und landet auch irgendwo
- [ ] `node --test` läuft grün ohne Datenbank-Server und ohne Schlüssel; frischer Klon startet mit `npm i && npm start`
- [ ] Ein neuer Seitentyp kostet einen Ordner, keine Änderung am Motor
- [ ] `docs/entscheidungen.md` beschreibt noch, was tatsächlich gebaut wurde

---

*Lebendes Dokument. Mechanismus aus der Bauanleitung „Der Website-Motor" (Vault), Wortlaut eigen (Playbook §10).
Belege: Bau von berentai-nativ am 21.09.2026 und die Vorfälle der Vorlage berent.ai (Service-Worker,
Formulare ohne Backend, Hoster im Repo falsch benannt).*
