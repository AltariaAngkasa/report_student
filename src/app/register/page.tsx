"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Gagal mendaftar. Coba lagi.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <span className="font-display text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Timedoor Academy
          </span>
        </div>

        <div className="glass-strong rounded-3xl p-7 sm:p-8">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-center mb-1" style={{ color: "var(--text-primary)" }}>
            Buat akun guru
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "var(--text-muted)" }}>
            Setiap guru punya catatan siswanya masing-masing.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sarah Amelia"
                className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@sekolah.id"
                className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Kata Sandi
              </label>
              <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-50"
                style={{ color: "var(--text-primary)" }}
              />
              <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18}/>:<Eye size={18}/>}
              </button>
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: "var(--trait-attention-text)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: "var(--accent-gold)", color: "#181a3a" }}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: "var(--text-muted)" }}>
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--accent-gold)" }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
