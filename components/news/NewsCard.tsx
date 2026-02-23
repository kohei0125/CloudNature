import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NEWS_CATEGORY_COLORS } from "@/content/home";
import type { NewsItem } from "@/types";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

interface NewsCardProps {
  item: NewsItem;
  disableLink?: boolean;
}

const cardClass = "group block bg-white rounded-lg border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden";

const NewsCard = ({ item, disableLink = false }: NewsCardProps) => {
  const colorClass = NEWS_CATEGORY_COLORS[item.category] ?? "bg-stone/20 text-forest";

  const content = (
    <>
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-mist">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage/10 to-cloud/30" />
        )}
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colorClass}`}>
            {item.category}
          </span>
          <time className="text-xs text-gray-400 font-medium">{formatDate(item.publishedAt)}</time>
        </div>
        <h3 className="text-forest font-bold leading-relaxed line-clamp-2 text-[15px] group-hover:text-sage transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {item.excerpt}
        </p>
        <div className="flex items-center justify-end mt-1">
          <div className="w-6 h-6 rounded-full bg-sage/20 text-sage flex items-center justify-center transition-all group-hover:bg-sage group-hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </>
  );

  if (disableLink) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <Link href={item.url} className={cardClass}>
      {content}
    </Link>
  );
};

export default NewsCard;
