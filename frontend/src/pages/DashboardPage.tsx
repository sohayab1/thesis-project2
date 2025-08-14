import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { complaints } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { Complaint } from "@/types";
import { useEffect } from "react";

export function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { 
        data: complaintsList = [], // Provide empty array as default value
        isLoading, 
        refetch 
    } = useQuery<Complaint[]>({
        queryKey: ['userComplaints', user?.id],
        queryFn: () => {
            if (!user?.id) return Promise.resolve([]);
            return complaints.getUserComplaints(user.id);
        },
        enabled: !!user?.id,
        onError: () => {
            toast.error("Failed to load complaints");
        }
    });

    useEffect(() => {
        if (user?.id && refetch) {
            refetch();
        }
    }, [refetch, user?.id]);

    const handleComplaintResolve = async (complaintId: number) => {
        try {
            await complaints.markAsResolved(complaintId);
            toast.success('Complaint marked as resolved');
            queryClient.invalidateQueries(['userComplaints', user?.id]);
        } catch (error) {
            toast.error('Failed to resolve complaint');
        }
    };

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
                    <Button onClick={() => navigate('/complaints/new')}>
                        File New Complaint
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading complaints...</p>
                    </div>
                ) : complaintsList.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No complaints filed yet.</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/complaints/new')}
                        >
                            Create your first complaint
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {complaintsList.map((complaint: Complaint) => (
                            <ComplaintCard 
                                key={complaint.id} 
                                complaint={complaint}
                                onFeedback={() => navigate(`/feedback/${complaint.id}`)}
                                onResolve={() => handleComplaintResolve(complaint.id)}
                                showResolveButton={true}  // Add this prop
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}