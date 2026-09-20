import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import {
  getApplicationByEmail,
  getApplicationForView,
} from "@/lib/sheet";

import { MyApplicationView } from "@/components/applications/ViewMyApplication";

type Props = {
  params: Promise<{
    applicationId: string;
  }>;
};

export default async function MyApplicationPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.toLowerCase() !== "member") {
    redirect("/dashboard");
  }

  const { applicationId } = await params;

  const application = await getApplicationForView(applicationId);

  if (!application) {
    notFound();
  }

  const ownApplication =
    await getApplicationByEmail(user.email);

  if (
    !ownApplication ||
    ownApplication.applicationId !== applicationId
  ) {
    notFound();
  }

  return (
    <MyApplicationView
      application={application}
    />
  );
}