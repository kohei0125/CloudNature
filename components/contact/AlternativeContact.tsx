import { Phone, Mail } from "lucide-react";
import { ALTERNATIVE_CONTACT } from "@/content/contact";

const AlternativeContact = () => {
  return (
    <div className="bg-mist rounded-2xl p-6 md:p-8">
      <h3 className="font-bold text-forest text-lg mb-6">{ALTERNATIVE_CONTACT.title}</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-forest text-sm">{ALTERNATIVE_CONTACT.phone.label}</p>
            <p className="text-forest">{ALTERNATIVE_CONTACT.phone.value}</p>
            <p className="text-xs text-gray-500">{ALTERNATIVE_CONTACT.phone.note}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
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
