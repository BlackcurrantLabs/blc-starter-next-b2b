import { prisma } from "@/app/database";
import QueriesClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminQueriesPage() {
  const queries = await prisma.contactQuery.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      subject: true,
      message: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Contact Queries</h1>
        <p className="text-muted-foreground">
          Manage and respond to user inquiries.
        </p>
      </div>
      <QueriesClientPage initialQueries={queries} />
    </div>
  );
}
