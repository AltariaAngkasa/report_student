import { getTraitById } from "./traits";

// Short, warm phrase fragments per trait, used to assemble a placeholder
// summary on the client. This will later be replaced by a call to
// /api/generate, which will use the Gemini API on the server.
const TRAIT_PHRASES: Record<string, string> = {
  fokus: "mampu fokus dan mengikuti pembelajaran dengan kondusif",
  teralihkan: "masih mudah teralihkan oleh hal-hal di sekitarnya",
  hiperaktif: "memiliki energi yang besar dan kadang impulsif dalam bertindak",
  mandiri: "berani mencoba hal baru secara mandiri",
  dependent: "masih sering membutuhkan arahan dan dampingan guru",
  pemalu: "cenderung pemalu dan pasif di dalam kelas",
  komunikatif: "aktif berkomunikasi dan tidak ragu berdiskusi",
  persisten: "pantang menyerah saat menghadapi kesulitan",
  frustrasi: "mudah merasa frustrasi ketika menemui kendala",
  bosan: "mudah merasa bosan atau lelah saat kegiatan berlangsung lama",
};

export function generateMockSummary(
  name: string,
  traitIds: string[],
  customTrait?: string
): string {
  const firstName = name.trim().split(/\s+/)[0] || "Siswa";

  const phrases = traitIds
    .map((id) => {
      if (id === "lainnya") {
        return customTrait?.trim()
          ? customTrait.trim().toLowerCase()
          : null;
      }
      return TRAIT_PHRASES[id] ?? getTraitById(id)?.label.toLowerCase();
    })
    .filter((p): p is string => Boolean(p));

  if (phrases.length === 0) {
    return `${firstName} menunjukkan perkembangan yang baik selama mengikuti pembelajaran. Tetap semangat ya!`;
  }

  let body = "";
  if (phrases.length === 1) {
    body = `${firstName} ${phrases[0]}.`;
  } else {
    const last = phrases[phrases.length - 1];
    const rest = phrases.slice(0, -1).join(", ");
    body = `${firstName} ${rest}, namun ${last}.`;
  }

  return `${body} Pendampingan yang konsisten akan membantu ${firstName} berkembang lebih baik lagi. Tetap semangat ya!`;
}
