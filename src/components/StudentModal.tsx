"use client";

import { useEffect, useState } from "react";
import { Student } from "@/lib/types";
import { TRAITS, TRAIT_CATEGORY_STYLES } from "@/lib/traits";
import { generateMockSummary } from "@/lib/generateSummary";

type StudentModalProps = {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (data: Omit<Student, "updatedAt">) => void;
};

export default function StudentModal({ open, student, onClose, onSave }: StudentModalProps) {
  const [name, setName] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [customTrait, setCustomTrait] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(student?.name ?? "");
      setSelectedTraits(student?.traitIds ?? []);
      setCustomTrait(student?.customTrait ?? "");
      setSummary(student?.summary ?? "");
      setError("");
    }
  }, [open, student]);

  if (!open) return null;

  const toggleTrait = (id: string) => {
    setSelectedTraits((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!name.trim()) {
      setError("Isi nama siswa terlebih dahulu.");
      return;
    }
    if (selectedTraits.length === 0) {
      setError("Pilih minimal satu karakter siswa.");
      return;
    }
    setError("");
    setIsGenerating(true);
    // TODO: replace with a call to /api/generate (Gemini API) on the server.
    setTimeout(() => {
      setSummary(generateMockSummary(name, selectedTraits, customTrait));
      setIsGenerating(false);
    }, 700);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Isi nama siswa terlebih dahulu.");
      return;
    }
    if (selectedTraits.length === 0) {
      setError("Pilih minimal satu karakter siswa.");
      return;
    }
    onSave({
      id: student?.id ?? crypto.randomUUID(),
      name: name.trim(),
      traitIds: selectedTraits,
      customTrait: selectedTraits.includes("lainnya") ? customTrait.trim() : undefined,
      summary: summary.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(10, 8, 30, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="glass-strong relative w-full max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {student ? "Edit Siswa" : "Tambah Siswa"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="glass rounded-full p-2 transition-colors hover:bg-white/10"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label htmlFor="student-name" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Nama Siswa
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Arkhan Pradipta"
              className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          {/* Traits */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Karakter Anak <span style={{ color: "var(--trait-attention-text)" }}>*</span>
            </label>
            <p className="text-xs mb-3" style={{ color: "var(--text-faint)" }}>
              Bisa pilih lebih dari satu.
            </p>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((trait) => {
                const active = selectedTraits.includes(trait.id);
                const style = TRAIT_CATEGORY_STYLES[trait.category];
                return (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => toggleTrait(trait.id)}
                    className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all"
                    style={
                      active
                        ? {
                            backgroundColor: style.bg,
                            borderWidth: 1,
                            borderColor: style.border,
                            color: style.text,
                            boxShadow: `0 0 0 1px ${style.border} inset`,
                          }
                        : {
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor: "var(--glass-border)",
                            color: "var(--text-faint)",
                          }
                    }
                  >
                    {trait.label}
                  </button>
                );
              })}
            </div>

            {selectedTraits.includes("lainnya") && (
              <input
                type="text"
                value={customTrait}
                onChange={(e) => setCustomTrait(e.target.value)}
                placeholder="Tuliskan karakter lainnya..."
                className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50 mt-3"
                style={{ color: "var(--text-primary)" }}
              />
            )}
          </div>

          {/* Generate */}
          <div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "var(--accent-gold)", color: "#181a3a" }}
            >
              {isGenerating ? "Membuat kesimpulan..." : "✨ Buat Kesimpulan dengan AI"}
            </button>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="student-summary" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Kesimpulan Karakter
            </label>
            <textarea
              id="student-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              placeholder="Kesimpulan akan muncul di sini setelah dibuat dengan AI, dan bisa kamu edit secara langsung."
              className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50 leading-relaxed resize-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--trait-attention-text)" }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ backgroundColor: "var(--accent-gold)", color: "#181a3a" }}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
