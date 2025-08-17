import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { complaints } from "@/services/api";
import { ComplaintDto } from "@/types/dto";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "@/types/user";

export function DepartmentAdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  console.log("Current user:", user);

  // Fix: Access departmentId directly from user object
  const departmentId = user?.departmentId;
  console.log("Department ID:", departmentId);

  const { data: departmentComplaints = [], isLoading, error } = useQuery<ComplaintDto[]>({
    queryKey: ['departmentComplaints', departmentId],
    queryFn: () => complaints.getDepartmentComplaints(departmentId!),
    enabled: !!departmentId, // Only run query when departmentId exists
    retry: 1
  });

  console.log("Query state:", { isLoading, error, data: departmentComplaints });

  const handleComplaintResolve = async (complaintId: number) => {
    try {
      setLoading(true);
      await complaints.markAsResolved(complaintId);
      toast.success('Complaint resolved successfully');
      await queryClient.invalidateQueries({ 
        queryKey: ['departmentComplaints', departmentId] 
      });
    } catch (error) {
      toast.error('Failed to resolve complaint');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-2">Loading complaints...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <p className="text-red-500">Error loading complaints: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">
          {user?.name}'s Department Dashboard
        </h1>

        <div className="grid gap-4">
          {departmentComplaints.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No complaints for your department
                </p>
              </CardContent>
            </Card>
          ) : (
            departmentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                showResolveButton={true}
                onResolve={() => handleComplaintResolve(complaint.id)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}