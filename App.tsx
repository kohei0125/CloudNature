import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Loader2 } from 'lucide-react';

// Simplified for this demo: In a real app, other pages would be lazy loaded or imported
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-serif font-bold mb-6 text-[#19231B]">{title}</h1>
    <p className="text-gray-600 max-w-xl mx-auto">
      現在、このページは準備中です。ホームに戻ってサービスの詳細をご覧ください。
    </p>
    <a href="#/" className="mt-8 px-8 py-3 bg-[#8A9668] text-white rounded-full font-bold hover:bg-[#19231B] transition-colors">
      ホームへ戻る
    </a>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#EDE8E5]">
          <Loader2 className="w-10 h-10 animate-spin text-[#8A9668]" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="philosophy" element={<PlaceholderPage title="私たちの想い" />} />
            <Route path="services" element={<PlaceholderPage title="サービス紹介" />} />
            <Route path="cases" element={<PlaceholderPage title="導入事例" />} />
            <Route path="contact" element={<PlaceholderPage title="お問い合わせ" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;