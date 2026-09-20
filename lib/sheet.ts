import "server-only";

import { google } from "googleapis";
import type {
  Application,
  ApplicationStatus,
} from "@/lib/types";

/**
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const SHEET_NAMES = {
  APPLICATIONS: "Applications",
  NOTES: "Notes",
} as const;

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID;

const SERVICE_ACCOUNT_EMAIL =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

const PRIVATE_KEY =
  process.env.GOOGLE_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

if (!SPREADSHEET_ID) {
  throw new Error(
    "GOOGLE_SPREADSHEET_ID is not configured"
  );
}

if (!SERVICE_ACCOUNT_EMAIL) {
  throw new Error(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL is not configured"
  );
}

if (!PRIVATE_KEY) {
  throw new Error(
    "GOOGLE_PRIVATE_KEY is not configured"
  );
}

/**
 * ============================================================
 * GOOGLE SHEETS CLIENT
 * ============================================================
 */

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: SERVICE_ACCOUNT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

/**
 * ============================================================
 * INTERNAL HELPERS
 * ============================================================
 */

function columnToLetter(column: number): string {
  let result = "";

  while (column > 0) {
    const remainder = (column - 1) % 26;

    result =
      String.fromCharCode(65 + remainder) +
      result;

    column = Math.floor((column - 1) / 26);
  }

  return result;
}

function applicationToRow(
  applicationNumber: number
): number {
  if (
    !Number.isInteger(applicationNumber) ||
    applicationNumber < 1
  ) {
    throw new Error(
      "Application number must be a positive integer"
    );
  }

  return applicationNumber + 1;
}

/**
 * ============================================================
 * PREFERRED ROLE
 * ============================================================
 */

function formatPreferredRole(
  value: string
): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  const roles: Record<string, string> = {
    backend: "Backend Development",
    "backend developer": "Backend Development",
    "backend development": "Backend Development",

    frontend: "Frontend Development",
    "frontend developer": "Frontend Development",
    "frontend development": "Frontend Development",

    "full stack": "Full Stack Development",
    "full stack developer": "Full Stack Development",
    "full stack development": "Full Stack Development",

    cloud: "Cloud / DevOps",
    devops: "Cloud / DevOps",
    "cloud devops": "Cloud / DevOps",
    "cloud / devops": "Cloud / DevOps",

    "machine learning": "Machine Learning",
    ml: "Machine Learning",

    ai: "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",

    data: "Data / Analytics",
    "data science": "Data / Analytics",
    analytics: "Data / Analytics",

    cybersecurity: "Cybersecurity",
    security: "Cybersecurity",

    mobile: "Mobile Development",
    "mobile development": "Mobile Development",

    ui: "UI / UX Design",
    ux: "UI / UX Design",
    "ui ux": "UI / UX Design",
    "ui/ux": "UI / UX Design",
    design: "UI / UX Design",
  };

  if (roles[normalized]) {
    return roles[normalized];
  }

  return value
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

/**
 * ============================================================
 * APPLICATION MAPPER
 * ============================================================
 *
 * A  Application ID
 * B  Timestamp
 * C  Status
 * D  Full Name
 * E  Registration No.
 * F  University Email
 * G  Personal Email
 * H  Phone
 * I  Program
 * J  Branch
 * K  Semester
 * L  CGPA
 * M  LinkedIn
 * N  GitHub
 * O  Portfolio
 * P  Preferred Role
 * Q  Resume URL
 * R  Resume File ID
 * S  Role Answers (JSON)
 * T  IP Address
 * U  Communities
 * V  Achievement
 * W  Why Join
 */

function mapApplication(
  row: string[],
  rowIndex: number
): Application {
  let roleAnswers: Record<string, string> = {};

  if (row[18]?.trim()) {
    try {
      const parsed = JSON.parse(row[18]);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        roleAnswers = parsed;
      }
    } catch {
      roleAnswers = {};
    }
  }

  return {
    applicationId: row[0] ?? "",
    timestamp: row[1] ?? "",
    status:
      (row[2] as ApplicationStatus) ??
      "Pending",

    fullName: row[3] ?? "",
    registrationNumber: row[4] ?? "",
    universityEmail: row[5] ?? "",
    personalEmail: row[6] ?? "",
    phone: row[7] ?? "",

    program: row[8] ?? "",
    branch: row[9] ?? "",
    semester: row[10] ?? "",
    cgpa: row[11] ?? "",

    linkedin: row[12] ?? "",
    github: row[13] ?? "",
    portfolio: row[14] ?? "",

    preferredRole: formatPreferredRole(
      row[15] ?? ""
    ),

    resumeUrl: row[16] ?? "",
    resumeFileId: row[17] ?? "",

    roleAnswers,

    ipAddress: row[19] ?? "",
    communities: row[20] ?? "",
    achievement: row[21] ?? "",
    whyJoin: row[22] ?? "",

    rowIndex,
  };
}

