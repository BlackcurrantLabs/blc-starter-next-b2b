---
trigger: model_decision
description: Rules for state managememt
---

Don't use 3rd party liblaries for state mamagement.
Use context providers, they are enough for this project.

The currently logged in user state should be accessible with better-auth & better-auth-ui elements.

# Client Side

import { authClient } from "@/lib/auth-client" // import the auth client

const {
data: session,
isPending, //loading state
error, //error object
refetch //refetch the session
} = authClient.useSession()

OR

const { data: session, error } = await authClient.getSession()

# Server Side

import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
const session = await auth.api.getSession({
headers: await headers() // you need to pass the headers object.
})
