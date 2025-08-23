import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { complaints, users } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ComplaintList } from "@/components/ComplaintList";
import { ComplaintDto } from "@/types/dto";
import { UserFeedbackModal } from "@/components/feedback/UserFeedbackModal";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{ feedback: string; rating: number }>();

  const {
    data: complaintsList = [] as ComplaintDto[],
    isLoading,
    refetch,
    error,
  } = useQuery<ComplaintDto[], Error>({
    queryKey: ["userComplaints", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await complaints.getUserComplaints(user.id);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (user?.id && refetch) {
      refetch();
    }
  }, [refetch, user?.id]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedback = await users.getFeedback();
        setCurrentFeedback(feedback);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  const handleComplaintResolve = async (complaintId: number) => {
    try {
      await complaints.markAsResolved(complaintId);
      toast.success("Complaint marked as resolved");
      await queryClient.invalidateQueries({
        queryKey: ["userComplaints", user?.id],
      });
    } catch (error) {
      toast.error("Failed to resolve complaint");
    }
  };

  const handleEditComplaint = (complaintId: number) => {
    // Update the navigation path to match the route we defined
    navigate(`/dashboard/edit-complaint/${complaintId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading complaints: {error.message}
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Complaints</h1>
            <p className="text-muted-foreground">
              {complaintsList.length} total complaints
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowFeedback(true)}>
              Give App Feedback
            </Button>
            <Button onClick={() => navigate("/dashboard/new-complaint")}>
              File New Complaint
            </Button>
          </div>
        </div>

        {complaintsList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No complaints filed yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/dashboard/new-complaint")}
            >
              Create your first complaint
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {complaintsList.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onFeedback={() => navigate(`/feedback/${complaint.id}`)}
                onResolve={() => handleComplaintResolve(complaint.id)}
                onEdit={() => handleEditComplaint(complaint.id)}
                showResolveButton={true}
                showEditButton={!["RESOLVED", "UNRESOLVED"].includes(complaint.status)}
              />
            ))}
          </div>
        )}

        <UserFeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          currentFeedback={currentFeedback}
        />
      </div>
    </Layout>
  );
}