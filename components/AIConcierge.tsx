import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'こんにちは。株式会社クラウドネイチャーのAIコンシェルジュです。業務自動化やDXについて、お困りのことはありませんか？' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        あなたは株式会社クラウドネイチャー（CloudNature）のWebサイトに設置されたAIコンシェルジュです。
        
        以下の企業情報を基に、訪問者の質問に丁寧かつ簡潔に答えてください。
        
        【企業コンセプト】
        「AI時代を、共に歩むITパートナー」。先進的な「Cloud」と地域に根ざした「Nature」の融合。
        
        【主なサービス】
        1. 受託システム開発 (Python/PHP): 複雑な業務ロジックや大規模Webアプリ向け。実用本位。
        2. AIエージェント開発 (Dify/n8n): 即効性のある業務改善、チャットボット、自動化ワークフロー。
        3. DXサポート (伴走型): デジタイゼーションからトランスフォーメーションまでの支援。
        
        【特徴】
        - 地方中小企業の「人手不足」解消に注力。
        - 「仕組み」を提供し、属人化を解消。
        - 誠実、実用本位、伴走支援。
        
        回答のトーンは、プロフェッショナルでありながら、親しみやすく、温かみのあるもの（丁寧語）にしてください。
        営業的な押し売りはせず、ユーザーの課題に寄り添う姿勢を見せてください。
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            ...messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const text = response.text || "申し訳ありません。現在応答できません。";
      setMessages(prev => [...prev, { role: 'model', text }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: '申し訳ありません。エラーが発生しました。時間をおいて再度お試しください。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: COLORS.sageGreen, color: '#fff' }}
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-bold hidden group-hover:block whitespace-nowrap">AIに相談する</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden border border-[#EDE8E5] animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: COLORS.deepForest }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DD9348]" />
              <div>
                <h3 className="font-bold text-sm">CloudNature AI</h3>
                <p className="text-xs opacity-80">24時間対応コンシェルジュ</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#8A9668] text-white rounded-tr-none'
                      : 'bg-white text-[#19231B] border border-gray-100 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8A9668]" />
                  <span className="text-xs text-gray-500">AIが入力中...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="例：自動化の事例を知りたい"
                className="w-full bg-[#EDE8E5] text-[#19231B] rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A9668] placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.warmSunset }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              AIは誤った情報を生成する可能性があります。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConcierge;