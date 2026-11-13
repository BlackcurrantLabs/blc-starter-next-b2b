import { RowData, Subscribe } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumn } from "./data-table-features";

interface DataTableColumnHeaderProps<TData extends RowData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: DataTableColumn<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    // Column objects keep the same identity between renders, so subscribe to
    // the sorting and visibility state to keep this header in sync.
    <Subscribe
      source={column.table.store}
      selector={(state) => [state.sorting, state.columnVisibility] as const}
    >
      {() => {
        const sorted = column.getIsSorted();

        return (
          <div className={cn("flex items-center gap-2", className)}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="data-[state=open]:bg-primary/30 data-[state=open]:text-primary-foreground -ml-3 h-8"
                >
                  <span>{title}</span>
                  {sorted === "desc" ? (
                    <ArrowDown />
                  ) : sorted === "asc" ? (
                    <ArrowUp />
                  ) : (
                    <ChevronsUpDown />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                  <ArrowUp />
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                  <ArrowDown />
                  Desc
                </DropdownMenuItem>
                {column.getCanHide() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                      <EyeOff />
                      Hide
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }}
    </Subscribe>
  );
}
