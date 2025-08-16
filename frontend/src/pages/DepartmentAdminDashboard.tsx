import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { complaints } from "@/services/api";
import { ComplaintDto } from "@/types/dto";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";
import { UserRole } from '@/types/enums';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";

export function DepartmentAdminDashboard() {
  const { user } = useAuth();
  const departmentUser = user as User & { department: { id: number, name: string } };

  const { data: complaints = [], isLoading } = useQuery<ComplaintDto[]>({
    queryKey: ['departmentComplaints', departmentUser?.department?.id],
    queryFn: () => complaints.getDepartmentComplaints(),
    enabled: !!departmentUser?.department?.id
  });

  if (isLoading) {
    return <Layout><LoadingSpinner /></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">
          {departmentUser.department?.name} Department Dashboard
        </h1>

        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              showResolveButton={true}
            />
          ))}

          {complaints.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No complaints for your department
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}