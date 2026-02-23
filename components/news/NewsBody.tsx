import sanitizeHtml from "sanitize-html";

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
      className="prose prose-lg max-w-none prose-headings:text-forest prose-headings:font-serif prose-a:text-sage hover:prose-a:text-sage/80 prose-img:rounded-lg prose-strong:text-forest"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default NewsBody;
