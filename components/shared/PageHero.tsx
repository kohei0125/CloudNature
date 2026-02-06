interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  bgColor?: string;
}

const PageHero = ({ eyebrow, title, description, bgColor = "#F0EEE9" }: PageHeroProps) => {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C8E8FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#8A9668] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <p className="text-sm font-bold tracking-widest text-[#8A9668] mb-4 uppercase">{eyebrow}</p>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-serif font-bold text-[#19231B] mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
