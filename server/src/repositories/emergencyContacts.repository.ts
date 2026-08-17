import { db } from "./db";

export interface EmergencyContact {
  id: string;
  name: string;
  nameBn: string | null;
  category: "National Emergency" | "Police" | "Fire Service" | "Medical Emergency" | "Other";
  phone: string;
  description: string;
  descriptionBn: string | null;
  verified: boolean;
  source: string;
  lastVerifiedAt: string | null;
}

interface ContactRow {
  id: string;
  name: string;
  nameBn: string | null;
  category: string;
  phone: string;
  description: string;
  descriptionBn: string | null;
  verified: number;
  source: string;
  lastVerifiedAt: string | null;
}

function rowToContact(row: ContactRow): EmergencyContact {
  return { ...row, category: row.category as EmergencyContact["category"], verified: !!row.verified };
}

export const emergencyContactsRepository = {
  listAll(): EmergencyContact[] {
    const rows = db.prepare("SELECT * FROM emergency_contacts ORDER BY category, name").all() as ContactRow[];
    return rows.map(rowToContact);
  },
};
