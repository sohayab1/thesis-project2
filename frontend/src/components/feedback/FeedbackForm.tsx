import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { feedback } from "@/services/api"

interface FeedbackFormProps {
  complaintId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedbackForm({ complaintId, onSuccess, onCancel }: FeedbackFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    feedback: "",
    rating: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await feedback.submit(complaintId, formData)
      toast.success("Feedback submitted successfully")
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant={formData.rating === rating ? "default" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, rating }))}
            >
              {rating}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Feedback</label>
        <Textarea
          value={formData.feedback}
          onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
          placeholder="Please share your experience..."
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  )
}