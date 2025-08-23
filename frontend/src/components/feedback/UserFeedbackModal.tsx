import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { users } from "@/services/api";
import { Rating } from "@/components/ui/rating"; // You'll need to create this component

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFeedback?: { feedback: string; rating: number } | null;
}

export function UserFeedbackModal({ isOpen, onClose, currentFeedback }: UserFeedbackModalProps) {
  const [feedback, setFeedback] = useState(currentFeedback?.feedback || '');
  const [rating, setRating] = useState(currentFeedback?.rating || 0);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens with new feedback
  useEffect(() => {
    setFeedback(currentFeedback?.feedback || '');
    setRating(currentFeedback?.rating || 0);
  }, [currentFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await users.submitFeedback({ feedback, rating });
      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>App Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="mt-2">
                <Rating value={rating} onChange={setRating} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Your Feedback</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the app..."
                className="mt-2"
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}