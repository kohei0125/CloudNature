import SectionHeader from "@/components/shared/SectionHeader";
import { MISSION_DEEP_DIVE } from "@/content/philosophy";

const MissionDeepDive = () => {
  return (
    <section className="py-16 md:py-24 bg-mist texture-grain">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow={MISSION_DEEP_DIVE.eyebrow}
          title={MISSION_DEEP_DIVE.title}
          centered
        />

        <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto text-center mb-12">
          {MISSION_DEEP_DIVE.description}
        </p>

        <div className="relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cloud/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sunset/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {MISSION_DEEP_DIVE.points.map((point, idx) => (
              <div key={point.title} className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden hover:shadow-lg hover:bg-white/70 transition-all duration-300">
                <span className="absolute top-4 right-4 text-[4rem] font-bold leading-none text-forest/[0.06] pointer-events-none select-none">{String(idx + 1).padStart(2, '0')}</span>
                <h3 className="font-bold text-forest mb-2">{point.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionDeepDive;
