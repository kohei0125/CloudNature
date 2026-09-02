import sanitizeHtml from "sanitize-html";

import TableScrollHints from "./TableScrollHints";

const PROSE_BASE = "prose prose-sm md:prose-lg max-w-none";
// 見出しの前後は大きく空ける。セクションの切れ目が一目で分かるほうが、
// 読み手が「どこまで読んだか」を見失いにくく、認知的負荷が下がる。
const PROSE_HEADINGS = "prose-headings:text-forest prose-headings:font-sans prose-h2:mt-14 prose-h2:mb-5 md:prose-h2:mt-20 md:prose-h2:mb-7 prose-h3:mt-10 prose-h3:mb-3 md:prose-h3:mt-14 md:prose-h3:mb-4";
const PROSE_BODY = "prose-p:text-[15px] md:prose-p:text-base prose-p:leading-7 md:prose-p:leading-8 prose-p:my-3 md:prose-p:my-4 prose-li:text-[15px] md:prose-li:text-base prose-li:my-1";
const PROSE_MEDIA = "prose-img:rounded-lg prose-img:my-4 md:prose-img:my-6 prose-figure:my-4 md:prose-figure:my-6 prose-figcaption:text-xs md:prose-figcaption:text-sm prose-figcaption:mt-2";
// 表の余白は .table-scroll（globals.css）が持つため、ここでは文字サイズのみ指定する
const PROSE_INLINE = "prose-a:text-sage hover:prose-a:text-sage/80 prose-strong:text-forest prose-table:text-[13px] md:prose-table:text-sm";
const PROSE_CLASSES = [PROSE_BASE, PROSE_HEADINGS, PROSE_BODY, PROSE_MEDIA, PROSE_INLINE].join(" ");

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img", "figure", "figcaption", "iframe", "video", "source",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height", "loading"],
    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "title"],
    video: ["src", "controls", "width", "height"],
    source: ["src", "type"],
    a: ["href", "target", "rel"],
    blockquote: ["class"],
    section: ["class"],
    p: ["lang", "dir"],
    // 記事内の目次（nav.toc）からアンカーリンクで飛べるようにする
    nav: ["class", "aria-label"],
    h2: ["id"],
    h3: ["id"],
  },
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

interface NewsBodyProps {
  html: string;
}

/**
 * 表を横スクロール可能なラッパーで囲み、その下にスライドできることを伝える一文を置く。
 * スマホ幅では列が潰れて「最大1／億円」のように金額が途中で折り返されるため、
 * 最小幅（globals.css の .table-scroll）を確保したうえでスクロールさせる。
 * sanitize は div の class を許可していないので、サニタイズ後に付与する。
 *
 * ヒントは常に出力しておき、実際にはみ出しているかの判定は TableScrollHints が
 * data-scrollable として付ける（表示の既定値は globals.css 側）。
 */
const TABLE_SCROLL_HINT =
  '<p class="table-scroll-hint" aria-hidden="true">横にスライドできます</p>';

const wrapTables = (html: string) =>
  html
    .replace(
      /<table(\s[^>]*)?>/g,
      (tag) => `<div class="table-scroll-wrap"><div class="table-scroll">${tag}`,
    )
    .replace(/<\/table>/g, `</table></div>${TABLE_SCROLL_HINT}</div>`);

/**
 * 見出しの先頭に手で置かれた四角マーク（■ など）を落とす。
 *
 * 見出しの四角は app/globals.css の `.prose h2::before` が描くので、本文側にも
 * 書かれていると「■ ■ 見出し」と二重になる。microCMS の既存記事には手打ちの ■ が
 * 残っており、CMS 側を直しても書き手が再び付ける余地があるため、描画時に正規化する。
 * （検出時点で該当は news/jci-2026aspac-realtime-translation の h2 5 件）
 */
const HEADING_SQUARE_MARKER = /^(?:\s|&nbsp;|　)*[■□◼◻◾◽▪▫⬛⬜]+(?:\s|&nbsp;|　)*/;

const stripHeadingSquareMarkers = (html: string) =>
  html.replace(
    /(<h([1-6])\b[^>]*>)([\s\S]*?)(<\/h\2\s*>)/gi,
    (whole, open: string, _level: string, inner: string, close: string) => {
      const stripped = inner.replace(HEADING_SQUARE_MARKER, "");
      return stripped === inner ? whole : `${open}${stripped}${close}`;
    },
  );

const NewsBody = ({ html }: NewsBodyProps) => {
  if (!html) return null;

  const clean = wrapTables(stripHeadingSquareMarkers(sanitizeHtml(html, SANITIZE_OPTIONS)));

  return (
    <TableScrollHints>
      <div
        className={PROSE_CLASSES}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </TableScrollHints>
  );
};

export default NewsBody;
