import { CircleDollarSign, Lock, PhoneOff } from "lucide-react";
import { TRUST_BADGES } from "@/content/contact";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CircleDollarSign,
  Lock,
  PhoneOff,
};

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap gap-4 md:gap-6 justify-center py-8">
      {TRUST_BADGES.map((badge) => {
        const Icon = iconMap[badge.icon];
        return (
          <div key={badge.label} className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
            {Icon ? (
              <span className="w-7 h-7 bg-sage/10 rounded-full center">
                <Icon className="w-4 h-4 text-sage" />
              </span>
            ) : null}
            <span className="text-sm font-medium text-forest">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
