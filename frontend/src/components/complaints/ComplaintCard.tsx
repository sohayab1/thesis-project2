import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ComplaintDto } from "@/types/dto";
import { toast } from "sonner";
import { feedback } from "@/services/api";
import { ComplaintStatus } from "@/types/complaint";

interface ComplaintCardProps {
  complaint: ComplaintDto;
  onFeedback?: () => void | Promise<void>;
  onResolve?: () => Promise<void>;
  showResolveButton?: boolean;
}

export function ComplaintCard({
  complaint,
  onFeedback,
  onResolve,
  showResolveButton,
}: ComplaintCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleFeedbackSubmit = async (data: { rating: number; comment: string }) => {
    try {
      await feedback.submit(complaint.id, data);
      toast.success("Feedback submitted successfully");
      setShowFeedback(false); // Close the form on success
      setFeedbackError(null);
      onResolve(); // Refresh the complaints list
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        toast.error("Feedback already exists for this complaint");
        setShowFeedback(false); // Close the form if feedback exists
      } else {
        setFeedbackError(error.message);
        toast.error(error.message);
      }
    }
  };

  const getStatusColor = (status: ComplaintStatus): string => {
    const colors: Record<ComplaintStatus, string> = {
      PENDING: "bg-yellow-500",
      IN_PROGRESS: "bg-blue-500",
      RESOLVED: "bg-green-500",
      REJECTED: "bg-red-500",
    };
    return colors[status];
  };

  const canGiveFeedback = complaint.status === "RESOLVED" && !complaint.feedback;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{complaint.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Filed by: {complaint.user?.name || "Unknown"}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status}
              </Badge>
              {showResolveButton && complaint.status !== "RESOLVED" && (
                <Button size="sm" onClick={onResolve}>
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaint.user && (
              <div>
                <h4 className="font-medium">Reported By</h4>
                <p>{complaint.user.name}</p>
              </div>
            )}
            
            {complaint.suspectInfo && (
              <div>
                <h4 className="font-medium">Suspect Information</h4>
                <p>{complaint.suspectInfo}</p>
                {complaint.suspectSocialMedia && (
                  <p>Social Media: {complaint.suspectSocialMedia}</p>
                )}
                {complaint.suspectPhoneNumber && (
                  <p>Phone: {complaint.suspectPhoneNumber}</p>
                )}
              </div>
            )}

            {complaint.feedback && (
              <div>
                <h4 className="font-medium">Feedback</h4>
                <p>Rating: {complaint.rating}/5</p>
                <p>{complaint.feedback}</p>
              </div>
            )}

            {complaint.evidences && complaint.evidences.length > 0 && (
              <div>
                <h4 className="font-medium">Evidence Files</h4>
                <ul>
                  {complaint.evidences.map(evidence => (
                    <li key={evidence.id}>{evidence.filePath}</li>
                  ))}
                </ul>
              </div>
            )}

            {canGiveFeedback && (
              <Button
                onClick={() => setShowFeedback(true)}
                variant="outline"
                className="w-full mt-4"
              >
                Give Feedback
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={showFeedback} 
        onOpenChange={(open) => {
          setShowFeedback(open);
          if (!open) {
            setFeedbackError(null); // Clear error when dialog closes
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Please share your experience about how your complaint was handled.
            </DialogDescription>
          </DialogHeader>
          <FeedbackForm
            complaintId={complaint.id}
            onSubmit={handleFeedbackSubmit}
            onCancel={() => {
              setShowFeedback(false);
              setFeedbackError(null);
            }}
            error={feedbackError}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}