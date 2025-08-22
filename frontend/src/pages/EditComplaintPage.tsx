import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaints } from "@/services/api";
import { toast } from "sonner";
import { ComplaintCreateDto, ComplaintDto } from "@/types/dto";
import { NewComplaintPage } from "@/pages/NewComplaintPage";
import { StatusTracker } from "@/components/complaints/StatusTracker";

export function EditComplaintPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaintData, setComplaintData] = useState<ComplaintDto | null>(null);
  const [initialData, setInitialData] = useState<ComplaintCreateDto | null>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const complaint = await complaints.getComplaint(Number(id));
        setComplaintData(complaint);
        setInitialData(complaint);
      } catch (error) {
        toast.error("Failed to fetch complaint details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id, navigate]);

  const handleSubmit = async (data: ComplaintCreateDto) => {
    try {
      await complaints.updateComplaint(Number(id), data);
      toast.success("Complaint updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to update complaint");
    }
  };

  if (loading || !initialData || !complaintData) {
    return <p className="container mx-auto py-6">Loading...</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Complaint</h1>
      
      {/* Status Tracker */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Complaint Status</h2>
        <StatusTracker currentStatus={complaintData.status} />
      </div>

      {/* Complaint Form */}
      <div className="mt-8">
        <NewComplaintPage 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isEditing={true} 
        />
      </div>
    </div>
  );
}