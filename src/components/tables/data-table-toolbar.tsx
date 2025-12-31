"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  tableActions?: React.ReactNode[];
}

export function DataTableToolbar<TData>({
  table,
  tableActions = [],
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [value, setValue] = useState(
    (table.getState().globalFilter as string) ?? "",
  );
  const debounced = useDebouncedCallback((value: string) => {
    table.setGlobalFilter(String(value));
  }, 500);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2 w-full">
        <div className="w-full md:w-auto md:order-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {tableActions.map((ta, i) => (
              <div key={i} className="w-full md:w-auto">
                {ta}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:flex-1 flex items-center gap-2 md:order-1">
          <div className="flex-1 md:flex-none min-w-0">
            <Input
              placeholder="Search..."
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                debounced(event.target.value);
              }}
              className="h-9 w-full md:w-[320px] bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {table
              .getAllColumns()
              .filter(
                (c) => c.getCanFilter() && c.columnDef.meta?.filterOptions,
              )
              .map((col) => (
                <div key={col.id} className="shrink-0 ">
                  <DataTableFacetedFilter
                    options={col.columnDef.meta!.filterOptions}
                    title={col.columnDef.meta!.filterTitle}
                    column={col}
                  />
                </div>
              ))}

            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.resetColumnFilters()}
                className="h-9 w-8 p-0"
                aria-label="Reset filters"
              >
                <X />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
