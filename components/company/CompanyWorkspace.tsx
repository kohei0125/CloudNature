import Image from "next/image";
import { COMPANY_WORKSPACE } from "@/content/company";

// AI WORKSPACE。左に大見出し＋説明、右に社内AIツールの連携図を配置する。
const CompanyWorkspace = () => {
  return (
    <section
      id="workspace"
      aria-labelledby="workspace-heading"
      className="bg-cream py-14 md:py-20 texture-grain"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* 左：見出し＋説明 */}
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-teal-800">
              {COMPANY_WORKSPACE.eyebrow}
            </p>
            <h2
              id="workspace-heading"
              className="mb-6 whitespace-pre-line text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.3] tracking-tight text-forest"
            >
              {COMPANY_WORKSPACE.title}
            </h2>
            <p className="max-w-md text-[14px] leading-[2] text-gray-600">
              {COMPANY_WORKSPACE.description}
            </p>
          </div>

          {/* 右：ラベル＋ツール連携図 */}
          <div>
            <p className="mb-5 flex items-center justify-center gap-3 text-[13px] font-bold tracking-wide text-teal-800">
              <span className="h-px w-8 bg-teal-800/40" aria-hidden="true" />
              {COMPANY_WORKSPACE.diagramLabel}
              <span className="h-px w-8 bg-teal-800/40" aria-hidden="true" />
            </p>
            <Image
              src={COMPANY_WORKSPACE.image.src}
              alt={COMPANY_WORKSPACE.image.alt}
              width={COMPANY_WORKSPACE.image.width}
              height={COMPANY_WORKSPACE.image.height}
              sizes="(min-width: 1200px) 620px, (min-width: 768px) 57vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyWorkspace;
