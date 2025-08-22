import { ComplaintStatus } from "@/types/dto";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusTrackerProps {
  currentStatus: ComplaintStatus;
  size?: 'small' | 'normal';
}

const statuses = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "APPROVAL_PENDING", label: "Pending Approval" },
  { value: "ENQUIRY_ONGOING", label: "Under Investigation" },
  { value: "RESOLVED", label: "Resolved" },
];

export function StatusTracker({ currentStatus, size = 'normal' }: StatusTrackerProps) {
  const currentIdx = statuses.findIndex((s) => s.value === currentStatus);
  const isSmall = size === 'small';

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500"
          style={{ 
            width: `${(currentIdx / (statuses.length - 1)) * 100}%`
          }} 
        />

        {/* Status Points */}
        <div className="relative z-10 flex justify-between">
          {statuses.map((status, idx) => {
            const isActive = idx <= currentIdx;
            const isComplete = idx < currentIdx;

            return (
              <div key={status.value} className="flex flex-col items-center">
                <div className={cn(
                  "rounded-full flex items-center justify-center border-2",
                  isSmall ? "w-6 h-6" : "w-8 h-8",
                  isActive ? "border-blue-500 bg-white" : "border-gray-300 bg-gray-100"
                )}>
                  {isComplete ? (
                    <CheckCircle className={cn("text-blue-500", isSmall ? "w-4 h-4" : "w-6 h-6")} />
                  ) : (
                    <Circle className={cn(
                      isSmall ? "w-4 h-4" : "w-6 h-6",
                      isActive ? "text-blue-500" : "text-gray-300"
                    )} />
                  )}
                </div>
                <span className={cn(
                  "mt-1 text-sm font-medium",
                  isSmall ? "text-xs" : "text-sm",
                  isActive ? "text-blue-500" : "text-gray-500"
                )}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}