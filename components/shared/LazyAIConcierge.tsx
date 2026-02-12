'use client';

import dynamic from 'next/dynamic';

const AIConcierge = dynamic(() => import('./AIConcierge'), { ssr: false });

const LazyAIConcierge = () => <AIConcierge />;

export default LazyAIConcierge;
