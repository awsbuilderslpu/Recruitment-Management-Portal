import { notFound, redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth";
import {
  getApplicationForView,
  getNote,
} from "@/lib/sheet";

import { ApplicationView } from "@/components/applications/ApplicationView";

type Props = {
  params: Promise<{
    applicationId: string;
  }>;
};

export default async function ApplicationPage({
  params,
}: Props) {
  const auth = await requireAdminAccess();

  if (!auth.authorized) {
    redirect("/auth/login");
  }

  const { applicationId } = await params;

  const application = await getApplicationForView(applicationId);

  if (!application) {
    notFound();
  }

  const notes = await getNote(applicationId);

  return (
    <ApplicationView
      application={application}
      notes={notes}
    />
  );
}