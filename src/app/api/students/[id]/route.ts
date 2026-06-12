import { NextRequest, NextResponse } from "next/server";
import { deleteStudent, updateStudent } from "@/lib/db";
import { getSessionTeacherId } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const teacherId = await getSessionTeacherId();
  if (!teacherId) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const traitIds = Array.isArray(body?.traitIds) ? body.traitIds.map(String) : [];
    const customTrait = body?.customTrait ? String(body.customTrait).trim() : null;
    const summary = String(body?.summary ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nama siswa wajib diisi." }, { status: 400 });
    }
    if (traitIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal satu karakter siswa." },
        { status: 400 }
      );
    }

    const student = await updateStudent(id, teacherId, { name, traitIds, customTrait, summary });
    if (!student) {
      return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (err) {
    console.error("Update student error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const teacherId = await getSessionTeacherId();
  if (!teacherId) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteStudent(id, teacherId);
  if (!deleted) {
    return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
