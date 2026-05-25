import path from "node:path";
import { Font } from "@react-pdf/renderer";

// Regular（全文字）と Bold（サブセット）は別ファミリーとして登録する。
// 同一ファミリーに複数ウェイトを登録すると、@react-pdf のレンダリング時に
// Regular の日本語グリフが描画されない不具合があるため、ファミリーを分ける。
// Bold は scripts/pdf-bold-glyphs.txt の静的ラベル＋数字記号のみのサブセット。
// → 太字は fontFamily を NotoSansJPBold に切り替えて適用する（PdfStyles.ts）。
//   動的テキスト（機能名・概要など）には絶対に NotoSansJPBold を使わないこと。
//   サブセットに無い文字を指定すると豆腐(□)になる。
Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf"),
});

Font.register({
  family: "NotoSansJPBold",
  src: path.join(process.cwd(), "public/fonts/NotoSansJP-Bold.ttf"),
});

Font.registerHyphenationCallback((word) => [word]);
