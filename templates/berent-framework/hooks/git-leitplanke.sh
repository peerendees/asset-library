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
# Feature-Zweig (so wird ein Zweig nachgezogen), das Vorspulen von main auf `origin/main` oder mit
# `--ff-only` (nach einem Merge auf GitHub holt man den Stand nach, ohne Historie zu erzeugen),
# `git commit --dry-run`, alles ausserhalb von git —
# und Text, der ueber git redet, ohne git aufzurufen (Commit-Botschaften, Pull-Request-Rumpf,
# Dokumentation). Genau daran ist die erste Fassung am 22.09.2026 gescheitert: Sie las die ganze
# Befehlszeile, also auch den Rumpf eines Here-Dokuments, und hielt eine Tabellenzeile ueber
# Force-Push fuer einen Force-Push. Und am selben Tag ein zweites Mal: Sie verweigerte
# `git merge --ff-only origin/main` auf main — also genau das Nachholen eines Stands, den GitHub
# schon gemergt hatte. Ein Waechter, der die richtige Bewegung blockiert, wird umgangen.
#
# Worktree-Fehler (30.09.2026, ADR-002-Commit in berent-ki-team-orga): Die Branch-Erkennung lief als
# EIN bloßes `git rev-parse --abbrev-ref HEAD` im eigenen Arbeitsverzeichnis des Hook-Prozesses —
# unabhaengig davon, dass der zu pruefende Befehl selbst zuerst in eine Worktree wechselte (`cd
# .../berent-ki-team-orga-wt/<thema> && git commit ...`). Der Hook sah dadurch immer den Branch des
# Haupt-Klons (`main`) und blockte einen Commit, der tatsaechlich auf einem sauberen Feature-Branch
# in einer eigenen Worktree lief. Jetzt: der Befehlstext wird auf `cd <pfad>` und `git -C <pfad>`
# abgesucht, und die Branch-Pruefung lauft testweise in diesem Verzeichnis statt im ererbten PWD.
# Kann der Pfad nicht aufgeloest werden (existiert nicht, Tippfehler), faellt es auf das alte
# Verhalten zurueck (PWD des Hooks) — lieber ein bekannter blinder Fleck als ein neuer falscher.
#
# Zwei Fehler (10.10.2026, fedor-seo): (a) Fehlalarm — `git push origin --delete <zweig>` und
# `git push origin <zweig>` auf main galten als Push nach main, weil ein schlichter Zweigname nicht als Ziel
# zaehlte. (b) Blinder Fleck — stand ein Schluesselwort vor git (`do git commit`, `then git push`), sah der
# Hook den Aufruf gar nicht; eine `for`-Schleife konnte auf main committen. Jetzt: Schluesselwoerter am
# Abschnittsanfang werden uebersprungen; bei push gilt das erste freie Wort als Remote, alle weiteren als
# Ziele — gesperrt wird nur ein Ziel main/master (auch `x:main`, `--delete main`). Ziele aus Variablen
# (`"$b"`) sind nicht pruefbar und werden verweigert. Pruefaelle: git-leitplanke-test.sh neben diesem Hook.
#
# App-Worktree-Fehler (22.10.2026, Nachtlauf belegchat): Die Desktop-App legt fuer eine Sitzung eine
# Worktree unter `<repo>/.claude/worktrees/<name>` an. Die Shell der Sitzung arbeitet dort, der
# Hook-Prozess aber startet im Haupt-Klon. Ein schlichtes `git commit` ohne `cd` wurde deshalb gegen
# den Branch des Haupt-Klons (`main`) geprueft und abgewiesen, obwohl die Worktree auf
# `claude/ber-204-app-rahmen` stand — und umgekehrt waere ein Commit in einer Worktree auf main
# durchgegangen, solange der Haupt-Klon auf einem Feature-Zweig steht. Jetzt (19.11.2026): der Hook
# wechselt zuerst in `.cwd` aus seiner Eingabe, also dorthin, wo der Befehl tatsaechlich laeuft.
# Fehlt `.cwd` oder ist es kein Verzeichnis, bleibt es beim PWD des Hooks (altes Verhalten).
#
# Ueberstimmen, wenn es wirklich sein muss: den Befehl selbst im Terminal ausfuehren. Der Hook greift
# nur fuer Claude, nicht fuer den Menschen.

set -uo pipefail

eingabe=$(cat)
befehl=$(printf '%s' "$eingabe" | jq -r '.tool_input.command // ""' 2>/dev/null) || befehl=""
[ -z "$befehl" ] && exit 0
case "$befehl" in *git*) ;; *) exit 0 ;; esac

