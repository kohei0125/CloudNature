import { 
  Code2, 
  Bot, 
  TrendingUp, 
  Leaf, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { NavItem, ServiceItem, CaseStudy, ValueProp } from './types';

// Colors defined in the document
export const COLORS = {
  sageGreen: '#8A9668',
  deepForest: '#19231B',
  pebbleBeige: '#EDE8E5',
  warmSunset: '#DD9348',
  cloudBlue: '#C8E8FF',
  earth: '#261D14',
  sea: '#79C0BC',
  stone: '#CADCEB',
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', path: '/' },
  { label: '想い', path: '/philosophy' },
  { label: 'サービス', path: '/services' },
  { label: '事例', path: '/cases' },
  { label: 'お問い合わせ', path: '/contact' },
];

export const VALUES: ValueProp[] = [
  {
    title: 'VALUE 1: 実用本位のエンジニアリング',
    subtitle: 'Practical Engineering',
    description: '流行に左右されず、現場で「本当に役立つ」ことを最優先する技術的誠実さ。オーバースペックな開発を避け、現時点での最適解を提案します。'
  },
  {
    title: 'VALUE 2: 運用まで見据えた伴走',
    subtitle: 'Sustainable Partnership',
    description: '作って終わりにしない、小規模組織ならではのフットワークと徹底した定着支援。現場への浸透まで責任を持ちます。'
  },
  {
    title: 'VALUE 3: 誠実な実装、確実な成果',
    subtitle: 'Integrity & Results',
    description: '納期と品質の厳守。当たり前のことを高いレベルで積み重ねることで得られる地域からの信頼を大切にします。'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'dev',
    title: '受託システム開発',
    description: '「資産としてのシステム」を構築。複雑な業務ロジックも堅牢に実装します。',
    icon: Code2,
    features: ['AI・データ解析連携', '大規模Webアプリ', '既存CMS連携'],
    techStack: ['Python', 'PHP', 'React', 'AWS']
  },
  {
    id: 'ai',
    title: 'AIエージェント開発',
    description: 'Dify/n8nを活用した即効性のある業務改善。社内ナレッジの即時回答やAPI連携を実現。',
    icon: Bot,
    features: ['社内チャットボット', 'SaaS間連携自動化', '自律型エージェント'],
    techStack: ['Dify', 'n8n', 'OpenAI', 'Gemini']
  },
  {
    id: 'dx',
    title: 'DXサポート（伴走型）',
    description: 'ツール導入だけでなく、組織文化の変革を含めた支援。デジタイゼーションからトランスフォーメーションへ。',
    icon: TrendingUp,
    features: ['現状分析・課題抽出', '導入研修・定着支援', 'データ活用経営'],
    techStack: ['Consulting', 'Training', 'Analytics']
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'manufacturing',
    title: '製造業における人手不足解消',
    category: '製造業 × Dify',
    before: '熟練工の勘に頼り、新人の教育に2年を要していた。',
    after: 'ナレッジをAI化し、新人教育コストを40%削減。即戦力化を実現。',
    image: 'https://picsum.photos/800/600?random=1'
  },
  {
    id: 'service',
    title: 'サービス業の完全自動化',
    category: 'サービス業 × n8n',
    before: '予約管理からメール対応まで手動で行い、本来の業務が圧迫されていた。',
    after: '予約・リマインド・集計を全自動化。オーナーの現場改善時間を創出。',
    image: 'https://picsum.photos/800/600?random=2'
  },
  {
    id: 'municipality',
    title: '地域DX実証実験',
    category: '自治体 × Python',
    before: '観光需要の予測が難しく、交通渋滞や機会損失が発生していた。',
    after: 'AI需要予測により交通最適化を実現。観光満足度が向上。',
    image: 'https://picsum.photos/800/600?random=3'
  }
];
