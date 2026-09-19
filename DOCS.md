# AWS Cloud Club LPU — Recruitment Management Portal (AWSLPU-RMP)
## API & Routing Documentation

> **Document Version:** 1.0.0  
> **Framework:** Next.js (App Router) + TypeScript + Google Sheets API v4  
> **Base URL (Local):** `http://localhost:3000`  
> **Base URL (Production):** `https://<your-domain>` (Protected by Cloudflare Access)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Route Summary Table](#route-summary-table)
3. [API Endpoints Reference](#api-endpoints-reference)
   - [1. List Applications (`GET /api/applications`)](#1-list-applications-get-apiapplications)
   - [2. Get Application by ID (`GET /api/applications/:id`)](#2-get-application-by-id-get-apiapplicationsid)
   - [3. Update Application Status (`PATCH /api/applications/:id/status`)](#3-update-application-status-patch-apiapplicationsidstatus)
   - [4. Get Application Notes (`GET /api/applications/:id/notes`)](#4-get-application-notes-get-apiapplicationsidnotes)
   - [5. Add Application Note (`POST /api/applications/:id/notes`)](#5-add-application-note-post-apiapplicationsidnotes)
4. [Frontend Application Routes](#frontend-application-routes)
5. [Data Models & Types](#data-models--types)
6. [Google Sheets Storage Architecture](#google-sheets-storage-architecture)
7. [Environment Variables Reference](#environment-variables-reference)
8. [Frontend Integration Code Examples](#frontend-integration-code-examples)

---

## Overview

The Recruitment Management Portal (AWSLPU-RMP) is an administrative portal used by the AWS Cloud Club LPU core team to review applicant registrations, filter and search candidates, inspect custom role responses, update application statuses, and add reviewer notes.

Data is stored directly in **Google Sheets** using the Google Sheets API v4 with a service account, ensuring server-side security without exposing service account credentials to the client.

---

## Route Summary Table

### Server API Routes (`/app/api/...`)

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | List applications with search, filter, and sorting | `200`, `500` |
| `GET` | `/api/applications/:id` | Get full details of a specific application | `200`, `404`, `500` |
| `PATCH` | `/api/applications/:id/status` | Update candidate recruitment status | `200`, `400`, `404`, `500` |
| `GET` | `/api/applications/:id/notes` | Get all evaluator/reviewer notes for an applicant | `200`, `404`, `500` |
| `POST` | `/api/applications/:id/notes` | Add a new reviewer note for an applicant | `201`, `400`, `404`, `500` |

### Client-Side Page Routes (`/app/...`)

| Route Path | File Location | Status / Owner | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Active | Landing / Welcome page |
| `/dashboard` | `app/dashboard/page.tsx` | Planned (Person 2) | Applications table/grid with real-time search, filters, sorting & status badges |
| `/applications/:id` | `app/applications/[id]/page.tsx` | Planned (Person 3) | Candidate detailed profile, dynamic role questions/answers, notes feed & status selector |

---

## API Endpoints Reference

### 1. List Applications (`GET /api/applications`)

Retrieves all applicant submissions from the Google Sheet. Supports server-side search querying, status filtering, and sorting by submission date.

- **URL:** `/api/applications`
- **Method:** `GET`
- **Auth Required:** Yes (via Cloudflare Access in production)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `search` | `string` | No | `""` | Case-insensitive substring search matching against `fullName`, `registrationNumber`, or `universityEmail`. |
| `status` | `string` | No | `""` | Filter by application status (`Pending`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`). |
| `sort` | `string` | No | `timestamp_desc` | Sort order: `timestamp_desc` (newest first) or `timestamp_asc` (oldest first). |

#### Example Requests
```bash
# Get all applications (default sorted newest first)
curl -X GET "http://localhost:3000/api/applications"

# Search for a candidate by name, reg number, or email
curl -X GET "http://localhost:3000/api/applications?search=faizan"

# Filter by status and sort ascending
curl -X GET "http://localhost:3000/api/applications?status=Shortlisted&sort=timestamp_asc"
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "applicationId": "AWS-2026-DEMO-0001",
      "timestamp": "2026-09-17T10:00:00.000Z",
      "status": "Pending",
      "fullName": "Alex Johnson",
      "registrationNumber": "12204567",
      "universityEmail": "alex.12204567@lpu.in",
      "personalEmail": "alex.johnson@example.com",
      "phone": "+91 9876543210",
      "program": "B.Tech CSE",
      "branch": "Computer Science and Engineering",
      "semester": "5",
      "cgpa": "8.85",
      "linkedin": "https://linkedin.com/in/alexjohnson",
      "github": "https://github.com/alexjohnson",
      "portfolio": "https://alexjohnson.dev",
      "preferredRole": "Cloud Architecture Lead",
      "resumeUrl": "https://drive.google.com/file/d/...",
      "resumeFileId": "1a2b3c4d5e...",
      "roleAnswers": {
        "experience": "2 years with AWS EC2 & S3",
        "certifications": ["AWS Certified Cloud Practitioner"]
      },
      "ipAddress": "192.168.1.1",
      "communities": "AWS Cloud Club, GDG",
      "achievement": "1st place in Cloud Hackathon 2025",
      "whyJoin": "Want to mentor juniors and build scalable community projects.",
      "rowIndex": 2
    }
  ]
}
```

#### Error Response (`500 Internal Server Error`)
```json
{
  "success": false,
  "error": "Failed to fetch applications",
  "details": "The caller does not have permission"
}
```

---

### 2. Get Application by ID (`GET /api/applications/:id`)

Fetches a single candidate's complete record by their unique Application ID. Employs optimized direct-row calculation based on numerical ID suffixes.

- **URL:** `/api/applications/:id`
- **Method:** `GET`
- **URL Params:** `id=[string]` (e.g., `AWS-2026-DEMO-0001` or `AWS-2026-0001`)

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/applications/AWS-2026-DEMO-0001"
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "applicationId": "AWS-2026-DEMO-0001",
    "timestamp": "2026-09-17T10:00:00.000Z",
    "status": "Pending",
    "fullName": "Alex Johnson",
    "registrationNumber": "12204567",
    "universityEmail": "alex.12204567@lpu.in",
    "personalEmail": "alex.johnson@example.com",
    "phone": "+91 9876543210",
    "program": "B.Tech CSE",
    "branch": "Computer Science and Engineering",
    "semester": "5",
    "cgpa": "8.85",
    "linkedin": "https://linkedin.com/in/alexjohnson",
    "github": "https://github.com/alexjohnson",
    "portfolio": "https://alexjohnson.dev",
    "preferredRole": "Cloud Architecture Lead",
    "resumeUrl": "https://drive.google.com/file/d/...",
    "resumeFileId": "1a2b3c4d5e...",
    "roleAnswers": {
      "technicalQuestion1": "Implemented serverless REST APIs using AWS Lambda and DynamoDB.",
      "yearsOfExperience": 2
    },
    "ipAddress": "192.168.1.1",
    "communities": "AWS Cloud Club, GDG",
    "achievement": "1st place in Cloud Hackathon 2025",
    "whyJoin": "Want to mentor juniors and build scalable community projects.",
    "rowIndex": 2
  }
}
```

#### Error Responses
- **`404 Not Found`** (Application not found or row mismatch):
  ```json
  {
    "success": false,
    "error": "Application not found"
  }
  ```
- **`500 Internal Server Error`**:
  ```json
  {
    "success": false,
    "error": "Failed to fetch application",
    "details": "Error details"
  }
  ```

---

### 3. Update Application Status (`PATCH /api/applications/:id/status`)

Updates an applicant's evaluation status. Directly updates the target cell in the "Status" column of the Google Sheet.

- **URL:** `/api/applications/:id/status`
- **Method:** `PATCH`
- **Headers:** `Content-Type: application/json`
- **URL Params:** `id=[string]` (e.g., `AWS-2026-DEMO-0001`)

#### Permitted Status Values
The value must strictly match one of the following 5 statuses:
- `Pending`
- `Shortlisted`
- `Interview Scheduled`
- `Selected`
- `Rejected`

#### Request Body
```json
{
  "status": "Shortlisted"
}
```

#### Example Request
```bash
curl -X PATCH "http://localhost:3000/api/applications/AWS-2026-DEMO-0001/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "Shortlisted"}'
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Status updated to \"Shortlisted\"",
  "applicationId": "AWS-2026-DEMO-0001",
  "newStatus": "Shortlisted"
}
```

#### Error Responses
- **`400 Bad Request`** (Invalid or missing status):
  ```json
  {
    "success": false,
    "error": "Invalid status. Must be one of: Pending, Shortlisted, Interview Scheduled, Selected, Rejected"
  }
  ```
- **`404 Not Found`**:
  ```json
  {
    "success": false,
    "error": "Application not found"
  }
  ```
- **`500 Internal Server Error`**:
  ```json
  {
    "success": false,
    "error": "Failed to update status",
    "details": "Status column not found"
  }
  ```

---

### 4. Get Application Notes (`GET /api/applications/:id/notes`)

Retrieves all notes written by reviewers for a specific applicant. Notes are read dynamically from per-application `Note 1`, `Note 2`, ... columns on that applicant's row.

- **URL:** `/api/applications/:id/notes`
- **Method:** `GET`
- **URL Params:** `id=[string]` (e.g., `AWS-2026-DEMO-0001`)

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/applications/AWS-2026-DEMO-0001/notes"
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "timestamp": "2026-09-17T11:20:00.000Z",
      "applicationId": "AWS-2026-DEMO-0001",
      "author": "Faizan",
      "note": "Resume screened. High proficiency with Docker and AWS.",
      "rowIndex": 2
    },
    {
      "timestamp": "2026-09-17T14:15:30.000Z",
      "applicationId": "AWS-2026-DEMO-0001",
      "author": "Technical Lead",
      "note": "Cleared Round 1 interview. Scheduled for core panel.",
      "rowIndex": 2
    }
  ]
}
```

#### Error Responses
- **`404 Not Found`**:
  ```json
  {
    "success": false,
    "error": "Application not found"
  }
  ```
- **`500 Internal Server Error`**:
  ```json
  {
    "success": false,
    "error": "Failed to fetch notes",
    "details": "Error message"
  }
  ```

---

### 5. Add Application Note (`POST /api/applications/:id/notes`)

Appends a new note to the application record. It automatically locates the first empty `Note N` column in the candidate's row and writes: `<timestamp> | <author> | <note>`.

- **URL:** `/api/applications/:id/notes`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **URL Params:** `id=[string]` (e.g., `AWS-2026-DEMO-0001`)

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `author` | `string` | Yes | Name or identifier of reviewer/interviewer submitting the note |
| `note` | `string` | Yes | Body of the note / evaluation remarks |

```json
{
  "author": "Faizan",
  "note": "Great problem-solving skills in system design interview."
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/applications/AWS-2026-DEMO-0001/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Faizan",
    "note": "Great problem-solving skills in system design interview."
  }'
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Note added",
  "data": {
    "timestamp": "2026-09-17T16:45:12.345Z",
    "applicationId": "AWS-2026-DEMO-0001",
    "author": "Faizan",
    "note": "Great problem-solving skills in system design interview.",
    "rowIndex": 2
  }
}
```

#### Error Responses
- **`400 Bad Request`** (Missing required fields):
  ```json
  {
    "success": false,
    "error": "Note text is required"
  }
  ```
  or
  ```json
  {
    "success": false,
    "error": "Author is required"
  }
  ```
- **`404 Not Found`**:
  ```json
  {
    "success": false,
    "error": "Application not found"
  }
  ```
- **`500 Internal Server Error`** (e.g., Note columns capacity exceeded):
  ```json
  {
    "success": false,
    "error": "Failed to add note",
    "details": "All note columns are full for AWS-2026-DEMO-0001. Add more \"Note N\" columns."
  }
  ```

---

## Frontend Application Routes

The Next.js App Router defines client-side views. Below is the route architecture:

### 1. Root Landing Page (`/`)
- **File:** `app/page.tsx`
- **Role:** Welcome/Home screen.

### 2. Candidate Dashboard (`/dashboard`)
- **File:** `app/dashboard/page.tsx` (Assigned: Person 2)
- **Features:**
  - Responsive table and grid view of all applicants.
  - Search bar across Name, Reg No, Email with debounce.
  - Multi-select filters:
    - Status: `Pending`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`
    - Preferred Role
    - Program / Branch
  - Sorting: Submission Date (asc/desc), Name, Status.
  - Direct status changer dropdown per row.
  - Direct link to detail view: `/applications/:id`.

### 3. Application Details View (`/applications/:id`)
- **File:** `app/applications/[id]/page.tsx` (Assigned: Person 3)
- **Features:**
  - Complete candidate details view (Personal info, Academic info, Links).
  - Dynamic Role Answers viewer: Automatically parses and displays arbitrary question/answer pairs from JSON.
  - Reviewer Notes feed (`GET /api/applications/:id/notes`) and new note submission form (`POST /api/applications/:id/notes`).
  - Status update controller (`PATCH /api/applications/:id/status`).
  - Context-preserving Previous / Next applicant pagination.

---

## Data Models & Types

All core interfaces are located in [`lib/types.ts`](file:///d:/Dev/Recruitment-Management-Portal/lib/types.ts):

```typescript
export type ApplicationStatus =
  | 'Pending'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export type RoleAnswerValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export type RoleAnswers = Record<string, RoleAnswerValue>;

export interface Application {
  applicationId: string;       // e.g. "AWS-2026-DEMO-0001"
  timestamp: string;           // ISO format or submission string
  status: ApplicationStatus;   // Current evaluation status
  fullName: string;            // Candidate full name
  registrationNumber: string;  // LPU Registration number
  universityEmail: string;     // e.g. name.12204567@lpu.in
  personalEmail: string;       // Personal email address
  phone: string;               // Contact phone number
  program: string;             // e.g. "B.Tech CSE"
  branch: string;              // e.g. "Computer Science and Engineering"
  semester: string;            // e.g. "5"
  cgpa: string;                // e.g. "8.85"
  linkedin: string;            // Profile URL
  github: string;              // Profile URL
  portfolio: string;           // Website / Portfolio URL
  preferredRole: string;       // Selected role applied for
  resumeUrl: string;           // Google Drive or external link
  resumeFileId: string;        // Drive file ID
  roleAnswers: RoleAnswers;    // Parsed JSON of role-specific answers
  ipAddress: string;           // Submission IP address
  communities: string;         // Other clubs/societies joined
  achievement: string;         // Past achievements
  whyJoin: string;             // Statement of intent
  rowIndex: number;            // 1-based index in the Google Sheet
}

export interface Note {
  timestamp: string;           // ISO timestamp of note creation
  applicationId: string;       // Target application ID
  author: string;              // Reviewer name
  note: string;                // Note content
  rowIndex: number;            // Row index in sheet
}
```

---

## Google Sheets Storage Architecture

### Column Mapping in Spreadsheet (`Sheet1`)

The backend automatically parses columns case-insensitively using header names:

| Header Name | Type | Notes |
| :--- | :--- | :--- |
| `Application ID` | String | e.g., `AWS-2026-DEMO-0001` |
| `Timestamp` | String / Date | Submission timestamp |
| `Status` | String | Must match one of 5 valid statuses |
| `Full Name` | String | Applicant full name |
| `Registration No.` / `Registration Number` | String | Unique student registration number |
| `University Email` | String | LPU student email |
| `Personal Email` | String | Personal contact email |
| `Phone` | String | Contact telephone |
| `Program` | String | Degree program |
| `Branch` | String | Department / Branch |
| `Semester` | String | Current semester |
| `CGPA` | String | Current academic CGPA |
| `LinkedIn` | String | Profile link |
| `GitHub` | String | Profile link |
| `Portfolio` | String | Portfolio URL |
| `Preferred Role` | String | Position applied for |
| `Resume URL` / `Resume` | String | Viewable link to resume |
| `Resume File ID` | String | Google Drive File ID |
| `Role Answers (JSON)` / `Role Answers` | JSON String | Dynamically parsed into `roleAnswers` object |
| `IP Address` | String | Client IP during submission |
| `Communities` | String | Affiliations & communities |
| `Achievement` | String | Highlighted accomplishments |
| `Why Join` | String | Motivational statement |
| `Note 1`, `Note 2`, ... `Note N` | Pipe-delimited String | Format: `<timestamp> \| <author> \| <note text>` |

---

## Environment Variables Reference

Configure these in your local [`.env.local`](file:///d:/Dev/Recruitment-Management-Portal/.env.local) file. **Never commit `.env.local` to version control.**

| Variable | Required | Example / Description |
| :--- | :--- | :--- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | `recruitment-service@<project-id>.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Yes | `"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...==\n-----END PRIVATE KEY-----\n"` |
| `GOOGLE_SPREADSHEET_ID` | Yes | Spreadsheet ID found in the Google Sheets URL |
| `GOOGLE_SHEET_NAME` | No | Defaults to `Sheet1` if not provided |

---

## Frontend Integration Code Examples

These lightweight fetch helper functions can be used directly across your React components.

### 1. Fetch All Applications (with Search & Status Filter)
```typescript
export async function fetchApplications(options?: {
  search?: string;
  status?: string;
  sort?: 'timestamp_desc' | 'timestamp_asc';
}) {
  const params = new URLSearchParams();
  if (options?.search) params.set('search', options.search);
  if (options?.status) params.set('status', options.status);
  if (options?.sort) params.set('sort', options.sort);

  const res = await fetch(`/api/applications?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch applications');
  }
  const json = await res.json();
  return json.data; // Array of Application
}
```

### 2. Fetch Single Application Details
```typescript
export async function fetchApplicationById(applicationId: string) {
  const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch application');
  }
  const json = await res.json();
  return json.data; // Application object
}
```

### 3. Update Application Status
```typescript
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected'
) {
  const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update status');
  }
  return await res.json();
}
```

### 4. Fetch Reviewer Notes
```typescript
export async function fetchNotes(applicationId: string) {
  const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}/notes`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch notes');
  }
  const json = await res.json();
  return json.data; // Array of Note
}
```

### 5. Add Reviewer Note
```typescript
export async function addNote(
  applicationId: string,
  author: string,
  note: string
) {
  const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, note }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add note');
  }
  return await res.json();
}
```
