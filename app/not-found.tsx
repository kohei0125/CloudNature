import Link from "next/link";

const NotFound = () => (
  <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-[60vh] v-stack items-center justify-center">
    <p className="text-sm font-bold tracking-widest text-sage mb-4">404</p>
    <h1 className="text-4xl font-serif font-bold mb-6 text-forest">
      ページが見つかりません
    </h1>
    <p className="text-gray-600 max-w-xl mx-auto">
      お探しのページは移動または削除された可能性があります。
    </p>
    <Link
      href="/"
      className="mt-8 px-8 py-3 bg-sage text-white rounded-full font-bold hover:bg-forest transition-colors"
    >
      トップページへ戻る
    </Link>
  </div>
);

export default NotFound;
