import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 shadow-sm hover:shadow-md",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90 shadow-sm hover:shadow-md",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline dark:text-primary",
          size === "default" && "h-11 px-4 py-2 text-sm min-w-[44px] touch-manipulation",
          size === "sm" && "h-9 px-3 text-xs min-w-[36px] touch-manipulation",
          size === "lg" && "h-12 px-6 text-base min-w-[48px] touch-manipulation",
          size === "icon" && "h-11 w-11 min-w-[44px] min-h-[44px] touch-manipulation",
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