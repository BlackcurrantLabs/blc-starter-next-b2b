import { redirect, RedirectType } from "next/navigation";

export default function AccountRootPage() {
  redirect("/account/dashboard", RedirectType.replace);
}
