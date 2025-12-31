import { redirect, RedirectType } from "next/navigation";

export default function OrgRootPage() {
  redirect("/org/dashboard", RedirectType.replace);
}
