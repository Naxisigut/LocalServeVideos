#!/usr/bin/env bash
# Report LocalServeTauri UI changes since the last sync, mapped to src/ui targets.
#   status.sh          print report (read-only)
#   status.sh --mark   record current Tauri HEAD as the new sync baseline
set -euo pipefail

SKILL_DIR=$(cd "$(dirname "$0")/.." && pwd)
VIDEO_DIR=$(cd "$SKILL_DIR/../../.." && pwd)
TAURI_DIR=${LOCALSERVE_TAURI_DIR:-$VIDEO_DIR/../LocalServeTauri}
STATE="$SKILL_DIR/last-sync"

[ -d "$TAURI_DIR/.git" ] || { echo "LocalServeTauri not found at $TAURI_DIR (set LOCALSERVE_TAURI_DIR)" >&2; exit 1; }
tgit() { git -C "$TAURI_DIR" "$@"; }

HEAD=$(tgit rev-parse HEAD)

if [ "${1:-}" = "--mark" ]; then
  if [ -n "$(tgit status --porcelain -- src)" ]; then
    echo "warning: LocalServeTauri has uncommitted src changes; baseline only covers committed work" >&2
  fi
  echo "$HEAD" > "$STATE"
  echo "baseline -> $(tgit log -1 --format='%h %cd %s' --date=short "$HEAD")"
  exit 0
fi

BASE=$(tr -d '[:space:]' < "$STATE" 2>/dev/null || true)
[ -n "$BASE" ] || { echo "no baseline in $STATE" >&2; exit 1; }

target_of() {
  case "$1" in
    src/styles/global.css) echo "src/ui/styles/global.css [verbatim] (+ check video.css themes / data-hover / motion.ts)" ;;
    src/icons.tsx) echo "src/ui/icons.tsx [verbatim]" ;;
    src/i18n.ts) echo "src/ui/i18n.ts [verbatim + 2 adaptations]" ;;
    src/contracts.ts) echo "src/ui/types.ts (only fields the UI renders)" ;;
    src/App.tsx) echo "src/ui/AppWindow.tsx" ;;
    src/components/SiteCard.tsx) echo "src/ui/SiteCard.tsx" ;;
    src/components/SiteDetail.tsx) echo "src/ui/SiteDetail.tsx" ;;
    src/components/SiteDrawer.tsx) echo "src/ui/SiteDrawer.tsx" ;;
    src/components/SiteStatusBadge.tsx) echo "src/ui/SiteStatusBadge.tsx" ;;
    src/components/FileSharePanel.tsx) echo "src/ui/FileSharePanel.tsx" ;;
    src/components/FileShareRetryButton.tsx) echo "src/ui/FileShareRetryButton.tsx" ;;
    src/components/QrPopup.tsx) echo "src/ui/QrPopup.tsx" ;;
    src/qr-to-canvas.ts) echo "src/ui/QrCode.tsx" ;;
    src/components/Settings.tsx | src/components/LanguageSelect.tsx | src/components/ThemeSelect.tsx) echo "src/ui/Settings.tsx" ;;
    src/components/LicenseGate.tsx | src/components/PricingChip.tsx | src/license-messages.ts) echo "src/ui/License.tsx" ;;
    src/components/Toggle.tsx | src/components/Tooltip.tsx | src/components/DropdownMenu.tsx | src/components/MenuItem.tsx | src/components/ConfirmDialog.tsx) echo "src/ui/primitives.tsx" ;;
    src/use-presence-list.ts | src/use-flip-layout.ts | src/use-modal-motion.ts) echo "src/ui/motion.ts (durations/easing) + callers' progress props" ;;
    src/path-display.ts) echo "src/ui/context.tsx (compactHomePath)" ;;
    *) echo "(no copy yet — usually logic only; port if it changes rendered UI)" ;;
  esac
}

echo "Tauri:    $TAURI_DIR"
echo "baseline: $(tgit log -1 --format='%h %cd %s' --date=short "$BASE")"
echo "HEAD:     $(tgit log -1 --format='%h %cd %s' --date=short "$HEAD")"
echo
echo "== commits touching src since baseline"
tgit log --format='  %h %cd %s' --date=short "$BASE..$HEAD" -- src || true
echo
echo "== changed files (committed since baseline + uncommitted) -> video target"
{
  tgit diff --name-only "$BASE" HEAD -- src
  tgit diff --name-only HEAD -- src
  tgit ls-files --others --exclude-standard -- src
} | sort -u | while read -r f; do
  [ -n "$f" ] || continue
  printf '  %-40s -> %s\n' "$f" "$(target_of "$f")"
done
echo
echo "== verbatim drift (Tauri working tree vs src/ui)"
check() {
  if cmp -s "$1" "$2"; then echo "  same     $3"; else echo "  DIFFERS  $3"; fi
}
check "$TAURI_DIR/src/styles/global.css" "$VIDEO_DIR/src/ui/styles/global.css" "global.css"
check "$TAURI_DIR/src/icons.tsx" "$VIDEO_DIR/src/ui/icons.tsx" "icons.tsx"
norm_i18n() {
  sed -e "s#'./contracts'#'./types'#" -e 's/Object\.hasOwn(/hasOwn(/g' "$1" |
    grep -v -e '^const hasOwn = ' -e 'Object.prototype.hasOwnProperty.call(target, key)' |
    tr -d ' \t\n'
}
if [ "$(norm_i18n "$TAURI_DIR/src/i18n.ts")" = "$(norm_i18n "$VIDEO_DIR/src/ui/i18n.ts")" ]; then
  echo "  same     i18n.ts (ignoring known adaptations + whitespace)"
else
  echo "  DIFFERS  i18n.ts"
fi
