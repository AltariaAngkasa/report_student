import { sql } from "@vercel/postgres";

// @vercel/postgres only accepts primitive values as query parameters, so
// JS string arrays are encoded as a Postgres array literal (e.g. {"a","b"})
// and cast to text[] in the query itself.
function toPgTextArray(values: string[]): string {
  const escaped = values.map((v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  return `{${escaped.join(",")}}`;
}

export type TeacherRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type StudentRow = {
  id: string;
  teacher_id: string;
  name: string;
  trait_ids: string[];
  custom_trait: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
};

// ---------- Teachers ----------

export async function getTeacherByEmail(email: string): Promise<TeacherRow | null> {
  const { rows } = await sql<TeacherRow>`
    SELECT id, name, email, password_hash, created_at
    FROM teachers
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getTeacherById(id: string): Promise<TeacherRow | null> {
  const { rows } = await sql<TeacherRow>`
    SELECT id, name, email, password_hash, created_at
    FROM teachers
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createTeacher(
  name: string,
  email: string,
  passwordHash: string
): Promise<TeacherRow> {
  const { rows } = await sql<TeacherRow>`
    INSERT INTO teachers (name, email, password_hash)
    VALUES (${name}, ${email.toLowerCase()}, ${passwordHash})
    RETURNING id, name, email, password_hash, created_at
  `;
  return rows[0];
}

// ---------- Students ----------

export async function getStudentsByTeacher(teacherId: string): Promise<StudentRow[]> {
  const { rows } = await sql<StudentRow>`
    SELECT id, teacher_id, name, trait_ids, custom_trait, summary, created_at, updated_at
    FROM students
    WHERE teacher_id = ${teacherId}
    ORDER BY updated_at DESC
  `;
  return rows;
}

export async function createStudent(
  teacherId: string,
  data: { name: string; traitIds: string[]; customTrait?: string | null; summary: string }
): Promise<StudentRow> {
  const { rows } = await sql<StudentRow>`
    INSERT INTO students (teacher_id, name, trait_ids, custom_trait, summary)
    VALUES (
      ${teacherId},
      ${data.name},
      ${toPgTextArray(data.traitIds)}::text[],
      ${data.customTrait ?? null},
      ${data.summary}
    )
    RETURNING id, teacher_id, name, trait_ids, custom_trait, summary, created_at, updated_at
  `;
  return rows[0];
}

export async function updateStudent(
  id: string,
  teacherId: string,
  data: { name: string; traitIds: string[]; customTrait?: string | null; summary: string }
): Promise<StudentRow | null> {
  const { rows } = await sql<StudentRow>`
    UPDATE students
    SET
      name = ${data.name},
      trait_ids = ${toPgTextArray(data.traitIds)}::text[],
      custom_trait = ${data.customTrait ?? null},
      summary = ${data.summary},
      updated_at = now()
    WHERE id = ${id} AND teacher_id = ${teacherId}
    RETURNING id, teacher_id, name, trait_ids, custom_trait, summary, created_at, updated_at
  `;
  return rows[0] ?? null;
}

export async function deleteStudent(id: string, teacherId: string): Promise<boolean> {
  const { rowCount } = await sql`
    DELETE FROM students
    WHERE id = ${id} AND teacher_id = ${teacherId}
  `;
  return (rowCount ?? 0) > 0;
}
