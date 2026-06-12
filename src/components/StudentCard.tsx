"use client";

import { Student } from "@/lib/types";
import TraitPill from "./TraitPill";

type StudentCardProps = {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7c6fe0, #ff9472)",
  "linear-gradient(135deg, #5eead4, #7c6fe0)",
  "linear-gradient(135deg, #ffd166, #ff9472)",
  "linear-gradient(135deg, #ff9472, #d4c6ff)",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[hash];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  return (
    <div className="glass rounded-3xl p-5 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-semibold text-[#181a3a]"
          style={{ background: gradientFor(student.name) }}
        >
          {getInitials(student.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
            {student.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
            Diperbarui {formatDate(student.updatedAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {student.traitIds.map((traitId) => (
          <TraitPill key={traitId} traitId={traitId} customLabel={student.customTrait} />
        ))}
      </div>

      <p
        className="text-sm leading-relaxed line-clamp-4"
        style={{ color: "var(--text-muted)" }}
      >
        {student.summary || "Belum ada kesimpulan karakter untuk siswa ini."}
      </p>

      <div className="mt-auto flex gap-2 pt-1">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 rounded-xl py-2 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: "var(--accent-gold)",
            color: "#181a3a",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(student)}
          aria-label={`Hapus ${student.name}`}
          className="glass rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
          style={{ color: "var(--trait-attention-text)" }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
