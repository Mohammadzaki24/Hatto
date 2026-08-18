import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link" | "pill" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--color-charcoal)] text-[var(--color-background)] hover:bg-[var(--color-charcoal)]/90": variant === "default",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white bg-red-600": variant === "destructive",
            "border border-[var(--color-charcoal)] bg-transparent hover:bg-[var(--color-background)]": variant === "outline",
            "hover:bg-[var(--color-background)] hover:text-[var(--color-charcoal)]": variant === "ghost",
            "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90": variant === "pill", // Used for the "Check current price on Amazon" CTA
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
            "rounded-[var(--radius-pill)]": variant === "pill",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
