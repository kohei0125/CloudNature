import SectionHeader from "@/components/shared/SectionHeader";
import { FOUNDING_STORY } from "@/content/philosophy";

const FoundingStory = () => {
  const [firstParagraph, ...restParagraphs] = FOUNDING_STORY.paragraphs;

  return (
    <section className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6 max-w-3xl relative">
        <span className="absolute -top-4 left-0 text-[6rem] font-serif leading-none text-sunset/10 pointer-events-none select-none">&ldquo;</span>
        <SectionHeader
          eyebrow={FOUNDING_STORY.eyebrow}
          title={FOUNDING_STORY.title}
          centered
        />

        <blockquote className="text-xl md:text-2xl font-serif italic text-forest border-l-4 border-sunset pl-6 mb-8">
          {firstParagraph}
        </blockquote>

        <div className="space-y-6">
          {restParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 20)} className="text-sm md:text-base text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundingStory;
