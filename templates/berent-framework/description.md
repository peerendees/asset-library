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

| 1.4 | 2026-08-06 | `infrastructure-playbook.md` v1.2: Die Vorflug-Prüfung in §2.2 fragt jetzt **zwei** Dinge — welcher Branch (`git branch --show-current`) und welcher Stand (`git fetch` + Divergenz). Dazu der Rückweg, wenn schon auf dem falschen Branch committet wurde. Zweiter Beleg am selben Tag. `systems-register.md` v1.10: `N8N_API_KEY` — zweiter Speicherort, Quelle, Selbstbeschränkung und PUT-Schema-Falle aus dem Beirat-Spiegel zurückgeholt. |

| 1.5 | 2026-08-08 | `infrastructure-playbook.md` v1.3: neuer §10 **„Fremdgut — Übernahme aus fremden Quellen"**. Kernunterscheidung: geschützt ist die Ausformulierung, nicht das Verfahren. Vier Regeln — Mechanismus übernehmen und neu formulieren, Herkunft an der Übernahmestelle, Lizenz mitnehmen sobald wirklich kopiert wird, fremde Volltexte bleiben intern. Verschriftlicht eine seit 07/2026 gelebte Praxis. |

| 1.6 | 2026-08-08 | `ENGINEERING-PRINCIPLES.md` v1.3: neuer §5.4 **„Abhängigkeiten reifen lassen"** — Mindestalter sieben Tage vor Übernahme neuer Paketversionen, mit Pflicht zur Verdrahtungsprüfung (`npm ≥ 11.10`, sonst greift die Einstellung stillschweigend nicht). Begründung über die Schadensform: das Update ist rückrollbar, ein bösartiges `postinstall` mit Credential-Abfluss nicht — daher benannte Ausnahme. Dazu §8-Briefing und §9-Checkliste. |

Version 1.6 · 2026-08-08
