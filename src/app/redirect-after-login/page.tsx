import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectAfterLogin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return redirect("/account/settings");
}
