"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "./pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { type Pagination as PaginationMeta } from "@/lib/types";
import { EmptyComponent } from "@/components/admin/placeholder-component";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: PaginatedResponse<TData>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export function DataTable<TData, TValue>({
  columns,
  isPending,
  isError,
  error,
  data: tableData,
}: DataTableProps<TData, TValue>) {
  const { queryParams } = useRouterStuff();
  const {
    pagination = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    data = [],
  } = tableData || {};

  const paginationState: PaginationState = {
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
    },
    pageCount: pagination.totalPages,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="overflow-hidden **:data-[slot=table-container]:no-scrollbar rounded-2xl border">
        <Table className="text-base">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-sidebar">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-4 px-4 font-medium text-sm uppercase text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0 text-center">
                  {isPending ? (
                    <div className="h-1 bg-primary mb-36 animate-pulse rounded-full"></div>
                  ) : isError ? (
                    <EmptyComponent variant="error" title={error?.message} />
                  ) : (
                    <EmptyComponent variant="empty" />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isPending && !isError && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={(page) =>
            queryParams({ set: { page: page.toString() } })
          }
        />
      )}
    </div>
  );
}
