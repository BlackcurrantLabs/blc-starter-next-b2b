import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type Column,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";

/**
 * Feature set shared by the data-table components in this folder.
 *
 * TanStack Table v9 only installs (and types) the APIs of features that are
 * registered explicitly, so every table rendered with these components must be
 * created with this registry:
 *
 *   const table = useTable({ features: dataTableFeatures, columns, data });
 *
 * The row models below process data on the client. For server-side processing
 * keep the features and set `manualPagination` / `manualSorting` /
 * `manualFiltering` on the table instead.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    // Used by DataTableFacetedFilter, whose filter value is an array.
    arrIncludesSome: filterFn_arrIncludesSome,
  },
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnVisibilityFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

/** Table instance returned by `useTable({ features: dataTableFeatures, ... })`. */
export type DataTable<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;

export type DataTableColumn<TData extends RowData, TValue = unknown> = Column<
  DataTableFeatures,
  TData,
  TValue
>;
