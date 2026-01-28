"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ContactQuery = {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date | string;
};

type ContactReply = {
  id: string;
  message: string;
  sentBy: string;
  createdAt: Date | string;
};

type QueryDetail = ContactQuery & {
  replies: ContactReply[];
};

interface QueriesClientPageProps {
  initialQueries: ContactQuery[];
}

export default function QueriesClientPage({
  initialQueries,
}: QueriesClientPageProps) {
  const [queries, setQueries] = useState<ContactQuery[]>(initialQueries);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<QueryDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const selectedQuery = queries.find((q) => q.id === selectedId);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  const handleSelectQuery = async (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setLoadingDetail(true);
    setDetail(null);

    try {
      const res = await fetch(`/api/admin/queries/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setDetail({ ...data.query, replies: data.replies });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load query details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedId) return;

    setQueries((prev) =>
      prev.map((q) => (q.id === selectedId ? { ...q, status: newStatus } : q))
    );
    if (detail) {
      setDetail({ ...detail, status: newStatus });
    }

    try {
      const res = await fetch(`/api/admin/queries/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="h-[calc(100vh-var(--header-height)-2rem)] border rounded-lg overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={33} minSize={25} maxSize={50}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Queries
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {queries.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No queries found.
                </div>
              ) : (
                <div className="flex flex-col">
                  {queries.map((query) => (
                    <button
                      key={query.id}
                      onClick={() => handleSelectQuery(query.id)}
                      className={cn(
                        "flex flex-col gap-2 p-4 text-left border-b hover:bg-muted/50 transition-colors",
                        selectedId === query.id && "bg-muted",
                        query.status === "unread" && "font-medium"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate text-sm font-semibold">
                          {query.email}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDate(query.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-foreground/80">
                          {query.subject}
                        </span>
                        {query.status === "unread" && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            query.status === "unread"
                              ? "default"
                              : query.status === "read"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] h-5 px-2"
                        >
                          {query.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={67}>
          <div className="h-full flex flex-col bg-background/50">
            {!selectedId ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                <p>Select a query to view details</p>
              </div>
            ) : loadingDetail ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : detail ? (
              <>
                <div className="p-6 border-b flex items-start justify-between bg-background">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">{detail.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{detail.email}</span>
                      <span>•</span>
                      <span>
                        {formatDateTime(detail.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {detail.status !== "read" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus("read")}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    {detail.status === "read" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus("unread")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Mark as Unread
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {detail.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Original Message</p>
                      </div>
                    </div>
                    <div className="pl-11">
                      <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed border">
                        {detail.message}
                      </div>
                    </div>
                  </div>

                  {detail.replies && detail.replies.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Conversation History
                        </h3>
                        {detail.replies.map((reply) => (
                          <div key={reply.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {reply.sentBy}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(reply.createdAt)}
                              </span>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap">
                              {reply.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Failed to load details
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
