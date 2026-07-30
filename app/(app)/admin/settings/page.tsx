import { redirect } from "next/navigation";

// The avatar menu's "Settings" links to /<role>/settings for every role. Admin
// settings live across Profile / Campuses / Security — Profile is the hub, so
// send admins there rather than 404-ing.
export default function AdminSettingsRedirect() {
  redirect("/admin/profile");
}
