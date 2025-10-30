import React from "react";
import { TableRow, TableCell, Table, TableHeader, TableColumn, TableBody, Skeleton } from "@heroui/react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 3 }) => {
  return (
    <Table className=" [&>div]:border-none [&>div]:shadow-none [&>div]:bg-transparent">
      <TableHeader>
        {Array.from({ length: columns }, (_, colIndex) => (
          <TableColumn
            key={`skeleton-cell-${colIndex}`}
            className={`
             hidden
             bg-gray-30  
             text-gray-400 
           `}>
            <></>
            {/* <Skeleton className="w-[50px] h-[25px]" /> */}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={`skeleton-row-${rowIndex}`} className="border-none">
            {Array.from({ length: columns }, (_, colIndex) => (
              <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className="border-none h-[60px]">
                <div className="flex items-center gap-3">
                  {colIndex === 0 && (
                    <>
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                    </>
                  )}
                  {colIndex > 0 && (
                    <div className="w-full flex justify-end">
                      <Skeleton className="w-16 h-4" />
                    </div>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(TableSkeleton);
