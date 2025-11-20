import React, { useCallback, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "../atoms/skeleton";

// -------------------- Types --------------------
type SortConfigType = { key: string; direction: "ascending" | "descending" };

// -------------------- Context --------------------
interface TableContextProps {
  striped?: boolean;
  hoverable?: boolean;
  size?: "sm" | "md" | "lg";
  sortConfig?: SortConfigType[];
  onSort?: (key: string) => void;
  variant?: "default" | "bordered" | "compact";
}

const TableContext = React.createContext<TableContextProps>({});

// -------------------- Table Component --------------------
interface TableProps extends React.HTMLAttributes<HTMLTableElement>, TableContextProps {
  loading?: boolean;
  height?: string | number;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  label?: string;
  showBorder?: boolean;
  minWidth?: string | number;
  skeletonRows?: number;
  skeletonColumns?: number;
  multiSortEnabled?: boolean;
}

export const Table = ({
  striped = false,
  hoverable = true,
  className,
  children,
  size = "md",
  onSort,
  loading = false,
  height = "auto",
  footer,
  label,
  variant = "default",
  showBorder = true,
  minWidth = "640px",
  skeletonRows = 5,
  skeletonColumns = 5,
  emptyState = "No data available.",
  multiSortEnabled = false,
  ...props
}: TableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfigType[]>([]);

  const handleSort = useCallback(
    (key: string) => {
      let direction: "ascending" | "descending" = "ascending";
      const existingConfig = sortConfig.find((config) => config.key === key);

      if (existingConfig) {
        direction = existingConfig.direction === "ascending" ? "descending" : "ascending";
        setSortConfig(
          sortConfig.map((config) =>
            config.key === key ? { ...config, direction } : multiSortEnabled ? config : { key, direction }
          )
        );
      } else {
        const newConfig = { key, direction };
        setSortConfig(multiSortEnabled ? [...sortConfig, newConfig] : [newConfig]);
      }

      onSort?.(key);
    },
    [sortConfig, multiSortEnabled, onSort]
  );

  const baseClasses = twMerge(
    "w-full",
    showBorder && "border border-gray-200 dark:border-gray-700",
    variant === "bordered" && "border-separate border-spacing-0",
    variant === "compact" && "[&_td]:py-1 [&_th]:py-1",
    className
  );

  const isEmpty = !loading && React.Children.count(children) === 0;

  const renderSkeletonCell = (index: number) => (
    <TableCell key={index} loading>
      <Skeleton className='h-6 w-full rounded' />
    </TableCell>
  );

  return (
    <TableContext.Provider
      value={{
        striped,
        hoverable,
        size,
        sortConfig,
        onSort: handleSort,
        variant,
      }}
    >
      <div className='flex flex-col gap-2'>
        {label && <TableLabel>{label}</TableLabel>}
        <div className='relative rounded bg-white dark:bg-gray-800' style={{ height }}>
          <div className='relative h-full w-full overflow-auto'>
            <div className='min-w-full'>
              <table className={baseClasses} style={{ minWidth }} {...props}>
                {loading ? (
                  <TableBody>
                    {Array.from({ length: skeletonRows }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({
                          length: skeletonColumns,
                        }).map((__, cellIdx) => renderSkeletonCell(cellIdx))}
                      </TableRow>
                    ))}
                  </TableBody>
                ) : isEmpty ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={skeletonColumns} align='left'>
                        {emptyState}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  children
                )}

                {footer && <TableFooter>{footer}</TableFooter>}
              </table>
            </div>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
};

// -------------------- Table Subcomponents --------------------

// Label Above Table
export const TableLabel = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge(" font-semibold text-gray-700 dark:text-gray-300", className)}>{children}</div>
);

// Table Caption
export const TableCaption = ({ className, children }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption className={twMerge(" text-gray-500 dark:text-gray-400 caption-bottom mt-2", className)}>{children}</caption>
);

// Table Head Section
export const TableHeader = ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  const { variant } = useContext(TableContext);
  return (
    <thead
      className={twMerge(
        "sticky top-0 bg-gray-50 text-left  font-semibold text-gray-800 dark:bg-gray-700 dark:text-white",
        variant === "bordered" && "border-b border-gray-200 dark:border-gray-600",
        className
      )}
    >
      {children}
    </thead>
  );
};

// Table Head Cell
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortKey?: string;
  align?: "left" | "center" | "right";
}

export const TableHead = ({
  className,
  children,
  sortable = false,
  sortKey,
  align = "left",
  ...props
}: TableHeadProps) => {
  const { sortConfig, onSort, variant } = useContext(TableContext);

  const handleSort = () => {
    if (sortable && sortKey && onSort) onSort(sortKey);
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const currentSort = sortConfig?.find((config) => config.key === sortKey);

  return (
    <th
      className={twMerge(
        "px-2 py-4 font-medium select-none  text-nowrap min-w-fit max-w-min mx-0",
        sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" : "",
        variant === "bordered" && "border-b border-gray-200 dark:border-gray-600",
        alignmentClasses[align],
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <div
        className={`flex items-center ${
          align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""
        }`}
      >
        {children}
        {sortable && currentSort && <span className='ml-1 '>{currentSort.direction === "ascending" ? "↑" : "↓"}</span>}
      </div>
    </th>
  );
};

// Table Body Section
export const TableBody = ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  const { striped, variant } = useContext(TableContext);
  return (
    <tbody
      className={twMerge(
        " font-medium text-gray-700 dark:text-gray-100",
        variant === "bordered" && "divide-y divide-gray-200 dark:divide-gray-600",
        striped && "even:bg-gray-50 dark:even:bg-gray-700/50",
        className
      )}
    >
      {children}
    </tbody>
  );
};

// Table Row
export const TableRow = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { hoverable, variant } = useContext(TableContext);
  return (
    <tr
      className={twMerge(
        "relative",
        hoverable && "hover:bg-gray-50 dark:hover:bg-gray-600",
        variant === "bordered" && "border-b border-gray-200 dark:border-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// Table Cell
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  loading?: boolean;
  loadingFallback?: React.ReactNode;
  align?: "left" | "center" | "right";
}

export const TableCell = ({
  className,
  children,
  loading = false,
  loadingFallback = <Skeleton className='h-6 w-full' />,
  align = "left",
  ...props
}: TableCellProps) => {
  const { variant, size } = useContext(TableContext);

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const paddingClasses = {
    sm: "px-1 py-1",
    md: "px-2 py-1.5",
    lg: "px-3 py-2",
  };

  return (
    <td
      className={twMerge(
        "relative  min-w-4 truncate text-ellipsis break-all mx-0",
        variant === "bordered" && "border-b border-gray-200 dark:border-gray-600",
        alignmentClasses[align],
        paddingClasses[size || "md"],
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "",
        className
      )}
      {...props}
    >
      {loading ? loadingFallback : children}
    </td>
  );
};

// Table Footer
export const TableFooter = ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  const { variant } = useContext(TableContext);
  return (
    <tfoot
      className={twMerge(
        "sticky bottom-0 bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-700",
        variant === "bordered" && "border-t border-gray-200 dark:border-gray-600",
        className
      )}
    >
      {children}
    </tfoot>
  );
};
