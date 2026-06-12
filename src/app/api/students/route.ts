import { NextRequest, NextResponse } from "next/server";
import { createStudent, getStudentsByTeacher } from "@/lib/db";
import { getSessionTeacherId } from "@/lib/auth";

export async function GET() {
  const teacherId = await getSessionTeacherId();
  if (!teacherId) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const students = await getStudentsByTeacher(teacherId);
  return NextResponse.json({ students });
}

export async function POST(request: NextRequest) {
  const teacherId = await getSessionTeacherId();
  if (!teacherId) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

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

    const student = await createStudent(teacherId, { name, traitIds, customTrait, summary });
    return NextResponse.json({ student }, { status: 201 });
  } catch (err) {
    console.error("Create student error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
