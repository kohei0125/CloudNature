'use client';

const Error = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-[60vh] v-stack items-center justify-center">
    <p className="text-sm font-bold tracking-widest text-sunset mb-4">ERROR</p>
    <h1 className="text-4xl font-serif font-bold mb-6 text-forest">
      問題が発生しました
    </h1>
    <p className="text-gray-600 max-w-xl mx-auto">
      申し訳ございません。ページの読み込み中にエラーが発生しました。
    </p>
    <button
      onClick={reset}
      className="mt-8 px-8 py-3 bg-sage text-white rounded-full font-bold hover:bg-forest transition-colors"
    >
      もう一度試す
    </button>
  </div>
);

export default Error;
