import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { complaints, departments } from "@/services/api"
import { toast } from "sonner"
import { FeedbackModal } from "@/components/feedback/FeedbackModal"
import type { ComplaintCreateDto, ReporterType, ComplaintPriority } from "@/types/complaint";

interface Department {
  id: number;
  name: string;
}

interface ComplaintFormData extends ComplaintCreateDto {
    // All fields are inherited from ComplaintCreateDto
}

const initialFormData: ComplaintFormData = {
    title: "",
    description: "",
    departmentId: "",
    location: "",
    incidentDate: "",
    suspectInfo: "",
    suspectSocialMedia: "",
    suspectPhoneNumber: "",
};

export function NewComplaintPage() {
  const [loading, setLoading] = useState(false)
  const [departmentList, setDepartmentList] = useState<Department[]>([])
  const [complaintData, setComplaintData] = useState<ComplaintFormData>(initialFormData)
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [submittedComplaintId, setSubmittedComplaintId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departments.getAll();
        setDepartmentList(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error("Failed to load departments");
      }
    };

    fetchDepartments();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('complaint', new Blob([JSON.stringify(complaintData)], {
        type: 'application/json'
      }))
      
      evidenceFiles.forEach(file => {
        formData.append('evidences', file)
      })

      const response = await complaints.create(complaintData, evidenceFiles)
      toast.success("Complaint submitted successfully")
      setSubmittedComplaintId(response.id)
      setShowFeedback(true)
    } catch (error) {
      console.error('Error submitting complaint:', error)
      toast.error("Failed to submit complaint. Please check all required fields.")
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackClose = () => {
    setShowFeedback(false)
    navigate('/dashboard')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">File a New Complaint</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title *</label>
            <Input
              id="title"
              value={complaintData.title}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                title: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description *</label>
            <Textarea
              id="description"
              value={complaintData.description}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              required
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">Department *</label>
            <select
              id="department"
              className="w-full rounded-md border p-2"
              value={complaintData.departmentId}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                departmentId: e.target.value
              }))}
              required
            >
              <option value="">Select Department</option>
              {departmentList.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location *</label>
            <Input
              id="location"
              value={complaintData.location}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                location: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="incidentDate" className="text-sm font-medium">Incident Date *</label>
            <Input
              type="datetime-local"
              id="incidentDate"
              value={complaintData.incidentDate}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                incidentDate: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="suspectInfo" className="text-sm font-medium">
              Suspect Information
            </label>
            <Textarea
              id="suspectInfo"
              value={complaintData.suspectInfo}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                suspectInfo: e.target.value
              }))}
              placeholder="Provide any information about the suspect"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="suspectSocialMedia" className="text-sm font-medium">
              Suspect Social Media Links
            </label>
            <Input
              id="suspectSocialMedia"
              value={complaintData.suspectSocialMedia}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                suspectSocialMedia: e.target.value
              }))}
              placeholder="Enter social media profile links"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="suspectPhoneNumber" className="text-sm font-medium">
              Suspect Phone Number
            </label>
            <Input
              id="suspectPhoneNumber"
              value={complaintData.suspectPhoneNumber}
              onChange={(e) => setComplaintData(prev => ({
                ...prev,
                suspectPhoneNumber: e.target.value
              }))}
              placeholder="Enter suspect's phone number"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="evidence" className="text-sm font-medium">Evidence (Optional)</label>
            <Input
              id="evidence"
              type="file"
              multiple
              onChange={(e) => setEvidenceFiles(Array.from(e.target.files || []))}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>

        {showFeedback && submittedComplaintId && (
          <FeedbackModal
            complaintId={submittedComplaintId}
            isOpen={showFeedback}
            onClose={handleFeedbackClose}
            onSuccess={() => {
              // Optionally refresh data or perform other actions
            }}
          />
        )}
      </div>
    </Layout>
  )
}