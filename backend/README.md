# Backend API Server - AWSLPU-RMP

This folder contains the completely isolated Backend Service for the AWS Cloud Club LPU Recruitment Management Portal. 

It exposes REST API endpoints that read and write directly to Google Sheets using the Google Sheets API v4.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in this `backend` folder and add your credentials:
   ```env
   PORT=4000
   GOOGLE_SERVICE_ACCOUNT_EMAIL=recruitment-service@<project-id>.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
   GOOGLE_SHEET_NAME=Sheet1
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:4000`.

## API Endpoints

- `GET /api/applications` - List all applications (supports `?search`, `?status`, `?sort`).
- `GET /api/applications/:id` - Get details of a single applicant.
- `PATCH /api/applications/:id/status` - Update an applicant's status.
- `GET /api/applications/:id/notes` - Get reviewer notes for an applicant.
- `POST /api/applications/:id/notes` - Add a reviewer note.

(Detailed request/response documentation can be found in the root `DOCS.md` file.)

## Development

- Built with Node.js, Express, and TypeScript.
- To build for production, run `npx tsc`.
