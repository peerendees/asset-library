#!/usr/bin/env bash
# Prüffälle für git-leitplanke.sh (10.10.2026). Aufruf: bash git-leitplanke-test.sh
# Geprueft wird der Hook im selben Ordner wie diese Datei; ein anderer mit HOOK=<pfad> bash git-leitplanke-test.sh.
# Legt zwei Wegwerf-Repos an (eines auf main, eines auf einem Feature-Zweig) und schickt jeden Befehl
# als PreToolUse-Eingabe an den Hook. Erwartung: erlaubt (kein deny) oder verweigert (deny).
set -uo pipefail
HOOK="${HOOK:-$(cd "$(dirname "$0")" && pwd)/git-leitplanke.sh}"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git init -q -b main "$tmp/haupt" && git -C "$tmp/haupt" commit -q --allow-empty -m init
git init -q -b main "$tmp/zweig" && git -C "$tmp/zweig" commit -q --allow-empty -m init && git -C "$tmp/zweig" checkout -q -b feat/x
ok=0; fehler=0
pruefe() { # $1 Verzeichnis, $2 erwartet (erlaubt|verweigert), $3 Befehl
  local aus
  aus=$(cd "$1" && jq -nc --arg c "$3" '{tool_input:{command:$c}}' | bash "$HOOK")
  local ist=erlaubt
  case "$aus" in *'"deny"'*) ist=verweigert ;; esac
  if [ "$ist" = "$2" ]; then ok=$((ok+1)); else fehler=$((fehler+1)); echo "FALSCH ($ist statt $2): $3"; fi
}
# Wie in der Desktop-App: Hook-Prozess im Haupt-Klon, `.cwd` der Eingabe = Verzeichnis der Sitzungs-Shell.
pruefe_cwd() { # $1 PWD des Hooks, $2 .cwd, $3 erwartet, $4 Befehl
  local aus
  aus=$(cd "$1" && jq -nc --arg c "$4" --arg d "$2" '{cwd:$d,tool_input:{command:$c}}' | bash "$HOOK")
  local ist=erlaubt
  case "$aus" in *'"deny"'*) ist=verweigert ;; esac
  if [ "$ist" = "$3" ]; then ok=$((ok+1)); else fehler=$((fehler+1)); echo "FALSCH ($ist statt $3): cwd=${2#$tmp/} $4"; fi
}
# Prueft den Text der Ablehnung: $1 PWD des Hooks, $2 muss enthalten sein, $3 darf nicht enthalten sein, $4 Befehl.
pruefe_grund() {
  local aus
  aus=$(cd "$1" && jq -nc --arg c "$4" '{tool_input:{command:$c}}' | bash "$HOOK")
  case "$aus" in
    *"$2"*) case "$aus" in *"$3"*) ;; *) ok=$((ok+1)); return ;; esac ;;
  esac
  fehler=$((fehler+1)); echo "FALSCHE MELDUNG (erwartet '$2', nicht '$3'): $4"
}
H="$tmp/haupt"; Z="$tmp/zweig"
# App-Worktrees: WF auf Feature-Zweig unter dem Haupt-Klon (main); WM auf main unter einem Klon, der
# selbst auf einem Feature-Zweig steht.
WF="$H/.claude/worktrees/sitzung-f"; git -C "$H" worktree add -q -b claude/x "$WF"
git init -q -b main "$tmp/klon" && git -C "$tmp/klon" commit -q --allow-empty -m init && git -C "$tmp/klon" checkout -q -b feat/y
K="$tmp/klon"; WM="$K/.claude/worktrees/sitzung-m"; git -C "$K" worktree add -q "$WM" main
# --- auf main ---
pruefe "$H" erlaubt    'git push origin --delete fix/alt'
pruefe "$H" erlaubt    'git push -q origin --delete fix/alt'
pruefe "$H" erlaubt    'git push origin feat/neu'
pruefe "$H" erlaubt    'git merge --ff-only origin/main'
pruefe "$H" erlaubt    'git pull -q --ff-only'
pruefe "$H" erlaubt    'echo "git push origin main"'
pruefe "$H" verweigert 'git push'
pruefe "$H" verweigert 'git push origin main'
pruefe "$H" verweigert 'git push origin HEAD:main'
pruefe "$H" verweigert 'git push origin --delete main'
pruefe "$H" verweigert 'git push origin "$b"'
pruefe "$H" verweigert 'git commit -m x'
pruefe "$H" verweigert 'for b in a; do git commit -m x; done'
pruefe "$H" verweigert 'if true; then git push; fi'
pruefe "$H" verweigert 'for b in a b; do git push -q origin --delete "$b"; done'
pruefe "$H" verweigert 'git push -f origin feat/neu'
pruefe "$H" verweigert 'git merge feat/neu'
pruefe "$H" verweigert 'git push origin +main'
pruefe "$H" verweigert 'git push origin :main'
# --- auf einem Feature-Zweig ---
pruefe "$Z" erlaubt    'git push -u origin feat/x'
pruefe "$Z" erlaubt    'git push'
pruefe "$Z" erlaubt    'git commit -m x'
pruefe "$Z" erlaubt    'git merge origin/main'
pruefe "$Z" erlaubt    $'git commit -F - <<EOF\nText ueber git push origin main\nEOF'
pruefe "$Z" verweigert "cd $H && git commit -m x"
pruefe "$Z" verweigert 'git push --force-with-lease'
pruefe "$Z" verweigert "(cd $H && git commit -m x)"
# --- App-Worktree: `.cwd` statt PWD des Hooks (22.10.2026) ---
pruefe_cwd "$H" "$H"  verweigert 'git commit -m x'
pruefe_cwd "$H" "$WF" erlaubt    'git commit -m x'
pruefe_cwd "$H" "$WF" erlaubt    'git push -u origin claude/x'
pruefe_cwd "$K" "$WM" verweigert 'git commit -m x'
pruefe_cwd "$K" "$WM" verweigert 'git push'
pruefe_cwd "$H" "$WF" verweigert 'git push --force-with-lease'
pruefe_cwd "$H" "$H"  erlaubt    "cd $WF && git commit -m x"
pruefe_cwd "$H" "$H"  erlaubt    'cd .claude/worktrees/sitzung-f && git commit -m x'
pruefe_cwd "$H" "$WF" verweigert "cd $H && git commit -m x"
pruefe_cwd "$K" "$K"  verweigert "cd $WM && git commit -m x"
pruefe_cwd "$H" "$tmp/gibt-es-nicht" verweigert 'git commit -m x'
# --- Meldung nennt Zweig und Ort des abgewiesenen Commits, nicht des letzten git-Aufrufs (19.11.2026) ---
pruefe_grund "$H" "auf 'main' (in $H)" "claude/x" "git commit -m x; git -C $WF status"
pruefe_grund "$Z" "auf 'main' (in $H)" "feat/x"   "cd $H && git commit -m x; cd $Z && git status"
echo "Ergebnis: $ok richtig, $fehler falsch"
[ "$fehler" -eq 0 ]
