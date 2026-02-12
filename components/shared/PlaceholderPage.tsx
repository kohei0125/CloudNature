import Link from "next/link";
import { PLACEHOLDER_COPY } from "@/content/placeholder";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-serif font-bold mb-6 text-forest">{title}</h1>
    <p className="text-gray-600 max-w-xl mx-auto">{PLACEHOLDER_COPY.description}</p>
    <Link
      href="/"
      className="mt-8 px-8 py-3 bg-sage text-white rounded-full font-bold hover:bg-forest transition-colors"
    >
      {PLACEHOLDER_COPY.back}
    </Link>
  </div>
);

export default PlaceholderPage;
