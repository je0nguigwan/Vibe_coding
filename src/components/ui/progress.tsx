import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-3 w-full overflow-hidden rounded-full bg-[#f2dfd1]", className)}
      {...props}
    />
  )
);
Progress.displayName = "Progress";

const ProgressIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-full rounded-full bg-[color:var(--accent)] transition-all", className)}
      style={style}
      {...props}
    />
  )
);
ProgressIndicator.displayName = "ProgressIndicator";

export { Progress, ProgressIndicator };