/**
 * ============================================================
 * APPLICATIONS
 * ============================================================
 */

export async function getAllApplications(): Promise<
  Application[]
> {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAMES.APPLICATIONS}'!A2:W`,
    });

  const rows = response.data.values ?? [];

  return rows
    .filter((row) =>
      row.some(
        (cell) =>
          typeof cell === "string" &&
          cell.trim() !== ""
      )
    )
    .map((row, index) =>
      mapApplication(row, index + 2)
    );
}

export async function getApplication(
  applicationId: string
): Promise<Application | null> {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAMES.APPLICATIONS}'!A:W`,
    });

  const rows = response.data.values ?? [];

  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];

    if (
      row[0]?.trim() === applicationId.trim()
    ) {
      return mapApplication(
        row,
        index + 1
      );
    }
  }

  return null;
}

/**
 * ============================================================
 * APPLICATION STATUS
 * ============================================================
 */

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const application =
    await getApplication(applicationId);

  if (!application) {
    throw new Error(
      `Application ${applicationId} does not exist`
    );
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAMES.APPLICATIONS}'!C${application.rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[status]],
    },
  });

  return {
    success: true,
    applicationId,
    status,
  };
}

/**
 * ============================================================
 * NOTES
 * ============================================================
 */

export async function getNote(
  applicationId: string
): Promise<string[]> {
  const application = await getApplication(applicationId);

  if (!application) {
    throw new Error(
      `Application ${applicationId} does not exist`
    );
  }

  const row = application.rowIndex;

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAMES.NOTES}'!A${row}:ZZ${row}`,
    });

  const values =
    response.data.values?.[0] ?? [];

  return values
    .filter(
      (value) =>
        typeof value === "string"
          ? value.trim() !== ""
          : value !== undefined &&
            value !== null
    )
    .map(String);
}

export async function appendNote(
  applicationId: string,
  note: string
) {
  if (!note || !note.trim()) {
    throw new Error("Note cannot be empty");
  }

  const application = await getApplication(applicationId);

  if (!application) {
    throw new Error(
      `Application ${applicationId} does not exist`
    );
  }

  const row = application.rowIndex;

  const existingNotes =
    await getNote(applicationId);

  const nextColumn = columnToLetter(
    existingNotes.length + 1
  );

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAMES.NOTES}'!${nextColumn}${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[note.trim()]],
    },
  });

  return {
    success: true,
    applicationId,
    note: note.trim(),
    noteIndex: existingNotes.length + 1,
  };
}

export async function deleteNote(
  applicationId: string,
  noteIndex: number
) {
  if (
    !Number.isInteger(noteIndex) ||
    noteIndex < 1
  ) {
    throw new Error(
      "Note index must be a positive integer"
    );
  }

  const application = await getApplication(applicationId);

  if (!application) {
    throw new Error(
      `Application ${applicationId} does not exist`
    );
  }

  const row = application.rowIndex;

  const notes =
    await getNote(applicationId);

  if (noteIndex > notes.length) {
    throw new Error(
      `Note ${noteIndex} does not exist for application ${applicationId}`
    );
  }

  notes.splice(noteIndex - 1, 1);

  /*
   * Clear the previous note range completely.
   *
   * +2 gives us one extra column so stale data
   * cannot remain after deleting the last note.
   */
  const existingLastColumn = columnToLetter(
    Math.max(notes.length + 2, 1)
  );

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAMES.NOTES}'!A${row}:${existingLastColumn}${row}`,
    requestBody: {},
  });

  if (notes.length > 0) {
    const lastColumn = columnToLetter(
      notes.length
    );

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAMES.NOTES}'!A${row}:${lastColumn}${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [notes],
      },
    });
  }

  return {
    success: true,
    applicationId,
    deletedNoteIndex: noteIndex,
    remainingNotes: notes,
  };
}

/**
 * ============================================================
 * ADMIN DASHBOARD
 * ============================================================
 */

