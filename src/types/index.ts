export interface Contact {
  id: string;
  name: string;
  phone: string; // required
  company?: string;
  role?: string;
  linkedin?: string;
  notes?: string;
  folders: string[]; // array of folder IDs
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  system: boolean; // true for default system folders
  order?: number; // custom order for user-defined arrangement
}

export interface ContactFormData {
  name: string;
  phone: string;
  company: string;
  role: string;
  linkedin: string;
  notes: string;
  folders: string[];
}

export type EventModeState = {
  enabled: boolean;
  activeFolderId: string | null;
};

