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
  
  console.log("Current user:", user); // Debug log
  
  const departmentUser = user as User & { department: { id: number, name: string } };
  
  console.log("Department user:", departmentUser); // Debug log
  console.log("Department ID:", departmentUser?.department?.id); // Debug log

  const { data: departmentComplaints = [], isLoading, error } = useQuery<ComplaintDto[]>({
    queryKey: ['departmentComplaints', departmentUser?.department?.id],
    queryFn: async () => {
      console.log("Fetching complaints for department:", departmentUser.department.id); // Debug log
      const complaints = await complaints.getDepartmentComplaints(departmentUser.department.id);
      console.log("Fetched complaints:", complaints); // Debug log
      return complaints;
    },
    enabled: !!departmentUser?.department?.id,
    retry: 1
  });

  console.log("Query state:", { isLoading, error, data: departmentComplaints }); // Debug log

  const handleComplaintResolve = async (complaintId: number) => {
    try {
      setLoading(true);
      await complaints.markAsResolved(complaintId);
      toast.success('Complaint resolved successfully');
      await queryClient.invalidateQueries({ 
        queryKey: ['departmentComplaints', departmentUser?.department?.id] 
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
          {departmentUser.department?.name} Department Dashboard
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