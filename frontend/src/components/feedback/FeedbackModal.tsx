import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { feedback } from "@/services/api"

interface FeedbackModalProps {
  complaintId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FeedbackModal({ complaintId, isOpen, onClose, onSuccess }: FeedbackModalProps) {
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await feedback.submit(complaintId, {
        rating,
        comment
      })
      toast.success("Feedback submitted successfully")
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rating === value ? "default" : "outline"}
                  onClick={() => setRating(value)}
                  className="w-12 h-12"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button type="submit" disabled={loading || !rating}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}