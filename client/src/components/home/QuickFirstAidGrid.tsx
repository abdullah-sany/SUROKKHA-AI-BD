import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  IconCut, IconBurn, IconFainting, IconNosebleed, IconChoking, IconPhysicalInjury,
} from "../ui/Icons";

const CARDS = [
  { key: "cutsBleeding", icon: IconCut, seedText: "I have a cut and it's bleeding" },
  { key: "burns", icon: IconBurn, seedText: "I got burned" },
  { key: "fainting", icon: IconFainting, seedText: "Someone just fainted" },
  { key: "nosebleed", icon: IconNosebleed, seedText: "My nose is bleeding" },
  { key: "choking", icon: IconChoking, seedText: "Someone is choking" },
  { key: "physicalInjury", icon: IconPhysicalInjury, seedText: "I have a physical injury" },
] as const;

export function QuickFirstAidGrid() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {CARDS.map((card) => (
        <button
          key={card.key}
          onClick={() => navigate("/first-aid", { state: { situationText: card.seedText, autoSubmit: true } })}
          className="flex flex-col items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 text-left hover:border-teal-300 hover:shadow-card transition-all min-h-[44px]"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-600">
            <card.icon width={22} height={22} />
          </span>
          <span className="text-sm font-semibold text-navy-700 leading-snug">
            {t(`home.cards.${card.key}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
