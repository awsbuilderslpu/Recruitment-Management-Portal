export type ApplicationStatus =
  | "Pending"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected"
  | "Accepted Offer";

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


export type OfferStatus = "Pending" | "Accepted";

export interface Offer {
  offerId: string;
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  status: OfferStatus;
  createdAt: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: string;
  acceptedAt: string;
  acceptedByEmail: string;
  updatedAt: string;
}
