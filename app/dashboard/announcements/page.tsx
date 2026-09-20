import { redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth";
import { getAllAnnouncements } from "@/lib/sheet";
import { AnnouncementManager } from "@/components/announcements/AnnouncementManager";

export default async function AnnouncementsPage() {
  const auth = await requireAdminAccess();

  if (!auth.authorized) {
    redirect("/login");
  }

  const announcements = await getAllAnnouncements();

  return (
    <AnnouncementManager
      initialAnnouncements={announcements}
    />
  );
}