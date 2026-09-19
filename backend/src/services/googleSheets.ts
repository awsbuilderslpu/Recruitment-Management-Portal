import { GoogleAuth } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { Application, Note, RoleAnswers } from '../types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return google.sheets({ version: 'v4', auth });
}

export function getApplicationRowNumber(applicationId: string): number | null {
  const match = applicationId.match(/(\d+)$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (isNaN(num) || num < 1) return null;
  return num + 1; // header row is row 1, first application is row 2
}

export async function getApplicationById(
  applicationId: string
): Promise<Application | null> {
  const rowNumber = getApplicationRowNumber(applicationId);
  if (!rowNumber) return null;

  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      `${sheetName}!1:1`,
      `${sheetName}!A${rowNumber}:Z${rowNumber}`,
    ],
  });

  const header = response.data.valueRanges?.[0]?.values?.[0] || [];
  const row = response.data.valueRanges?.[1]?.values?.[0] || [];

  if (row.length === 0) return null;

  const app = parseRow(header, row, rowNumber);

  if (app.applicationId !== applicationId) return null;

  return app;
}

export async function getAllApplications(): Promise<Application[]> {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  const rows = response.data.values || [];
  if (rows.length < 2) return [];

  const [header, ...dataRows] = rows;
  return dataRows.map((row, index) => parseRow(header, row, index + 2));
}

function parseRow(header: string[], row: any[], sheetRowNumber: number): Application {
  const get = (columnName: string): string => {
    const colIndex = header.findIndex(
      (h) => h?.toString().trim().toLowerCase() === columnName.toLowerCase()
    );
    return colIndex >= 0 ? (row[colIndex]?.toString() ?? '') : '';
  };

  const rawRoleAnswers =
    get('Role Answers (JSON)') || get('Role Answers') || '{}';

  let roleAnswers: RoleAnswers = {};
  try {
    roleAnswers = JSON.parse(rawRoleAnswers);
  } catch {
    roleAnswers = {};
  }

  return {
    applicationId: get('Application ID'),
    timestamp: get('Timestamp'),
    status: (get('Status') || 'Pending') as Application['status'],
    fullName: get('Full Name'),
    registrationNumber: get('Registration No.') || get('Registration Number'),
    universityEmail: get('University Email'),
    personalEmail: get('Personal Email'),
    phone: get('Phone'),
    program: get('Program'),
    branch: get('Branch'),
    semester: get('Semester'),
    cgpa: get('CGPA'),
    linkedin: get('LinkedIn'),
    github: get('GitHub'),
    portfolio: get('Portfolio'),
    preferredRole: get('Preferred Role'),
    resumeUrl: get('Resume URL') || get('Resume'),
    resumeFileId: get('Resume File ID'),
    roleAnswers,
    ipAddress: get('IP Address'),
    communities: get('Communities'),
    achievement: get('Achievement'),
    whyJoin: get('Why Join'),
    rowIndex: sheetRowNumber,
  };
}

export async function updateApplicationStatus(
  rowIndex: number,
  newStatus: string
): Promise<void> {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });
  const header = headerResponse.data.values?.[0] || [];
  const statusColIndex = header.findIndex(
    (h) => h?.toString().trim().toLowerCase() === 'status'
  );

  if (statusColIndex < 0) throw new Error('Status column not found');

  const columnLetter = columnIndexToLetter(statusColIndex);
  const range = `${sheetName}!${columnLetter}${rowIndex}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[newStatus]] },
  });
}

export async function getNotesForApplication(
  applicationId: string
): Promise<Note[]> {
  const rowNumber = getApplicationRowNumber(applicationId);
  if (!rowNumber) return [];

  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      `${sheetName}!1:1`,
      `${sheetName}!A${rowNumber}:ZZ${rowNumber}`,
    ],
  });

  const header = response.data.valueRanges?.[0]?.values?.[0] || [];
  const row = response.data.valueRanges?.[1]?.values?.[0] || [];

  const notes: Note[] = [];

  header.forEach((h, idx) => {
    const headerName = h?.toString().trim() ?? '';
    if (!/^Note \d+$/i.test(headerName)) return;

    const cellValue = row[idx]?.toString().trim();
    if (!cellValue) return;

    const parts = cellValue.split('|').map((p:any) => p.trim());
    if (parts.length < 3) return;

    const [timestamp, author, ...noteParts] = parts;
    notes.push({
      timestamp,
      applicationId,
      author,
      note: noteParts.join(' | ').trim(),
      rowIndex: rowNumber,
    });
  });

  return notes;
}

export async function addNote(
  applicationId: string,
  author: string,
  note: string
): Promise<Note> {
  const rowNumber = getApplicationRowNumber(applicationId);
  if (!rowNumber) throw new Error('Invalid application ID');

  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      `${sheetName}!1:1`,
      `${sheetName}!A${rowNumber}:ZZ${rowNumber}`,
    ],
  });

  const header = response.data.valueRanges?.[0]?.values?.[0] || [];
  const row = response.data.valueRanges?.[1]?.values?.[0] || [];

  const noteColumns = header
    .map((h, idx) => ({ name: h?.toString().trim() ?? '', idx }))
    .filter((c) => /^Note \d+$/i.test(c.name))
    .sort((a, b) => {
      const na = parseInt(a.name.match(/\d+/)?.[0] ?? '0', 10);
      const nb = parseInt(b.name.match(/\d+/)?.[0] ?? '0', 10);
      return na - nb;
    });

  if (noteColumns.length === 0) {
    throw new Error('No "Note N" columns found in sheet header');
  }

  const target = noteColumns.find((col) => {
    const v = row[col.idx]?.toString().trim();
    return !v;
  });

  if (!target) {
    throw new Error(
      `All note columns are full for ${applicationId}. Add more "Note N" columns.`
    );
  }

  const timestamp = new Date().toISOString();
  const value = `${timestamp} | ${author} | ${note}`;
  const columnLetter = columnIndexToLetter(target.idx);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!${columnLetter}${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[value]] },
  });

  return { timestamp, applicationId, author, note, rowIndex: rowNumber };
}

function columnIndexToLetter(index: number): string {
  let letter = '';
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode((i % 26) + 65) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}
