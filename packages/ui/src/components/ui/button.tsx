import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FE9] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#5B4FE9] text-white shadow-sm hover:bg-[#4C42D8]",
        secondary: "bg-[#FBF9F6] text-[#1A1A2E] hover:bg-[#E8E4F0]",
        outline: "border border-[#E8E4F0] bg-white text-[#1A1A2E] hover:bg-[#FBF9F6]",
        ghost: "text-[#1A1A2E] hover:bg-[#FBF9F6]",
        destructive: "bg-[#E07A5F] text-white hover:bg-[#CE684D]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);

Button.displayName = "Button";

export { buttonVariants };
