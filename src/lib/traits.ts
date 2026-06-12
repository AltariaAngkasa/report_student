export type TraitCategory = "positive" | "attention" | "neutral";

export type Trait = {
  id: string;
  label: string;
  category: TraitCategory;
};

// Master list of character traits a teacher can pick for a student.
// "lainnya" is special-cased in the UI: picking it reveals a free-text field.
export const TRAITS: Trait[] = [
  { id: "fokus", label: "Fokus & Kondusif", category: "positive" },
  { id: "teralihkan", label: "Mudah Teralihkan (Distracted)", category: "attention" },
  { id: "hiperaktif", label: "Hiperaktif / Impulsif", category: "attention" },
  { id: "mandiri", label: "Mandiri & Berani Mencoba", category: "positive" },
  { id: "dependent", label: "Sangat Bergantung pada Guru (Dependent)", category: "attention" },
  { id: "pemalu", label: "Pemalu / Pasif", category: "neutral" },
  { id: "komunikatif", label: "Aktif & Komunikatif", category: "positive" },
  { id: "persisten", label: "Pantang Menyerah (Persistent)", category: "positive" },
  { id: "frustrasi", label: "Mudah Frustrasi / Ngambek", category: "attention" },
  { id: "bosan", label: "Mudah Bosan / Lelah", category: "attention" },
  { id: "lainnya", label: "Lainnya (tulis sendiri)", category: "neutral" },
];

export const TRAIT_CATEGORY_STYLES: Record<
  TraitCategory,
  { bg: string; border: string; text: string }
> = {
  positive: {
    bg: "var(--trait-positive-bg)",
    border: "var(--trait-positive-border)",
    text: "var(--trait-positive-text)",
  },
  attention: {
    bg: "var(--trait-attention-bg)",
    border: "var(--trait-attention-border)",
    text: "var(--trait-attention-text)",
  },
  neutral: {
    bg: "var(--trait-neutral-bg)",
    border: "var(--trait-neutral-border)",
    text: "var(--trait-neutral-text)",
  },
};

export function getTraitById(id: string): Trait | undefined {
  return TRAITS.find((t) => t.id === id);
}
