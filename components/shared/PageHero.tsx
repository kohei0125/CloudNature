"use client";

import { motion } from "framer-motion";

const heroBlobs = (
  <>
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cloud rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none animate-blob" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sage rounded-full mix-blend-multiply filter blur-[120px] opacity-15 pointer-events-none animate-blob animation-delay-2000" />
  </>
);

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  bgColor?: string;
}

const PageHero = ({ eyebrow, title, description, bgColor = "#F0EEE9" }: PageHeroProps) => {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden texture-grain" style={{ backgroundColor: bgColor }}>
      {heroBlobs}

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm font-bold tracking-widest text-sage mb-4 uppercase"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-[clamp(2rem,5vw,3.5rem)] font-serif font-bold text-forest mb-6"
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
};

export default PageHero;
