"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import CreateHouseButton from "../admin/CreateHouseButton";
import CreateInvoiceButton from "../admin/CreateInoviceButton";
import CreateOrderButton from "../dashboard/CreateOrderButton";
import { DataTablePagination } from "./pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  description: string;
  urlStart: string;
  searchParam: string;
  searchParamName: string;
  tableType?: string;
  housesData?: any;
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  title,
  description,
  searchParam,
  searchParamName,
  tableType,
  housesData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>

          <div className="flex flex-col md:flex-row-reverse gap-8 pt-4">
            {tableType === "houses" ? <CreateHouseButton /> : ""}
            {tableType === "invoices" ? (
              <CreateInvoiceButton housesData={housesData} />
            ) : (
              ""
            )}
            {tableType === "orders" ? (
              <CreateOrderButton houses={housesData} />
            ) : (
              ""
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="gap-4" asChild>
                <Button size="sm" className="md:ml-auto">
                  Изменить отображение
                  <ListFilter className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {(column.columnDef.meta as string) ||
                          (column.columnDef.header as string) ||
                          column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center">
              <Input
                placeholder={`Поиск по ${searchParamName.toLowerCase()}`}
                value={
                  (table.getColumn(searchParam)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(searchParam)
                    ?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table className="border rounded-full w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  Нет результатов
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  );
}
