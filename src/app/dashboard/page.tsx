"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import StudentModal from "@/components/StudentModal";
import { Student } from "@/lib/types";

type Teacher = { id: string; name: string; email: string };

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [meRes, studentsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/students"),
        ]);

        if (meRes.status === 401 || studentsRes.status === 401) {
          router.push("/login");
          return;
        }

        const meData = await meRes.json();
        const studentsData = await studentsRes.json();

        if (!active) return;
        setTeacher(meData.teacher);
        setStudents(studentsData.students ?? []);
      } catch {
        if (active) setError("Gagal memuat data. Refresh halaman untuk mencoba lagi.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) => s.name.toLowerCase().includes(query));
  }, [students, search]);

  const openAddModal = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleDelete = async (student: Student) => {
    const confirmed = window.confirm(`Hapus data ${student.name}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/students/${student.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menghapus siswa.");
      }
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Gagal menghapus siswa.");
    }
  };

  const handleSave = async (data: Omit<Student, "updatedAt">) => {
    const isEditing = Boolean(editingStudent);
    const url = isEditing ? `/api/students/${data.id}` : "/api/students";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          traitIds: data.traitIds,
          customTrait: data.customTrait,
          summary: data.summary,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData?.error ?? "Gagal menyimpan data siswa.");
      }

      const saved: Student = {
        id: resData.student.id,
        name: resData.student.name,
        traitIds: resData.student.trait_ids ?? [],
        customTrait: resData.student.custom_trait ?? undefined,
        summary: resData.student.summary ?? "",
        updatedAt: resData.student.updated_at,
      };

      setStudents((prev) => {
        const exists = prev.some((s) => s.id === saved.id);
        if (exists) return prev.map((s) => (s.id === saved.id ? saved : s));
        return [saved, ...prev];
      });

      setModalOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Gagal menyimpan data siswa.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="glass mx-auto max-w-6xl rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
              style={{ background: "linear-gradient(135deg, var(--glow-violet), var(--glow-coral))" }}
            >
              🏮
            </div>
            <span className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Lentera Kelas
            </span>
          </div>

          <div className="flex items-center gap-3">
            {teacher && (
              <>
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {teacher.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                    {teacher.email}
                  </span>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-[#181a3a]"
                  style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--glow-coral))" }}
                >
                  {getInitials(teacher.name)}
                </div>
              </>
            )}
            <button
              onClick={handleLogout}
              className="glass rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-colors hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-8 pb-12">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <div className="pt-8 pb-6 flex flex-col gap-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Catatan Karakter Siswa
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Pilih karakter siswa, lalu biarkan AI membantu menulis kesimpulannya untukmu.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <SearchBar value={search} onChange={setSearch} />
            <button
              onClick={openAddModal}
              className="shrink-0 rounded-2xl px-5 py-3.5 text-sm font-semibold whitespace-nowrap"
              style={{ backgroundColor: "var(--accent-gold)", color: "#181a3a" }}
            >
              + Tambah Siswa
            </button>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="glass rounded-2xl px-4 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                Total siswa: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{students.length}</span>
              </div>
              {search && (
                <div className="glass rounded-2xl px-4 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  Hasil pencarian: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{filteredStudents.length}</span>
                </div>
              )}
            </div>
          )}

          {/* States */}
          {loading ? (
            <div className="glass rounded-3xl px-6 py-16 text-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Memuat data siswa...</p>
            </div>
          ) : error ? (
            <div className="glass rounded-3xl px-6 py-16 text-center">
              <p className="text-sm" style={{ color: "var(--trait-attention-text)" }}>{error}</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl px-6 py-16 text-center">
              <p className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {search ? "Siswa tidak ditemukan" : "Belum ada data siswa"}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {search
                  ? `Tidak ada siswa dengan nama "${search}".`
                  : 'Klik "+ Tambah Siswa" untuk menambahkan data siswa pertama.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <StudentModal
        open={modalOpen}
        student={editingStudent}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
