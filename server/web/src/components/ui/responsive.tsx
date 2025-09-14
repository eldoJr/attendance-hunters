import * as React from "react"
import { cn } from "../../lib/utils"

// Responsive container with consistent max-width and padding
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full mx-auto px-4 md:px-6 max-w-7xl",
      className
    )}
    {...props}
  />
))
Container.displayName = "Container"

// Responsive grid with mobile-first approach
const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cols?: 1 | 2 | 3 | 4 | 6 | 12
    gap?: 2 | 3 | 4 | 6 | 8
  }
>(({ className, cols = 1, gap = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid w-full",
      cols === 1 && "grid-cols-1",
      cols === 2 && "grid-cols-1 md:grid-cols-2",
      cols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      cols === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      cols === 6 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
      cols === 12 && "grid-cols-4 sm:grid-cols-6 md:grid-cols-12",
      gap === 2 && "gap-2",
      gap === 3 && "gap-3 md:gap-4",
      gap === 4 && "gap-4 md:gap-6",
      gap === 6 && "gap-4 md:gap-6",
      gap === 8 && "gap-6 md:gap-8",
      className
    )}
    {...props}
  />
))
Grid.displayName = "Grid"

// Responsive stack with consistent spacing
const Stack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "column"
    gap?: 2 | 3 | 4 | 6 | 8
    align?: "start" | "center" | "end" | "stretch"
    justify?: "start" | "center" | "end" | "between" | "around"
  }
>(({ className, direction = "column", gap = 4, align = "stretch", justify = "start", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex",
      direction === "row" ? "flex-row" : "flex-col",
      gap === 2 && "gap-2",
      gap === 3 && "gap-3",
      gap === 4 && "gap-4",
      gap === 6 && "gap-6",
      gap === 8 && "gap-8",
      align === "start" && "items-start",
      align === "center" && "items-center",
      align === "end" && "items-end",
      align === "stretch" && "items-stretch",
      justify === "start" && "justify-start",
      justify === "center" && "justify-center",
      justify === "end" && "justify-end",
      justify === "between" && "justify-between",
      justify === "around" && "justify-around",
      className
    )}
    {...props}
  />
))
Stack.displayName = "Stack"

// Responsive text with consistent sizing
const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: "xs" | "sm" | "base" | "lg" | "xl"
    weight?: "normal" | "medium" | "semibold" | "bold"
    color?: "default" | "muted" | "primary" | "destructive"
  }
>(({ className, size = "base", weight = "normal", color = "default", ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      size === "xs" && "text-xs",
      size === "sm" && "text-sm",
      size === "base" && "text-sm md:text-base",
      size === "lg" && "text-base md:text-lg",
      size === "xl" && "text-lg md:text-xl",
      weight === "normal" && "font-normal",
      weight === "medium" && "font-medium",
      weight === "semibold" && "font-semibold",
      weight === "bold" && "font-bold",
      color === "default" && "text-foreground",
      color === "muted" && "text-muted-foreground",
      color === "primary" && "text-primary",
      color === "destructive" && "text-destructive",
      className
    )}
    {...props}
  />
))
Text.displayName = "Text"

// Responsive heading with consistent sizing
const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    size?: "sm" | "base" | "lg" | "xl" | "2xl"
  }
>(({ className, level = 2, size = "base", ...props }, ref) => {
  const baseClasses = cn(
    "font-semibold tracking-tight",
    size === "sm" && "text-sm md:text-base",
    size === "base" && "text-base md:text-lg",
    size === "lg" && "text-lg md:text-xl",
    size === "xl" && "text-xl md:text-2xl",
    size === "2xl" && "text-2xl md:text-3xl",
    className
  )
  
  switch (level) {
    case 1:
      return <h1 ref={ref} className={baseClasses} {...props} />
    case 2:
      return <h2 ref={ref} className={baseClasses} {...props} />
    case 3:
      return <h3 ref={ref} className={baseClasses} {...props} />
    case 4:
      return <h4 ref={ref} className={baseClasses} {...props} />
    case 5:
      return <h5 ref={ref} className={baseClasses} {...props} />
    case 6:
      return <h6 ref={ref} className={baseClasses} {...props} />
    default:
      return <h2 ref={ref} className={baseClasses} {...props} />
  }
})
Heading.displayName = "Heading"

export { Container, Grid, Stack, Text, Heading }