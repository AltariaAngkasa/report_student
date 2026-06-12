"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
        style={{ color: "var(--text-faint)" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Cari nama siswa..."}
        className="glass w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm sm:text-base outline-none transition-colors placeholder:opacity-60"
        style={{ color: "var(--text-primary)" }}
      />
    </div>
  );
}
