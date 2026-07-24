#!/bin/bash
# ウォーターマーク除去（クローン・コピー方式）
#
# 使い方:
#   bash remove_wm_clone.sh <画像ディレクトリ> [WM_W] [WM_H]
#
# 引数:
#   $1: 画像ディレクトリ（必須）
#   $2: WM 領域の幅 (default: 360)
#   $3: WM 領域の高さ (default: 85)
#
# 動作:
#   - 各 PNG について、WM 領域（右下から WM_W x WM_H）の真左の同サイズ領域を
#     クローンしてコピーする。これによりグラデーション背景や複雑な UI で
#     塗りつぶし方式より自然に WM を除去できる。
#   - _original/ にバックアップを取ってから処理する。
#
# 前提:
#   - ImageMagick (magick コマンド) インストール済み
#   - WM が画像の右下にあり、その真左に背景余白（コンテンツがない領域）が
#     存在すること。これが満たされない画像（例: WM が中央や左下にある、
#     真左に重要 UI 要素がある）には不向き。
#   - 対象画像の解像度は概ね 3000px 以上を想定。低解像度なら WM_W/WM_H を縮小する。

set -e

DIR="${1:?画像ディレクトリを指定してください}"
WM_W="${2:-360}"
WM_H="${3:-85}"

if [ ! -d "$DIR" ]; then
  echo "Error: ディレクトリが見つかりません: $DIR" >&2
  exit 1
fi

cd "$DIR"

# バックアップ（既にあればスキップ）
if [ ! -d "_original" ]; then
  echo "→ バックアップ作成: _original/"
  mkdir -p _original
  cp *.png _original/ 2>/dev/null || true
fi

# 処理対象は _original/ 配下のオリジナル
shopt -s nullglob
for src in _original/*.png; do
  base=$(basename "$src")
  echo "→ 処理中: $base"

  # 元画像サイズを取得
  W=$(magick identify -format "%w" "$src")
  H=$(magick identify -format "%h" "$src")

  X1=$((W - WM_W))
  Y1=$((H - WM_H))
  SRC_X=$((X1 - WM_W))  # WM 領域の真左

  if [ $SRC_X -lt 0 ]; then
    echo "  ⚠ 画像幅が小さすぎる。スキップ: $base"
    continue
  fi

  # 真左の領域をクローンして WM 領域に上書き
  magick "$src" \
    \( -clone 0 -crop "${WM_W}x${WM_H}+${SRC_X}+${Y1}" +repage \) \
    -geometry "+${X1}+${Y1}" -composite \
    "$base"

  echo "  ✓ WM 領域 (${X1},${Y1}) ← 真左 (${SRC_X},${Y1}) からコピー"
done

echo ""
echo "完了。次のステップ:"
echo "  1. 結果を目視確認（特に WM 周辺）"
echo "  2. 問題なければ WebP 変換:"
echo "     for f in *.png; do base=\"\${f%.png}\"; magick \"\$f\" -resize 1600x\\> -quality 85 -strip \"\${base}.webp\"; done"
echo "     rm *.png"
echo "  3. 不自然な画像があれば _original/ から復元して個別調整"
