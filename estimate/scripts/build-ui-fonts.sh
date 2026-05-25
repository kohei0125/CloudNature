#!/usr/bin/env bash
#
# 見積もりフロントエンドのUIフォント（next/font/local 用）の生成スクリプト。
#
# 以前は next/font/google で Noto Sans JP / Noto Serif JP を fonts.gstatic.com から
# 取得していたが、Docker・オフライン・プロキシ環境ではビルド時に取得できず
# ページが 500 になる（next/font/google は外部ネットワーク必須）。
# → フォントを自前ホストして next/font/local で読み込むことでネットワーク非依存にする。
#
# 取得元の可変フォントを、現状 layout.tsx が使うウェイトだけ静的化して woff2 化する:
#   - NotoSansJP-Regular.woff2 (wght=400)
#   - NotoSansJP-Bold.woff2     (wght=700)
#   - NotoSerifJP-Bold.woff2    (wght=700)
# 出力先: app/fonts/
#
# ※ UIは動的な日本語（入力値・見積もり結果）を表示するためサブセット化はしない
#   （フル収録）。サイズ削減が必要なら別途サブセット運用を検討する。
# ※ 必要ツール: fonttools + brotli（woff2圧縮に必要）
#     $ brew install fonttools && pip install brotli
#
# 使い方:
#   $ bash scripts/build-ui-fonts.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="$ROOT_DIR/app/fonts"
mkdir -p "$OUT_DIR"

PYBIN="$(head -1 "$(command -v pyftsubset)" | sed 's/^#!//')"

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

SANS_VF="$WORK_DIR/NotoSansJP-VF.ttf"
SERIF_VF="$WORK_DIR/NotoSerifJP-VF.ttf"
SANS_URL="https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
SERIF_URL="https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifjp/NotoSerifJP%5Bwght%5D.ttf"

# $1=可変フォント $2=wght $3=出力woff2
instance_to_woff2() {
  local vf="$1" wght="$2" out="$3"
  local tmp="$WORK_DIR/inst-$wght-$RANDOM.ttf"
  "$PYBIN" -m fontTools.varLib.instancer "$vf" "wght=$wght" -o "$tmp" >/dev/null
  "$PYBIN" - "$tmp" "$out" <<'PY'
import sys
from fontTools.ttLib import TTFont
f = TTFont(sys.argv[1])
f.flavor = "woff2"
f.save(sys.argv[2])
PY
}

echo "==> 可変フォント取得"
curl -fsSL -o "$SANS_VF" "$SANS_URL"
curl -fsSL -o "$SERIF_VF" "$SERIF_URL"

echo "==> Noto Sans JP 400 / 700 → woff2"
instance_to_woff2 "$SANS_VF" 400 "$OUT_DIR/NotoSansJP-Regular.woff2"
instance_to_woff2 "$SANS_VF" 700 "$OUT_DIR/NotoSansJP-Bold.woff2"

echo "==> Noto Serif JP 700 → woff2"
instance_to_woff2 "$SERIF_VF" 700 "$OUT_DIR/NotoSerifJP-Bold.woff2"

echo "==> 完了:"
for f in NotoSansJP-Regular NotoSansJP-Bold NotoSerifJP-Bold; do
  echo "    $(du -h "$OUT_DIR/$f.woff2" | cut -f1) $OUT_DIR/$f.woff2"
done
