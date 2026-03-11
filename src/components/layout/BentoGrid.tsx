import React from "react";
import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-[1px] auto-rows-min max-w-7xl mx-auto rounded-[var(--radius)] overflow-hidden",
        "bg-border border border-border shadow-2xl",
        "relative",
        className
      )}
    >
      {/* Decorative corner markers could go here if requested, keeping it clean for now */}
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
}: {
  className?: string;
  children?: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
}) => {
  return (
    <div
      className={cn(
        "bg-background/90 backdrop-blur-md p-6 sm:p-8 flex flex-col relative group transition-all duration-300",
        // Handling dynamic spans
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3 lg:col-span-3",
        colSpan === 4 && "md:col-span-3 xl:col-span-4",
        rowSpan === 2 && "row-span-2",
        rowSpan === 3 && "row-span-3",
        className
      )}
    >
      <div className="absolute inset-x-0 h-px w-full -top-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-y-0 w-px h-full -left-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </div>
  );
};
