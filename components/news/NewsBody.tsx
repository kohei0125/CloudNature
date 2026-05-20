import sanitizeHtml from "sanitize-html";

const PROSE_BASE = "prose prose-sm md:prose-lg max-w-none";
const PROSE_HEADINGS = "prose-headings:text-forest prose-headings:font-sans prose-h2:mt-8 prose-h2:mb-3 md:prose-h2:mt-12 md:prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-2 md:prose-h3:mt-8 md:prose-h3:mb-3";
const PROSE_BODY = "prose-p:text-[15px] md:prose-p:text-base prose-p:leading-7 md:prose-p:leading-8 prose-p:my-3 md:prose-p:my-4 prose-li:text-[15px] md:prose-li:text-base prose-li:my-1";
const PROSE_MEDIA = "prose-img:rounded-lg prose-img:my-4 md:prose-img:my-6 prose-figure:my-4 md:prose-figure:my-6 prose-figcaption:text-xs md:prose-figcaption:text-sm prose-figcaption:mt-2";
const PROSE_INLINE = "prose-a:text-sage hover:prose-a:text-sage/80 prose-strong:text-forest prose-table:text-[13px] md:prose-table:text-sm prose-table:my-4";
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
    p: ["lang", "dir"],
  },
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

interface NewsBodyProps {
  html: string;
}

const NewsBody = ({ html }: NewsBodyProps) => {
  if (!html) return null;

  const clean = sanitizeHtml(html, SANITIZE_OPTIONS);

  return (
    <div
      className={PROSE_CLASSES}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default NewsBody;
