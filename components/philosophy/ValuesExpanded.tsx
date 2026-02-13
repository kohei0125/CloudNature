import { cn } from "@/lib/utils";
import { VALUES_EXPANDED } from "@/content/philosophy";

const accentColorMap: Record<string, string> = {
  sage: "text-sage",
  sunset: "text-sunset",
  sea: "text-sea",
};

const dotColorMap: Record<string, string> = {
  sage: "bg-sage",
  sunset: "bg-sunset",
  sea: "bg-sea",
};

const barColorMap: Record<string, string> = {
  sage: "bg-sage",
  sunset: "bg-sunset",
  sea: "bg-sea",
};

const ValuesExpanded = () => {
  return (
    <section className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest text-sage mb-3 uppercase">VALUES</p>
          <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold text-forest">
            私たちの3つの価値観
          </h2>
        </div>

        <div className="space-y-8">
          {VALUES_EXPANDED.map((value, idx) => (
            <div key={value.title} className="flex overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className={cn("w-1 rounded-l-2xl flex-shrink-0", barColorMap[value.accentColor])} />
              <div className="flex-1 bg-white/60 backdrop-blur-sm p-8 md:p-10 relative overflow-hidden">
                <span className="absolute top-4 right-4 text-[4rem] font-bold leading-none text-forest/[0.06] pointer-events-none select-none">{String(idx + 1).padStart(2, '0')}</span>
                <p className={cn("text-xs font-bold tracking-wider uppercase mb-2", accentColorMap[value.accentColor])}>
                  {value.subtitle}
                </p>
                <h3 className="text-xl font-bold text-forest mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{value.description}</p>
                <ul className="space-y-2">
                  {value.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", dotColorMap[value.accentColor])} />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesExpanded;
