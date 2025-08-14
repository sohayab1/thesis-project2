import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface FeedbackFormProps {
  complaintId: number;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
  error?: string | null;
}

export function FeedbackForm({ complaintId, onSubmit, onCancel, error }: FeedbackFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      // Don't reset form or handle success here - let parent component handle it
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

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
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
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