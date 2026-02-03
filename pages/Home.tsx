import React from 'react';
import { ArrowRight, CheckCircle2, Download, Zap, Database, PlayCircle, Bot, TrendingUp, Sparkles, Code2, Users, LayoutTemplate, Network } from 'lucide-react';
import { COLORS, SERVICES, VALUES, CASE_STUDIES } from '../constants';
import WaveSeparator from '../components/WaveSeparator';

const Home: React.FC = () => {
  return (
    <div className="w-full bg-[#EDE8E5]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        
        {/* Dynamic Organic Background (Living Breath) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-[#C8E8FF] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-[#8A9668] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#DD9348] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
          {/* Noise Texture Overlay for entire section */}
          <div className="absolute inset-0 texture-grain opacity-50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="lg:col-span-5 space-y-10 animate-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-xs font-bold tracking-wider text-[#19231B] border border-white/50 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="w-2 h-2 bg-[#DD9348] rounded-full animate-pulse"></span>
              2025-2026 STRATEGIC PARTNER
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] text-[#19231B] tracking-tight">
              AI時代を、<br />
              <span className="relative inline-block text-[#19231B] hover:tracking-wide transition-all duration-500">
                共に歩む。
                {/* Organic underline */}
                <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#8A9668] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-gray-700 leading-loose max-w-lg font-medium">
              人手不足という「不自由」からの解放。<br />
              最新のAIエージェントと、地に足のついたシステム開発で、
              地方企業の組織を「強く、しなやか」に変革します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="btn-puffy px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 group">
                無料診断・相談
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              
              <button className="px-8 py-4 bg-white/40 backdrop-blur-sm text-[#19231B] border border-white/60 rounded-full font-bold hover:bg-white/80 transition-colors shadow-sm flex items-center justify-center gap-2 group">
                <PlayCircle className="w-5 h-5 text-[#8A9668] group-hover:scale-110 transition-transform" />
                <span>3分でわかるサービス</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Bento Grid Visuals */}
          <div className="lg:col-span-7 h-auto lg:h-[650px] relative animate-in fade-in duration-1000 delay-300">
             {/* The Grid */}
             <div className="grid grid-cols-6 grid-rows-6 gap-5 h-full min-h-[500px]">
                
                {/* 1. Main Visual: Human & Tech Symbiosis (Largest) */}
                <div className="col-span-4 row-span-6 rounded-[40px] overflow-hidden relative shadow-2xl glass-card group">
                   {/* Background Image */}
                   <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" 
                      alt="Modern office collaboration" 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 saturate-[0.8] group-hover:saturate-100" 
                   />
                   {/* Texture Overlay on Image */}
                   <div className="absolute inset-0 texture-grain opacity-20"></div>
                   
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#19231B]/90 via-[#19231B]/10 to-transparent"></div>
                   
                   {/* Content Overlay */}
                   <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Users className="w-3 h-3 text-[#DD9348]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0F2F5]">Case Study</span>
                      </div>
                      <p className="font-serif text-2xl leading-tight mb-2">製造業DXの軌跡</p>
                      <p className="text-sm text-gray-300">熟練工のナレッジをAI化し、<br/>教育コストを40%削減。</p>
                   </div>
                </div>

                {/* 2. AI Agent Visualization (Top Right - Floating/Bleeding) */}
                <div className="col-span-2 row-span-3 rounded-[40px] glass-card p-5 flex flex-col justify-between relative overflow-visible transform transition-all hover:-translate-y-2 duration-500 z-20">
                    
                    {/* Bleeding Element: Bot Icon popping out */}
                    <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#DD9348] rounded-2xl rotate-12 flex items-center justify-center shadow-lg animate-blob animation-delay-2000 border-4 border-[#EDE8E5]">
                        <Bot className="text-white w-7 h-7 -rotate-12" />
                    </div>

                    <div className="mt-2 h-full flex flex-col justify-between">
                       <h4 className="font-bold text-[#19231B] leading-tight text-sm">AI Agent<br/>Architecture</h4>
                       
                       {/* Animated Abstract Workflow */}
                       <div className="relative h-20 w-full mt-2">
                           {/* Nodes */}
                           <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8A9668] animate-pulse"></div>
                           <div className="absolute top-8 right-4 w-2 h-2 rounded-full bg-[#8A9668] animate-pulse delay-700"></div>
                           <div className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-[#DD9348] animate-pulse delay-300"></div>
                           
                           {/* Lines (SVG) */}
                           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                               <path d="M 12 12 L 30 60" stroke="#8A9668" strokeWidth="1" strokeDasharray="2 2" className="opacity-50" />
                               <path d="M 30 60 L 80 40" stroke="#DD9348" strokeWidth="1" strokeDasharray="2 2" className="opacity-50" />
                               <path d="M 80 40 L 12 12" stroke="#8A9668" strokeWidth="1" strokeDasharray="2 2" className="opacity-50" />
                           </svg>
                           
                           {/* Processing Chip */}
                           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-100 shadow-sm">
                               <div className="flex gap-1">
                                   <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce"></div>
                                   <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce delay-100"></div>
                                   <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce delay-200"></div>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>

                {/* 3. Productivity Metrics (Bottom Right - Dark Accent) */}
                <div className="col-span-2 row-span-3 rounded-[40px] glass-card-dark p-6 flex flex-col justify-center relative overflow-hidden group shadow-2xl texture-grain border border-white/5">
                    
                    {/* Dynamic abstract background line */}
                    <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-t from-[#8A9668]/20 to-transparent transform -skew-y-12 translate-y-4"></div>

                    <TrendingUp className="w-8 h-8 text-[#DD9348] mb-4 relative z-10" />
                    <div className="relative z-10">
                       <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Impact</p>
                       <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-serif font-bold text-white highlight-cloud">2.5</span>
                          <span className="text-xl text-[#8A9668] font-bold">x</span>
                       </div>
                       <p className="text-gray-400 text-xs mt-2 leading-tight">Dify導入による<br/>業務効率化実績</p>
                    </div>
                </div>

             </div>
          </div>

        </div>
      </section>

      {/* 
        Correction 1: WaveSeparator between Hero and Mission
        Hero is #EDE8E5 (Top), Mission is White (Bottom).
        Standard Wave (position='bottom') shape is Top-Filled.
        So fill color = Hero (#EDE8E5), bg color = Mission (#ffffff).
      */}
      <WaveSeparator color="#EDE8E5" bgColor="#ffffff" />

      {/* Mission / Values Section */}
      <section className="py-24 bg-white relative texture-grain">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold tracking-widest text-[#8A9668] mb-3">OUR PROMISE</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#19231B] mb-6">
              人手に代わる、仕組みを届ける
            </h3>
            <p className="text-gray-600 leading-loose">
              現代の企業が求めているのは、抽象的なアドバイスではありません。<br />
              現場の痛みを直接取り除く、具体的な「システム」と「AI」の実装です。<br />
              CloudNatureは、3つの価値観で信頼に応えます。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((value, index) => (
              <div key={index} className="bg-[#EDE8E5] p-8 rounded-[32px] hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#8A9668]/30 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Organic Number Background */}
                <div className="relative w-14 h-14 mb-6 group-hover:scale-110 transition-transform z-10 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#8A9668]/20 fill-current">
                        <path d="M42.7,-73.4C55.9,-67.2,67.3,-57.8,76.4,-46.6C85.5,-35.3,92.3,-22.2,90.8,-9.6C89.3,3,79.5,15.1,70.6,26.4C61.7,37.7,53.7,48.2,43.6,56.8C33.5,65.4,21.3,72.1,8.3,73.5C-4.7,74.9,-18.5,71,-30.7,64.2C-42.9,57.4,-53.5,47.7,-61.7,36.7C-69.9,25.7,-75.7,13.4,-74.6,1.9C-73.5,-9.6,-65.5,-20.3,-56.9,-30.2C-48.3,-40.1,-39.1,-49.2,-28.5,-56.6C-17.9,-64,-5.9,-69.7,7,-71.9L19.9,-74.1" transform="translate(50 50) scale(0.9)" />
                    </svg>
                    <span className="font-serif font-bold text-[#19231B] text-xl relative z-10">{index + 1}</span>
                </div>

                <h4 className="text-lg font-bold text-[#19231B] mb-2 relative z-10">{value.title.split(': ')[1]}</h4>
                <p className="text-xs font-bold text-[#8A9668] mb-4 tracking-wider relative z-10">{value.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveSeparator position="top" color="#F8F9FA" bgColor="#ffffff" />

      {/* Services Section */}
      <section className="py-24 bg-[#F8F9FA] texture-grain">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-[#8A9668] mb-3">SOLUTIONS</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#19231B]">
                現場最適のテクノロジー実装
              </h3>
            </div>
            <button className="text-[#DD9348] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              全サービスを見る <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-[#EDE8E5] rounded-full flex items-center justify-center mb-6 text-[#19231B] group-hover:bg-[#19231B] group-hover:text-white transition-colors duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[#19231B] mb-4">{service.title}</h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#19231B] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#8A9668]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Refined Tech Tags: Better Visibility */}
                <div className="px-8 py-6 bg-[#19231B] text-white/80 text-xs border-t border-white/10 group-hover:bg-[#DD9348] transition-colors duration-300">
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-white/15 border border-white/20 rounded-md backdrop-blur-sm">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-[#19231B] text-white relative overflow-hidden texture-grain">
         
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#8A9668] mb-3">CASE STUDIES</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold">
              「仕組み」が変われば、<br className="md:hidden"/>未来が変わる。
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {CASE_STUDIES.map((study) => (
              <div key={study.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] border border-white/10">
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute top-4 left-4 bg-[#DD9348] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {study.category}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-[#DD9348] transition-colors">{study.title}</h4>
                <div className="space-y-4 text-sm">
                  <div className="pl-4 border-l-2 border-gray-600">
                    <p className="text-gray-400 text-xs mb-1">BEFORE</p>
                    <p className="text-gray-300">{study.before}</p>
                  </div>
                  <div className="pl-4 border-l-2 border-[#DD9348]">
                    <p className="text-[#DD9348] text-xs mb-1 font-bold">AFTER</p>
                    <p className="text-white font-bold text-lg leading-snug tracking-wide">{study.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        Correction 2: WaveSeparator between Case Studies and CTA
        Case Studies is #19231B (Top), CTA is #EDE8E5 (Bottom).
        Standard Wave (position='bottom') shape is Top-Filled.
        So fill color = Case Studies (#19231B), bg color = CTA (#EDE8E5).
      */}
      <WaveSeparator position="bottom" color="#19231B" bgColor="#EDE8E5" />

      {/* Whitepaper / CTA Section */}
      <section className="py-24 bg-[#EDE8E5] texture-grain">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden border border-white/50">
            {/* Organic accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8E8FF] rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>

            <div className="flex-1 space-y-6 relative z-10">
              <h3 className="text-3xl font-serif font-bold text-[#19231B]">
                失敗しないAI導入の<br />
                はじめの一歩。
              </h3>
              <p className="text-gray-600">
                中小企業がAIエージェントを導入する際に陥りがちな罠と、成功への5つのステップをまとめた資料を無料で公開しています。
              </p>
              
              <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <Database className="w-8 h-8 text-[#8A9668] shrink-0" />
                <div>
                  <h5 className="font-bold text-[#19231B] mb-1">2025年版 中小企業のためのAIエージェント導入実践ガイド</h5>
                  <p className="text-xs text-gray-500">PDF / 全24ページ / 最終更新 2025.04</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button className="flex-1 btn-puffy btn-puffy-accent px-6 py-4 rounded-full font-bold flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  資料をダウンロード
                </button>
                <button className="flex-1 px-6 py-4 bg-[#19231B] text-white rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg">
                  <Zap className="w-5 h-5" />
                  無料診断を受ける
                </button>
              </div>
            </div>

            <div className="lg:w-1/3 relative z-10">
                <div className="bg-gray-100 rounded-lg aspect-[3/4] shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                    <div className="absolute inset-0 texture-grain opacity-20"></div>
                    <p className="text-gray-400 font-bold text-sm">BOOK COVER IMAGE</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO text block (hidden visually but good for structure) */}
      <section className="py-12 text-center text-xs text-gray-400 bg-[#EDE8E5]">
        <div className="container mx-auto px-6 max-w-4xl">
           <p>
             株式会社クラウドネイチャーは、地方中小企業のDX推進、AI導入支援、業務自動化（Dify/n8n）を専門とするITパートナーです。
             受託開発からワークフロー構築まで、お客様の課題に合わせた最適なソリューションを提供します。
           </p>
        </div>
      </section>
    </div>
  );
};

export default Home;