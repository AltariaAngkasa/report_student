import { StudentRow } from "./db";
import { Student } from "./types";

// Converts a database row (snake_case) into the shape used by the UI (camelCase).
export function studentFromRow(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    traitIds: row.trait_ids ?? [],
    customTrait: row.custom_trait ?? undefined,
    summary: row.summary ?? "",
    updatedAt: row.updated_at,
  };
}
