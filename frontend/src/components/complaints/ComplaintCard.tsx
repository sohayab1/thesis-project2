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
} from "@/components/ui/dialog";
import type { Complaint } from "@/types/complaint";

interface ComplaintCardProps {
  complaint: Complaint;
  onFeedback?: () => void;
}

export function ComplaintCard({ complaint, onFeedback }: ComplaintCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-500",
      IN_PROGRESS: "bg-blue-500",
      RESOLVED: "bg-green-500",
      REJECTED: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const canGiveFeedback = complaint.status === "RESOLVED" && !complaint.feedback;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{complaint.title}</CardTitle>
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {complaint.description}
            </p>

            <div className="text-sm text-muted-foreground">
              <p>
                Filed on:{" "}
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
              {complaint.department && (
                <p>Department: {complaint.department.name}</p>
              )}
            </div>

            {complaint.feedback && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium">Your Feedback</p>
                <div className="mt-2">
                  <p className="text-sm">
                    Rating: {complaint.feedback.rating}/5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.feedback.comment}
                  </p>
                </div>
              </div>
            )}

            {canGiveFeedback && onFeedback && (
              <Button
                onClick={onFeedback}
                variant="outline"
                className="w-full mt-4"
              >
                Give Feedback
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm
            complaintId={complaint.id}
            onSuccess={() => setShowFeedback(false)}
            onCancel={() => setShowFeedback(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}