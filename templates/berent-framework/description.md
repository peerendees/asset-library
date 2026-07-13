# BERENT Framework (Kern-Trio)

Verbindliche KI-Anweisungsdateien für alle BERENT-Entwicklungsprojekte — werden zu Projektstart
in den Projekt-Root kopiert und in der CLAUDE.md referenziert.

| Datei | Schicht |
|---|---|
| `ENGINEERING-PRINCIPLES.md` | Wie gebaut wird, damit es unbeaufsichtigt läuft und nicht bricht (Governance, Robustheit, Beobachtbarkeit, Ökonomie, Auslieferung) |
| `infrastructure-playbook.md` | Wo es läuft: Hostinger/n8n, Vercel, Supabase, GitHub — Konventionen und Checklisten |
| `systems-register.md` | Was zusammenhängt: Systemlandschaft, Datenflüsse und das **Secret-Verzeichnis** (ein Label, alle Speicherorte) |
| `code-style-guide.md` | Wie Code geschrieben wird: gelebte Konventionen aus dem Bestand (TS/Next, .mjs, SQL, n8n) |

**Nutzung:** Siehe „BERENT-Framework — Anleitung" im Vault (04 Ressourcen). Kurzform: Dateien kopieren,
in CLAUDE.md referenzieren, Checklisten in §9 (Engineering) vor jedem Deploy durchlaufen,
systems-register.md bei jeder neuen Integration/jedem neuen Secret fortschreiben.

**Herkunft:** Struktur adaptiert vom Koerting-Institute-Framework (ENGINEERING-PRINCIPLES v1.3 u. a.),
Inhalte vollständig aus der BERENT-Praxis (Umbau-Session 11.–13.07.2026). Ausstehende Schichten
(Folgeliste): FOUNDATION/PROTOTYPE-PRINCIPLES (Erlebnis-Schicht) · issue-templates ·
design-principles ist durch den berent-ci-Skill abgedeckt.

Version 1.0 · 2026-07-13
