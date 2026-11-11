
import {
  Terminal,
  Code2,
  Layers3,
  Rocket,
  ArrowUpRight,
} from "lucide-react";

import { suggestions } from "../../data/mockData";

const icons = {
  terminal: Terminal,
  code: Code2,
  layers: Layers3,
  rocket: Rocket,
};

export default function SuggestionGrid({ onChoose }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {suggestions.map((item) => {
        const Icon = icons[item.icon] || Terminal;

        return (
          <button
            type="button"
            key={item.title}
            onClick={() => onChoose?.(`${item.title}. ${item.description}`)}
            className="group rounded-2xl border border-[#302d3b] bg-[#1b1925] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#66518a] hover:bg-[#211d2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a078ff] sm:p-5"
          >
            {/* Icon and Arrow */}
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#574574]/50 bg-[#30263f] text-[#c6acff] transition-colors group-hover:border-[#8b6ac0] group-hover:bg-[#3a2d4d]">
                <Icon size={18} />
              </span>

              <ArrowUpRight
                size={17}
                className="text-[#777386] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c6acff]"
              />
            </div>

            {/* Label */}
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#a78bfa] sm:text-[11px]">
              {item.label}
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold leading-6 text-[#eee9f8] sm:text-base">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs leading-6 text-[#9293a2] sm:text-sm">
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}