import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createTeacher, getTeacherByEmail } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    const existing = await getTeacherByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const teacher = await createTeacher(name, email, passwordHash);

    const token = await createSessionToken({ teacherId: teacher.id });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    return NextResponse.json({
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
