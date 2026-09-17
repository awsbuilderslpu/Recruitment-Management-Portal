// lib/types.ts

export type ApplicationStatus =
  | 'Pending'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

/**
 * Role answers can contain any JSON-serializable value.
 * Different roles can have completely different question types.
 */
export type RoleAnswerValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export type RoleAnswers = Record<string, RoleAnswerValue>;

export interface Application {
  applicationId: string;
  timestamp: string;
  status: ApplicationStatus;
  fullName: string;
  registrationNumber: string;
  universityEmail: string;
  personalEmail: string;
  phone: string;
  program: string;
  branch: string;
  semester: string;
  cgpa: string;
  linkedin: string;
  github: string;
  portfolio: string;
  preferredRole: string;
  resumeUrl: string;
  resumeFileId: string;
  roleAnswers: RoleAnswers;
  ipAddress: string;
  communities: string;
  achievement: string;
  whyJoin: string;
  rowIndex: number;
}

export interface Note {
  timestamp: string;
  applicationId: string;
  author: string;
  note: string;
  rowIndex: number;
}