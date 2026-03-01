import { Mail } from "lucide-react";
import { ALTERNATIVE_CONTACT } from "@/content/contact";

const AlternativeContact = () => {
  return (
    <div className="bg-mist rounded-2xl p-6 md:p-8">
      <h3 className="font-bold text-forest text-lg mb-6">{ALTERNATIVE_CONTACT.title}</h3>
      <div className="space-y-4">
        <div className="h-stack items-start gap-3">
          <Mail className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-forest text-sm">{ALTERNATIVE_CONTACT.email.label}</p>
            <p className="text-forest">{ALTERNATIVE_CONTACT.email.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeContact;
