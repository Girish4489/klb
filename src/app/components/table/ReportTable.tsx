'use client';
import { JSX, useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';

export interface Column {
  header: string;
  field: string;
  selected: boolean;
  isAction?: boolean;
}

export interface TableRow {
  [key: string]: string | number | boolean | undefined | JSX.Element;
}

interface ReportTableProps {
  data: TableRow[];
  columns: Column[];
  caption: string;
  loading?: boolean;
  onColumnSelectChange?: (columns: Column[]) => void;
  onAction?: (action: string, id: string) => void;
}

export function ReportTable({ data, columns, caption, loading, onColumnSelectChange }: ReportTableProps): JSX.Element {
  const [selectedColumns, setSelectedColumns] = useState(columns);

  useEffect(() => {
    setSelectedColumns(columns.map((col) => ({ ...col, selected: true })));
  }, [columns]);

  const handleColumnToggle = (index: number): void => {
    const updated = selectedColumns.map((col, i) => (i === index ? { ...col, selected: !col.selected } : col));
    setSelectedColumns(updated);
    onColumnSelectChange?.(updated);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col rounded-lg bg-base-100 shadow-lg">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-base-200 p-4">
        <h3 className="text-xl font-bold">{caption}</h3>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-sm">
            Columns
          </label>
          <ul tabIndex={0} className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
            {selectedColumns.map((column, index) => (
              <li key={column.field}>
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">{column.header}</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={column.selected}
                    onChange={() => handleColumnToggle(index)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="table table-zebra w-full">
          <thead className="sticky top-0 z-10 bg-base-300">
            <tr>
              {selectedColumns
                .filter((col) => col.selected)
                .map((column) => (
                  <th key={column.field} className={`${column.isAction ? 'w-32' : ''} bg-base-300 p-4`}>
                    {column.header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={selectedColumns.filter((col) => col.selected).length} className="text-center text-warning">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-base-200">
                  {selectedColumns
                    .filter((col) => col.selected)
                    .map((column) => (
                      <td
                        key={column.field}
                        className={`p-4 ${column.isAction ? 'w-32' : ''} ${
                          typeof row[column.field] === 'number' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {row[column.field]}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
