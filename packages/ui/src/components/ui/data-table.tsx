import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export interface DataTableColumn<TData> {
  key: keyof TData | string;
  header: React.ReactNode;
  cell?: (row: TData) => React.ReactNode;
}

export interface DataTableProps<TData> {
  columns: Array<DataTableColumn<TData>>;
  data: TData[];
  getRowKey?: (row: TData, index: number) => React.Key;
  emptyMessage?: React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No results"
}: DataTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-[#6B6B7B]">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow key={getRowKey?.(row, rowIndex) ?? rowIndex}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.cell ? column.cell(row) : String(row[column.key as keyof TData] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
