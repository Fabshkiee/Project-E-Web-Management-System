interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean; // Added this
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export const DataTable = <T,>({
  columns,
  data,
  isLoading, // Added this
  emptyMessage = "No data available",
  onRowClick,
  className = "",
}: DataTableProps<T>) => {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-stroke bg-white dark:bg-[#1a1a1a] dark:border-white/5 ${className}`}
    >
      <table className="w-full h-fit table-fixed text-left border-collapse">
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
          {isLoading ? (
            // Skeleton Loading State
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-stroke dark:border-white/5 last:border-0">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-5">
                    <div className="h-5 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(item)}
                className={`group border-b border-stroke dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/2 transition-all duration-300 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-5 whitespace-nowrap ${column.className || ""}`}
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
