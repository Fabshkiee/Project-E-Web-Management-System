interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export const DataTable = <T,>({
  columns,
  data,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke bg-white dark:bg-[#1a1a1a] dark:border-white/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] dark:bg-white/2 border-b border-stroke dark:border-white/5">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-stroke dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/1 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-5 ${column.className || ""}`}
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-secondary font-lexend text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
