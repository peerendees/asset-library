# BERENT Framework (Kern-Trio)

Verbindliche KI-Anweisungsdateien für alle BERENT-Entwicklungsprojekte — werden zu Projektstart
in den Projekt-Root kopiert und in der CLAUDE.md referenziert.

| Datei | Schicht |
|---|---|
| `ENGINEERING-PRINCIPLES.md` | Wie gebaut wird, damit es unbeaufsichtigt läuft und nicht bricht (Governance, Robustheit, Beobachtbarkeit, Ökonomie, Auslieferung) |
| `infrastructure-playbook.md` | Wo es läuft: Hostinger/n8n, Vercel, Supabase, GitHub — Konventionen und Checklisten |
| `systems-register.md` | Was zusammenhängt: Systemlandschaft, Datenflüsse, das **Secret-Verzeichnis** (ein Label, alle Speicherorte) und die **Erkennungsmuster am Eingang** |
| `code-style-guide.md` | Wie Code geschrieben wird: gelebte Konventionen aus dem Bestand (TS/Next, .mjs, SQL, n8n) |

**Nutzung:** Siehe „BERENT-Framework — Anleitung" im Vault (04 Ressourcen). Kurzform: Dateien kopieren,
in CLAUDE.md referenzieren, Checklisten in §9 (Engineering) vor jedem Deploy durchlaufen,
systems-register.md bei jeder neuen Integration/jedem neuen Secret fortschreiben.

**Herkunft:** Struktur adaptiert vom Koerting-Institute-Framework (ENGINEERING-PRINCIPLES v1.3 u. a.),
Inhalte vollständig aus der BERENT-Praxis (Umbau-Session 11.–13.07.2026). Ausstehende Schichten
(Folgeliste): FOUNDATION/PROTOTYPE-PRINCIPLES (Erlebnis-Schicht) · issue-templates ·
design-principles ist durch den berent-ci-Skill abgedeckt.

**Änderungen**

| Version | Datum | Was |
|---|---|---|
| 1.0 | 2026-07-13 | Erstfassung (Kern-Trio + code-style-guide) |
| 1.1 | 2026-08-06 | `ENGINEERING-PRINCIPLES.md` v1.1: §5.3 um die **Eingangserkennung** erweitert (Secrets, die ankommen, wo sie nicht hingehören — zurückweisen, Label benennen, Rotation anstoßen, Ampel Rot), dazu §8-Briefing und §9-Checkliste. Neu im Schlussabsatz: **benannte Ausnahme für irreversible Schadensklassen** — dort genügt ein gekennzeichneter Fremdbeleg. `systems-register.md` v1.9: Abschnitt „Secret-Formen am Eingang". |

| 1.2 | 2026-08-06 | `infrastructure-playbook.md` v1.1: §2.2 um **„Erst holen, dann arbeiten"** erweitert (`git fetch` und Stand-Vergleich vor der ersten Änderung — sonst wird bei versionierten Dokumenten eine Versionsnummer zweimal vergeben) und um die `.gitignore`-Pflicht ab dem ersten Commit. Beide aus einem Vorfall am selben Tag. |

| 1.3 | 2026-08-06 | `ENGINEERING-PRINCIPLES.md` v1.2: §2.8 Praxis um **„Nach Herleitung fragen, nicht nach Zustimmung"** ergänzt. Keine Erweiterung des Geltungsbereichs — nur die Frage an die Zweitinstanz wird umgestellt, weil „bestätigst du?" Zustimmung erzeugt. Kein neues Prinzip, daher ohne Beleg. |

Version 1.3 · 2026-08-06
