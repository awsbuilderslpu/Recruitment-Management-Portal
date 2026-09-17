"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type RoleAnswerValue = string | number | boolean | string[] | null;

type Application = {
  applicationId: string;
  timestamp?: string;
  status?: string;
  fullName?: string;
  registrationNumber?: string;
  universityEmail?: string;
  personalEmail?: string;
  phone?: string;
  program?: string;
  branch?: string;
  semester?: string | number;
  cgpa?: string | number;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  preferredRole?: string;
  resumeUrl?: string;
  communities?: string | string[];
  achievement?: string;
  whyJoin?: string;
  roleAnswers?: Record<string, RoleAnswerValue>;
};

type Note = {
  timestamp: string;
  author: string;
  note: string;
  rowIndex?: number;
};

const fields = [
  ["Full Name", "fullName"],
  ["Registration Number", "registrationNumber"],
  ["Program", "program"],
  ["Branch", "branch"],
  ["Semester", "semester"],
  ["CGPA", "cgpa"],
  ["University Email", "universityEmail"],
  ["Personal Email", "personalEmail"],
  ["Phone", "phone"],
  ["Preferred Role", "preferredRole"],
  ["Communities", "communities"],
  ["Achievement", "achievement"],
  ["Why Join", "whyJoin"],
] as const;

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function formatValue(value: RoleAnswerValue | string | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

export default function ApplicationDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = params.id;
  const query = searchParams.toString();

  const [application, setApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");
  const [author, setAuthor] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/applications/${encodeURIComponent(id)}`);

        if (response.status === 404) {
          setError("Application not found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load application.");
        }

        const result = await response.json();
        setApplication(result.data ?? result);
      } catch {
        setError("Unable to load application. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id]);

  useEffect(() => {
    async function loadApplications() {
      try {
        const url = query
          ? `/api/applications?${query}`
          : "/api/applications";

        const response = await fetch(url);

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        setApplications(result.data ?? result);
      } catch {
        setApplications([]);
      }
    }

    loadApplications();
  }, [query]);

  useEffect(() => {
    async function loadNotes() {
      try {
        setNotesLoading(true);
        setNoteError("");

        const response = await fetch(
          `/api/applications/${encodeURIComponent(id)}/notes`
        );

        if (!response.ok) {
          throw new Error("Failed to load notes.");
        }

        const result = await response.json();
        setNotes(result.data ?? []);
      } catch {
        setNoteError("Unable to load notes.");
      } finally {
        setNotesLoading(false);
      }
    }

    loadNotes();
  }, [id]);

  async function addNote() {
    if (!author.trim() || !noteText.trim()) {
      setNoteError("Please enter both author and note.");
      return;
    }

    try {
      setAddingNote(true);
      setNoteError("");

      const response = await fetch(
        `/api/applications/${encodeURIComponent(id)}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: author.trim(),
            note: noteText.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add note.");
      }

      setNoteText("");

      const notesResponse = await fetch(
        `/api/applications/${encodeURIComponent(id)}/notes`
      );

      const result = await notesResponse.json();
      setNotes(result.data ?? []);
    } catch {
      setNoteError("Unable to add note. Please try again.");
    } finally {
      setAddingNote(false);
    }
  }

  function getApplicationUrl(applicationId: string) {
    return query
      ? `/applications/${encodeURIComponent(applicationId)}?${query}`
      : `/applications/${encodeURIComponent(applicationId)}`;
  }

  const currentIndex = applications.findIndex(
    (item) => item.applicationId === id
  );

  const previousApplication =
    currentIndex > 0 ? applications[currentIndex - 1] : null;

  const nextApplication =
    currentIndex >= 0 && currentIndex < applications.length - 1
      ? applications[currentIndex + 1]
      : null;

  const dashboardUrl = query ? `/dashboard?${query}` : "/dashboard";

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="h-40 rounded-xl bg-white shadow" />
          <div className="h-64 rounded-xl bg-white shadow" />
        </div>
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-gray-900">
            {error || "Application not found"}
          </h1>

          <button
            onClick={() => router.push(dashboardUrl)}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push(dashboardUrl)}
            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back to Dashboard
          </button>

          <div className="flex gap-2">
            <button
              disabled={!previousApplication}
              onClick={() =>
                previousApplication &&
                router.push(getApplicationUrl(previousApplication.applicationId))
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              disabled={!nextApplication}
              onClick={() =>
                nextApplication &&
                router.push(getApplicationUrl(nextApplication.applicationId))
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Application ID</p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {application.fullName || "Unnamed Candidate"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {application.applicationId}
              </p>
            </div>

            {application.status && (
              <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {application.status}
              </span>
            )}
          </div>
        </section>

        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Application Details
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map(([label, key]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {label}
                </p>

                <p className="mt-1 break-words text-sm text-gray-900">
                  {formatValue(application[key])}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {application.linkedin && (
              <a
                href={application.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                LinkedIn
              </a>
            )}

            {application.github && (
              <a
                href={application.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                GitHub
              </a>
            )}

            {application.portfolio && (
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Portfolio
              </a>
            )}

            {application.resumeUrl && (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                View Resume
              </a>
            )}
          </div>
        </section>

        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Role Answers
          </h2>

          {!application.roleAnswers ||
          Object.keys(application.roleAnswers).length === 0 ? (
            <p className="text-sm text-gray-500">
              No role-specific answers provided.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(application.roleAnswers).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {formatKey(key)}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-600">
                    {formatValue(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">Notes</h2>

          {notesLoading ? (
            <p className="text-sm text-gray-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            <div className="mb-6 space-y-4">
              {notes.map((item, index) => (
                <div
                  key={`${item.timestamp}-${index}`}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-gray-900">{item.author}</p>

                    <p className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          )}

          {noteError && (
            <p className="mb-4 text-sm text-red-600">{noteError}</p>
          )}

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Author
              </label>

              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Note
              </label>

              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Write a note about this candidate..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <button
              onClick={addNote}
              disabled={addingNote}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingNote ? "Adding..." : "Add Note"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}