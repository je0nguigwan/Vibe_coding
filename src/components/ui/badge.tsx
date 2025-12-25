import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--accent-soft)] text-[color:var(--primary)]",
        outline: "border border-[color:var(--primary)] text-[color:var(--primary)]",
        warm: "bg-[#f2d7c5] text-[color:var(--primary)]",
        success: "bg-[#d4f1df] text-[color:var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
