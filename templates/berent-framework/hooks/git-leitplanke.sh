#!/usr/bin/env bash
# Git-Leitplanke: haelt die Regeln aus der globalen CLAUDE.md maschinell durch, statt sie nur zu
# beschreiben. Laeuft als PreToolUse-Hook vor jedem Bash-Aufruf und verweigert vier Dinge:
#
#   1. committen auf main            (main deployt automatisch ueber Coolify)
#   2. pushen nach main              (dasselbe, eine Stufe spaeter)
#   3. jeder Force-Push              (schreibt fremde Historie um)
#   4. git merge waehrend auf main   (Merge laeuft ausschliesslich ueber einen Pull Request)
#
# Belege: Direkt-Commit 587fe9d in berentai-nativ am 22.09.2026. Die Regel stand vorher an drei Stellen
# geschrieben und wurde trotzdem gebrochen — eine Regel, die niemand durchsetzt, ist eine Bitte.
#
# Ausgabe: JSON mit permissionDecision "deny" und einem Grund, den Claude liest. Exit-Code bleibt 0;
# das Verweigern steckt in der Antwort, nicht im Status.
#
# Bewusst NICHT blockiert: `gh pr merge` (der vorgesehene Weg), `git merge origin/main` auf einem
# Feature-Zweig (so wird ein Zweig nachgezogen), `git commit --dry-run`, alles ausserhalb von git —
# und Text, der ueber git redet, ohne git aufzurufen (Commit-Botschaften, Pull-Request-Rumpf,
# Dokumentation). Genau daran ist die erste Fassung am 22.09.2026 gescheitert: Sie las die ganze
# Befehlszeile, also auch den Rumpf eines Here-Dokuments, und hielt eine Tabellenzeile ueber
# Force-Push fuer einen Force-Push.
#
# Ueberstimmen, wenn es wirklich sein muss: den Befehl selbst im Terminal ausfuehren. Der Hook greift
# nur fuer Claude, nicht fuer den Menschen.

set -uo pipefail

eingabe=$(cat)
befehl=$(printf '%s' "$eingabe" | jq -r '.tool_input.command // ""' 2>/dev/null) || befehl=""
[ -z "$befehl" ] && exit 0
case "$befehl" in *git*) ;; *) exit 0 ;; esac

verweigere() {
  jq -nc --arg grund "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $grund
    }
  }'
  exit 0
}

# Alles ab dem ersten Here-Dokument ist Nutzlast, kein Befehl — abschneiden.
kopf=${befehl%%<<*}
# In einzelne Befehle zerlegen: Zeilenumbruch, Strichpunkt, Rohr, Kaufmanns-Und.
zerlegt=$(printf '%s' "$kopf" | tr '\n;|&' '\n\n\n\n')

zweig=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || zweig=""
auf_main=false
case "$zweig" in main|master) auf_main=true ;; esac

commit_auf_main=false
push_nach_main=false
force_push=false
merge_auf_main=false

# Je Abschnitt: ist das ein echter git-Aufruf? Nur dann werden seine Woerter geprueft.
while IFS= read -r abschnitt; do
  # shellcheck disable=SC2086
  set -- $abschnitt
  # Umgebungszuweisungen vor dem Befehl ueberspringen (FOO=bar git ...)
  while [ $# -gt 0 ]; do
    case "$1" in
      *=*) shift ;;
      *) break ;;
    esac
  done
  [ $# -eq 0 ] && continue
  [ "$1" = "git" ] || continue
  shift
  # Optionen vor dem Unterbefehl ueberspringen (git -C pfad push ...)
  unterbefehl=""
  while [ $# -gt 0 ]; do
    case "$1" in
      -C|-c|--git-dir|--work-tree) shift; [ $# -gt 0 ] && shift ;;
      -*) shift ;;
      *) unterbefehl="$1"; shift; break ;;
    esac
  done
  [ -z "$unterbefehl" ] && continue
  rest="$*"

  case "$unterbefehl" in
    commit)
      case " $rest " in
        *" --dry-run "*) ;;
        *) [ "$auf_main" = true ] && commit_auf_main=true ;;
      esac
      ;;
    merge)
      [ "$auf_main" = true ] && merge_auf_main=true
      ;;
    push)
      hat_refspec=false
      for wort in $rest; do
        case "$wort" in
          --force|-f|--force-with-lease|--force-with-lease=*|--force-if-includes) force_push=true ;;
          -*) ;;
          main|master) push_nach_main=true; hat_refspec=true ;;
          *:main|*:master) push_nach_main=true; hat_refspec=true ;;
          *:*) hat_refspec=true ;;
        esac
      done
      # Ein Push ohne ausdrueckliches Ziel schiebt den aktuellen Zweig — auf main also main.
      [ "$auf_main" = true ] && [ "$hat_refspec" = false ] && push_nach_main=true
      ;;
  esac
done <<ABSCHNITTE
$zerlegt
ABSCHNITTE

if [ "$force_push" = true ]; then
  verweigere "Force-Push ist in BERENT-Projekten nicht erlaubt (globale CLAUDE.md). Er schreibt Historie um, die andere schon geholt haben. Laeuft ein Zweig auseinander: rebasen und normal pushen, oder einen neuen Zweig eroeffnen. Soll es wirklich sein, fuehre den Befehl selbst im Terminal aus."
fi

if [ "$commit_auf_main" = true ]; then
  verweigere "Kein Commit direkt auf '$zweig' — main deployt automatisch ueber Coolify. Erst einen Zweig anlegen, dann committen, dann Pull Request:
  git checkout -b <art>/<kurzbeschreibung>
Das gilt auch fuer Doku-Nachtraege und LEARNINGS.md (Beleg: Commit 587fe9d am 22.09.2026)."
fi

if [ "$push_nach_main" = true ]; then
  verweigere "Kein Push nach main. Der Weg ist: Zweig pushen, Pull Request eroeffnen, Merge nach ausdruecklichem OK von Marcus (globale CLAUDE.md, Freigabe vom 14.09.2026).
  git push -u origin <zweig> && gh pr create"
fi

if [ "$merge_auf_main" = true ]; then
  verweigere "Kein lokaler Merge nach main. Merge findet ausschliesslich ueber GitHub statt (globale CLAUDE.md):
  gh pr create  ->  Marcus gibt OK  ->  gh pr merge --merge --delete-branch
Ein Feature-Zweig darf main jederzeit nachziehen (git merge origin/main), das blockiert dieser Hook nicht."
fi

exit 0
