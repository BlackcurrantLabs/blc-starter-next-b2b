import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectAfterLogin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // add redirect logic here

  return redirect("/account/settings");
}
