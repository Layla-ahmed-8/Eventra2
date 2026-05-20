import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#6C4CF1] to-[#9B6CF7] text-white shadow-[0_4px_14px_rgba(108,76,241,0.35)] hover:shadow-[0_6px_20px_rgba(108,76,241,0.4)] active:scale-[0.97]",
        primary: "bg-gradient-to-r from-[#6C4CF1] to-[#9B6CF7] text-white shadow-[0_4px_14px_rgba(108,76,241,0.35)] hover:shadow-[0_6px_20px_rgba(108,76,241,0.4)] active:scale-[0.97]",
        destructive:
          "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)] active:scale-[0.97]",
        outline:
          "border border-[rgba(108,76,241,0.3)] bg-card text-[#6C4CF1] hover:bg-[rgba(108,76,241,0.04)] dark:bg-secondary dark:border-border dark:text-[#6C4CF1]",
        secondary:
          "border border-[rgba(108,76,241,0.3)] bg-card text-[#6C4CF1] hover:bg-[rgba(108,76,241,0.04)] dark:bg-secondary dark:border-border dark:text-[#6C4CF1]",
        ghost:
          "bg-transparent text-[#6B7280] hover:bg-[rgba(108,76,241,0.06)] hover:text-[#6C4CF1] dark:text-[#D1D5DB] dark:hover:bg-[#2D2E48] dark:hover:text-[#A78BFA]",
        link: "text-[#6C4CF1] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 has-[>svg]:px-3",
        sm: "h-9 rounded-[10px] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-[44px] rounded-[12px] px-5 has-[>svg]:px-4",
        icon: "h-10 w-10 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
