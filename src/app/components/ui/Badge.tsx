import * as React from "react";
import { cn } from "../../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#0072BC] text-white shadow hover:bg-[#0072BC]/80": variant === "default",
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
          "border-transparent bg-green-100 text-green-800": variant === "success",
          "border-transparent bg-yellow-100 text-yellow-800": variant === "warning",
          "border-transparent bg-red-100 text-red-800": variant === "danger",
          "text-gray-700 border-gray-300": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
