import { TRAIT_CATEGORY_STYLES, getTraitById } from "@/lib/traits";

type TraitPillProps = {
  traitId: string;
  customLabel?: string;
  size?: "sm" | "md";
};

export default function TraitPill({ traitId, customLabel, size = "sm" }: TraitPillProps) {
  const trait = getTraitById(traitId);
  if (!trait) return null;

  const style = TRAIT_CATEGORY_STYLES[trait.category];
  const label = trait.id === "lainnya" && customLabel ? customLabel : trait.label;

  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses}`}
      style={{
        backgroundColor: style.bg,
        borderWidth: 1,
        borderColor: style.border,
        color: style.text,
      }}
    >
      {label}
    </span>
  );
}
