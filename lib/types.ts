export type ApplicationStatus =
  | "Pending"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

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

  roleAnswers: Record<string, string>;

  ipAddress: string;
  communities: string;
  achievement: string;
  whyJoin: string;

  rowIndex: number;
}