import { redirect, RedirectType } from "next/navigation";

export default async function AdminRootPage() {
  redirect("/admin/dashboard", RedirectType.replace);
}
