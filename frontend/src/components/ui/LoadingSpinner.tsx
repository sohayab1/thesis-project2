import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingSpinner({ className, size = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}