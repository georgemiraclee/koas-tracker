export type RequirementStatus = 'NOT_STARTED' | 'ON_GOING' | 'DONE' | 'NILAI';

export type RequirementType = 'PASIEN' | 'NON_PASIEN';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  completedAt?: string;
}

export interface PatientInfo {
  rmCode?: string;
  age?: number;
  gender?: 'L' | 'P';
  notes?: string;
}

export interface Requirement {
  id: string;
  name: string;
  type: RequirementType;
  checklist: ChecklistItem[];
  notes: string;
  nilai?: string;
  patient?: PatientInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  requirements: Requirement[];
}

export interface UserProfile {
  name: string;
  university: string;
  angkatan: string;
  periode: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  departmentId: string;
  requirementId: string;
  action: string;
  timestamp: string;
}

export interface AppSettings {
  darkMode: boolean;
  hasOnboarded: boolean;
}

export interface AppData {
  profile: UserProfile | null;
  departments: Department[];
  activityLog: ActivityLog[];
  settings: AppSettings;
}

export const DEPARTMENT_LIST: Omit<Department, 'requirements'>[] = [
  { id: 'periodonsia', name: 'Periodonsia', shortName: 'Perio', icon: '🦷' },
  { id: 'penyakit-mulut', name: 'Penyakit Mulut', shortName: 'PM', icon: '👄' },
  { id: 'bedah-mulut', name: 'Bedah Mulut', shortName: 'BM', icon: '🔪' },
  { id: 'konservasi', name: 'Konservasi', shortName: 'Kons', icon: '🛡️' },
  { id: 'kedokteran-gigi-anak', name: 'Kedokteran Gigi Anak', shortName: 'KGA', icon: '👶' },
  { id: 'radiologi', name: 'Radiologi', shortName: 'Radio', icon: '📷' },
  { id: 'odontologi-forensik', name: 'Odontologi Forensik', shortName: 'OF', icon: '🔍' },
  { id: 'orthodonsia', name: 'Orthodonsia', shortName: 'Ortho', icon: '🦷' },
  { id: 'prosthodonsia', name: 'Prosthodonsia', shortName: 'Prostho', icon: '🦿' },
  { id: 'ikgmp', name: 'IKGMP', shortName: 'IKGMP', icon: '🏥' },
];

export const getRequirementStatus = (requirement: Requirement): RequirementStatus => {
  if (requirement.nilai) return 'NILAI';
  if (requirement.checklist.length === 0) return 'NOT_STARTED';
  if (requirement.checklist.every(c => c.done)) return 'DONE';
  if (requirement.checklist.some(c => c.done)) return 'ON_GOING';
  return 'NOT_STARTED';
};

export const getStatusColor = (status: RequirementStatus) => {
  switch (status) {
    case 'NOT_STARTED': return 'status-not-started';
    case 'ON_GOING': return 'status-ongoing';
    case 'DONE': return 'status-done';
    case 'NILAI': return 'status-nilai';
  }
};

export const getStatusLabel = (status: RequirementStatus) => {
  switch (status) {
    case 'NOT_STARTED': return 'Belum Mulai';
    case 'ON_GOING': return 'Sedang Berjalan';
    case 'DONE': return 'Selesai';
    case 'NILAI': return 'Sudah Dinilai';
  }
};

export const getStatusIcon = (status: RequirementStatus) => {
  switch (status) {
    case 'NOT_STARTED': return '⬜';
    case 'ON_GOING': return '🟡';
    case 'DONE': return '🟢';
    case 'NILAI': return '⭐';
  }
};
