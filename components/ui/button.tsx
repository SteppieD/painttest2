import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#ef2b70] to-[#ff6b9d] text-white hover:shadow-lg hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        adcreative: "bg-gradient-to-r from-[#ef2b70] to-[#ff6b9d] text-white hover:shadow-lg hover:scale-105 rounded-xl",
        secondary_pink: "bg-white text-[#ef2b70] border-2 border-[#ef2b70] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50",
        // New variant for better contrast on colored backgrounds
        primary: "bg-[#ef2b70] text-white shadow-lg hover:bg-[#d91f5f] hover:shadow-xl hover:scale-105 border-2 border-white/20",
        // Outline variant with pink color for secondary CTAs on colored backgrounds
        outline_white: "border-2 border-white bg-white/95 text-gray-900 hover:bg-white hover:shadow-lg backdrop-blur-sm",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-10 rounded-md px-4 py-2",
        lg: "h-12 rounded-md px-8 py-3",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }