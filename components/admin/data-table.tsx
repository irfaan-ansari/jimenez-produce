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
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Pagination } from "./pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const { queryParams } = useRouterStuff();

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
                  <TableHead key={header.id} className="py-4 px-4 font-medium">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <EmptyComponent variant="empty" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={pagination.page}
        total={pagination.total}
        totalPages={pagination.totalPages}
        limit={pagination.limit}
        onPageChange={(page) => queryParams({ set: { page: page.toString() } })}
      />
    </div>
  );
}
