import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <Skeleton className="h-10 w-64" />

        {/* Feedback Source Filter */}
        <Skeleton className="h-10 w-40" />

        {/* Add Client Button */}
        <Skeleton className="ml-auto h-10 w-32" />
      </div>

      {/* Table Section */}
      <div className="rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 border-b bg-muted/50 p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-4 border-b p-4 last:border-b-0">
            {/* Name Column */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Company Column */}
            <Skeleton className="h-5 w-24" />

            {/* Feedback Source Column */}
            <Skeleton className="h-5 w-20" />

            {/* Iterations Column */}
            <Skeleton className="h-5 w-12" />

            {/* Feedbacks Column */}
            <Skeleton className="h-5 w-12" />

            {/* Campaigns Column */}
            <Skeleton className="h-5 w-12" />

            {/* Created At Column */}
            <Skeleton className="h-5 w-24" />

            {/* Open Column (External Link) */}
            <Skeleton className="h-5 w-6" />
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between">
        {/* Rows Per Page Selector */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-16" />
        </div>

        {/* Page Info */}
        <Skeleton className="h-6 w-20" />

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}
