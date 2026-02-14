import { KPI_HIGHLIGHTS, KPI_NOTE } from "@/content/cases";
import NumberTicker from "@/components/shared/NumberTicker";

const KpiHighlights = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {KPI_HIGHLIGHTS.map((kpi) => (
            <div key={kpi.label} className="glass-card rounded-2xl p-6 relative overflow-hidden text-center">
              <p className="text-4xl md:text-5xl font-bold text-sunset">
                <NumberTicker
                  value={parseFloat(kpi.value)}
                  suffix=""
                  decimals={kpi.value.includes('.') ? 1 : 0}
                />
                <span className="text-2xl md:text-3xl ml-1">{kpi.unit}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">{kpi.label}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-sunset/40 blur-sm rounded-full" />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-6">{KPI_NOTE}</p>
      </div>
    </section>
  );
};

export default KpiHighlights;
