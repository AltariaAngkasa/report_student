import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTeacherById } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ teacher: null }, { status: 401 });
  }

  const teacher = await getTeacherById(session.teacherId);
  if (!teacher) {
    return NextResponse.json({ teacher: null }, { status: 401 });
  }

  return NextResponse.json({
    teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
  });
}
