#!/usr/bin/env bash
#
# お見積書PDF用フォントの生成スクリプト（Regular + Bold）。
#
# Google Fonts の Noto Sans JP 可変フォントから、@react-pdf/renderer が安全に
# 埋め込める「静的フォント」を2つ生成する:
#   - NotoSansJP-Regular.ttf : wght=400 のフル静的フォント（動的テキスト用）
#   - NotoSansJP-Bold.ttf     : wght=700 を静的ラベル＋数字記号だけにサブセット
#
# !!! 重要な前提 !!!
# 1) 元の "NotoSansJP-Regular.ttf" は **可変フォント** だった。可変フォントは
#    @react-pdf が埋め込めず本文が Helvetica にフォールバック（日本語が消える）。
#    → 必ず instancer で静的化すること。
# 2) @react-pdf は埋め込みフォントを **内部の name テーブル（PostScript名）** で
#    キャッシュする。複数フォントの内部名が同じだとグリフが衝突し、片方が文字化け
#    （別フォントのグリフが描画される）する。Noto から作った派生フォントは name が
#    すべて同一になるため、**フォントごとに一意な内部名へリネーム** する。
# 3) Bold は静的ラベル＋数字記号だけにサブセット（scripts/pdf-bold-glyphs.txt）。
#    fontWeight 相当の太字は PdfStyles.ts で fontFamily を NotoSansJPBold に切替えて
#    適用する。動的テキストには絶対に使わない（サブセットに無い字は豆腐□になる）。
#
# 必要ツール: fonttools (pyftsubset, fontTools.varLib.instancer)
#   $ brew install fonttools
#
# 使い方:
#   $ bash scripts/build-pdf-fonts.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
GLYPH_FILE="$SCRIPT_DIR/pdf-bold-glyphs.txt"
FONT_DIR="$ROOT_DIR/public/fonts"
REGULAR_OUT="$FONT_DIR/NotoSansJP-Regular.ttf"
BOLD_OUT="$FONT_DIR/NotoSansJP-Bold.ttf"

# 一意な内部名（@react-pdf のフォント衝突回避のため Regular と Bold で必ず変える）
REGULAR_NAME="CloudNature Sans JP"
REGULAR_PS="CloudNatureSansJP-Regular"
BOLD_NAME="CloudNature Sans JP Bold"
BOLD_PS="CloudNatureSansJP-Bold"

PYBIN="$(head -1 "$(command -v pyftsubset)" | sed 's/^#!//')"

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

VAR_FONT="$WORK_DIR/NotoSansJP-VF.ttf"
REG_FULL="$WORK_DIR/Regular-full.ttf"
BOLD_FULL="$WORK_DIR/Bold-full.ttf"
BOLD_SUB="$WORK_DIR/Bold-subset.ttf"
VAR_URL="https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"

rename_font() {
  # $1=入力 $2=出力 $3=family名 $4=PostScript名
  "$PYBIN" - "$1" "$2" "$3" "$4" <<'PY'
import sys
from fontTools.ttLib import TTFont
src, dst, family, ps = sys.argv[1:5]
f = TTFont(src)
nm = f["name"]
for nid, val in [(1, family), (2, "Regular"), (4, family), (6, ps), (16, family), (17, "Regular")]:
    nm.setName(val, nid, 3, 1, 0x409)  # Windows
    nm.setName(val, nid, 1, 0, 0)      # Mac
f.save(dst)
PY
}

echo "==> 可変フォントを取得"
curl -fsSL -o "$VAR_FONT" "$VAR_URL"

echo "==> Regular: wght=400 に静的化 → リネーム"
"$PYBIN" -m fontTools.varLib.instancer "$VAR_FONT" wght=400 -o "$REG_FULL" >/dev/null
rename_font "$REG_FULL" "$REGULAR_OUT" "$REGULAR_NAME" "$REGULAR_PS"

echo "==> Bold: wght=700 に静的化 → サブセット → リネーム"
"$PYBIN" -m fontTools.varLib.instancer "$VAR_FONT" wght=700 -o "$BOLD_FULL" >/dev/null
pyftsubset "$BOLD_FULL" \
  --text-file="$GLYPH_FILE" \
  --output-file="$BOLD_SUB" \
  --layout-features='*' \
  --recalc-bounds
rename_font "$BOLD_SUB" "$BOLD_OUT" "$BOLD_NAME" "$BOLD_PS"

echo "==> 完了:"
echo "    Regular: $(du -h "$REGULAR_OUT" | cut -f1) $REGULAR_OUT"
echo "    Bold   : $(du -h "$BOLD_OUT" | cut -f1) $BOLD_OUT"