export type AdminDashboardData = {
  applications: Application[];
  stats: {
    total: number;
    pending: number;
    shortlisted: number;
    selected: number;
  };
  needsAttention: Application[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const applications =
    await getAllApplications();

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "Pending"
    );

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status === "Shortlisted"
    );

  const selectedApplications =
    applications.filter(
      (application) =>
        application.status === "Selected"
    );

  const needsAttention =
    [...pendingApplications]
      .sort((a, b) => {
        const timestampA =
          new Date(
            a.timestamp
          ).getTime();

        const timestampB =
          new Date(
            b.timestamp
          ).getTime();

        return timestampB - timestampA;
      })
      .slice(0, 5);

  return {
    applications,

    stats: {
      total: applications.length,
      pending:
        pendingApplications.length,
      shortlisted:
        shortlistedApplications.length,
      selected:
        selectedApplications.length,
    },

    needsAttention,
  };
}

/**
 * ============================================================
 * APPLICATION BY EMAIL
 * ============================================================
 */

export async function getApplicationByEmail(
  email: string
): Promise<Application | null> {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const applications =
    await getAllApplications();

  return (
    applications.find(
      (application) => {
        const universityEmail =
          application.universityEmail
            ?.trim()
            .toLowerCase();

        const personalEmail =
          application.personalEmail
            ?.trim()
            .toLowerCase();

        return (
          universityEmail ===
            normalizedEmail ||
          personalEmail ===
            normalizedEmail
        );
      }
    ) ?? null
  );
}

/**
 * ============================================================
 * APPLICATION VIEW HELPERS
 * ============================================================
 */

function formatPreferredRoleForView(
  value: string
): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  const roles: Record<string, string> = {
    backend: "Backend Development",
    "backend developer": "Backend Development",
    "backend development": "Backend Development",

    frontend: "Frontend Development",
    "frontend developer": "Frontend Development",
    "frontend development": "Frontend Development",

    "full stack": "Full Stack Development",
    "full stack developer": "Full Stack Development",
    "full stack development": "Full Stack Development",

    cloud: "Cloud / DevOps",
    devops: "Cloud / DevOps",
    "cloud devops": "Cloud / DevOps",

    ml: "Machine Learning",
    "machine learning": "Machine Learning",

    ai: "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",

    data: "Data / Analytics",
    "data science": "Data / Analytics",
    analytics: "Data / Analytics",

    cybersecurity: "Cybersecurity",
    security: "Cybersecurity",

    mobile: "Mobile Development",
    "mobile development": "Mobile Development",

    ui: "UI / UX Design",
    ux: "UI / UX Design",
    "ui ux": "UI / UX Design",
    "ui/ux": "UI / UX Design",
    design: "UI / UX Design",
  };

  if (roles[normalized]) {
    return roles[normalized];
  }

  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

function formatRoleAnswerKey(
  key: string
): string {
  const normalized = key
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  const labels: Record<string, string> = {
    why: "Why do you want to join?",
    reason: "Why do you want to join?",
    "why join": "Why do you want to join?",
    "why join us": "Why do you want to join?",

    experience: "Experience",
    "relevant experience": "Relevant Experience",

    skills: "Skills",
    "technical skills": "Technical Skills",

    projects: "Projects",
    "relevant projects": "Relevant Projects",

    contribution: "How can you contribute?",
    "how can you contribute":
      "How can you contribute?",

    motivation: "Motivation",

    availability: "Availability",

    "github profile": "GitHub Profile",
    "linkedin profile": "LinkedIn Profile",
  };

  if (labels[normalized]) {
    return labels[normalized];
  }

  return key
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

export async function getApplicationForView(
  applicationId: string
): Promise<Application | null> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAMES.APPLICATIONS}'!A:W`,
  });

  const rows = response.data.values ?? [];

  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];

    if (row[0]?.trim() !== applicationId.trim()) {
      continue;
    }

    const sheetRow = index + 1;

    const application = mapApplication(row, sheetRow);

    let roleAnswers: Record<string, string> = {};

    if (row[18]?.trim()) {
      try {
        const parsed = JSON.parse(row[18]);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          roleAnswers = Object.fromEntries(
            Object.entries(parsed).map(([key, value]) => [
              formatRoleAnswerKey(key),
              String(value ?? ""),
            ])
          );
        }
      } catch {
        roleAnswers = {};
      }
    }

    return {
      ...application,
      preferredRole: formatPreferredRoleForView(row[15] ?? ""),
      roleAnswers,
    };
  }

  return null;
}