# Arbeitsverzeichnis der Sitzungs-Shell, nicht das des Hook-Prozesses (App-Worktree-Fehler, s. o.).
sitzung=$(printf '%s' "$eingabe" | jq -r '.cwd // ""' 2>/dev/null) || sitzung=""
[ -n "$sitzung" ] && [ -d "$sitzung" ] && cd "$sitzung" 2>/dev/null

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

# Loest einen (evtl. relativen) Pfad zu einem existierenden Verzeichnis auf, oder gibt nichts aus,
# wenn das nicht geht. Wechselt NICHT das eigene Arbeitsverzeichnis des Hooks (Subshell).
pfad_aufloesen() {
  ziel="$1"
  basis="$2"
  case "$ziel" in
    /*) abs="$ziel" ;;
    "~") abs="$HOME" ;;
    "~/"*) abs="$HOME/${ziel#\~/}" ;;
    *) abs="${basis:-$PWD}/$ziel" ;;
  esac
  ( cd "$abs" 2>/dev/null && pwd )
}

# Branch eines Verzeichnisses (leer = eigenes PWD des Hooks, alter Weg).
branch_von() {
  dir="$1"
  if [ -n "$dir" ]; then
    git -C "$dir" rev-parse --abbrev-ref HEAD 2>/dev/null
  else
    git rev-parse --abbrev-ref HEAD 2>/dev/null
  fi
}

ist_main() {
  case "$1" in main|master) return 0 ;; *) return 1 ;; esac
}

# Alles ab dem ersten Here-Dokument ist Nutzlast, kein Befehl — abschneiden.
kopf=${befehl%%<<*}
# In einzelne Befehle zerlegen: Zeilenumbruch, Strichpunkt, Rohr, Kaufmanns-Und.
zerlegt=$(printf '%s' "$kopf" | tr '\n;|&' '\n\n\n\n')

commit_auf_main=false
# Zweig und Verzeichnis des abgewiesenen Commits — `zweig` selbst gehoert nach der Schleife dem LETZTEN
# git-Aufruf (Nachtlauf 22.10.2026: Meldung nannte 'claude/ber-204-app-rahmen' statt 'main').
commit_zweig=""
commit_ort=""
push_nach_main=false
force_push=false
merge_auf_main=false
ziel_unpruefbar=false

# Verzeichnis, in dem laut Befehlstext gerade gearbeitet wird — wandert mit jedem erkannten `cd`.
# Leer heisst: kein cd gesehen, PWD des Hooks gilt (unveraendertes Verhalten).
verzeichnis=""

# Je Abschnitt: erst auf `cd` pruefen (Verzeichnis mitfuehren), dann auf echten git-Aufruf.
while IFS= read -r abschnitt; do
  # shellcheck disable=SC2086
  set -- $abschnitt
  # Umgebungszuweisungen und Schluesselwoerter vor dem Befehl ueberspringen (FOO=bar git ...,
  # `do git ...`, `then git ...`) — sonst sieht der Hook den git-Aufruf in Schleifen und Bedingungen nicht.
  while [ $# -gt 0 ]; do
    case "$1" in
      do|then|else|elif|if|while|until|'!'|'{'|'('|time) shift ;;
      '('*) erstes="${1#(}"; shift; set -- "$erstes" "$@" ;;
      *=*) shift ;;
      *) break ;;
    esac
  done
  [ $# -eq 0 ] && continue

  if [ "$1" = "cd" ]; then
    shift
    # `cd -` (voriges Verzeichnis) und `cd` ohne Ziel (HOME) sind hier nicht sinnvoll aufloesbar —
    # dann bleibt `verzeichnis` unveraendert, alter Blindstellen-Fallback greift.
    if [ $# -gt 0 ] && [ "$1" != "-" ]; then
      neu=$(pfad_aufloesen "$1" "$verzeichnis")
      [ -n "$neu" ] && verzeichnis="$neu"
    fi
    continue
  fi

  [ "$1" = "git" ] || continue
  shift
  # Optionen vor dem Unterbefehl ueberspringen (git -C pfad push ...); `-C` zusaetzlich merken,
  # weil es die Branch-Pruefung fuer GENAU diesen Aufruf uebersteuert (echtes git-Verhalten).
  git_c=""
  unterbefehl=""
  while [ $# -gt 0 ]; do
    case "$1" in
      -C) shift; [ $# -gt 0 ] && { git_c="$1"; shift; } ;;
      -c|--git-dir|--work-tree) shift; [ $# -gt 0 ] && shift ;;
      -*) shift ;;
      *) unterbefehl="$1"; shift; break ;;
    esac
  done
  [ -z "$unterbefehl" ] && continue
  rest="$*"

  # Wirksames Verzeichnis fuer DIESEN Aufruf: explizites `-C` schlaegt ein vorheriges `cd`.
  wirksam="$verzeichnis"
  if [ -n "$git_c" ]; then
    aufgeloest=$(pfad_aufloesen "$git_c" "$verzeichnis")
    wirksam="${aufgeloest:-$git_c}"
  fi
  zweig=$(branch_von "$wirksam") || zweig=""
  auf_main=false
  ist_main "$zweig" && auf_main=true

  case "$unterbefehl" in
    commit)
      case " $rest " in
        *" --dry-run "*) ;;
        *)
          if [ "$auf_main" = true ] && [ "$commit_auf_main" = false ]; then
            commit_auf_main=true
            commit_zweig="$zweig"
            commit_ort="${wirksam:-$PWD}"
          fi
          ;;
      esac
      ;;
    merge)
      # Auf main ist nur das Vorspulen erlaubt: nach einem Merge auf GitHub holt man den Stand nach,
      # ohne eigene Historie zu erzeugen. Alles andere waere ein lokaler Merge.
      if [ "$auf_main" = true ]; then
        nur_vorspulen=false
        for wort in $rest; do
          case "$wort" in
            --ff-only) nur_vorspulen=true ;;
            origin/main|origin/master|"@{u}"|"@{upstream}") nur_vorspulen=true ;;
          esac
        done
        [ "$nur_vorspulen" = false ] && merge_auf_main=true
      fi
      ;;
    push)
      # Erstes freies Wort = Remote, alle weiteren = Ziele (Zweig, x:y, --delete <zweig>).
      remote=""
      ziele=""
      ueberspringen=false
      for wort in $rest; do
        if [ "$ueberspringen" = true ]; then ueberspringen=false; continue; fi
        case "$wort" in
          --force|-f|--force-with-lease|--force-with-lease=*|--force-if-includes) force_push=true ;;
          -o|--push-option|--repo|--receive-pack|--exec) ueberspringen=true ;;
          -*) ;;
          *)
            if [ -z "$remote" ]; then remote="$wort"; else ziele="$ziele $wort"; fi
            ;;
        esac
      done
      case "$remote" in *'$'*|*'`'*) ziel_unpruefbar=true ;; esac
      for ziel in $ziele; do
        case "$ziel" in
          *'$'*|*'`'*) ziel_unpruefbar=true ;;
          +*) force_push=true ;;
        esac
        case "${ziel#+}" in
          main|master|*:main|*:master|refs/heads/main|refs/heads/master|*:refs/heads/main|*:refs/heads/master)
            push_nach_main=true ;;
        esac
      done
      # Ein Push ohne ausdrueckliches Ziel schiebt den aktuellen Zweig — auf main also main.
      [ -z "$ziele" ] && [ "$auf_main" = true ] && push_nach_main=true
      ;;
  esac
done <<ABSCHNITTE
$zerlegt
ABSCHNITTE

if [ "$force_push" = true ]; then
  verweigere "Force-Push ist in BERENT-Projekten nicht erlaubt (globale CLAUDE.md). Er schreibt Historie um, die andere schon geholt haben. Laeuft ein Zweig auseinander: rebasen und normal pushen, oder einen neuen Zweig eroeffnen. Soll es wirklich sein, fuehre den Befehl selbst im Terminal aus."
fi

if [ "$commit_auf_main" = true ]; then
  verweigere "Kein Commit direkt auf '$commit_zweig' (in $commit_ort) — main deployt automatisch ueber Coolify. Erst einen Zweig anlegen, dann committen, dann Pull Request:
  git checkout -b <art>/<kurzbeschreibung>
Das gilt auch fuer Doku-Nachtraege und LEARNINGS.md (Beleg: Commit 587fe9d am 22.09.2026)."
fi

if [ "$ziel_unpruefbar" = true ]; then
  verweigere "Push-Ziel nicht pruefbar: Es steht in einer Variablen (z. B. \"\$b\") — ob es main ist, sieht der Hook nicht. Den Zweig ausdruecklich nennen, je Zweig ein Aufruf:
  git push origin --delete <zweig>"
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
