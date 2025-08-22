import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { complaints } from "@/services/api";
import { toast } from "sonner";
import { ComplaintCreateDto } from "@/types/dto";
import { NewComplaintPage } from "@/pages/NewComplaintPage"; // Updated import

export function EditComplaintPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<ComplaintCreateDto | null>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const complaint = await complaints.getComplaint(Number(id));
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

  if (loading || !initialData) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Complaint</h1>
        <NewComplaintPage
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </Layout>
  );
}