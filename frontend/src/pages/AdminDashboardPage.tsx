import { useQueries, useQuery } from "@tanstack/react-query"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { admin } from "@/services/api"

interface User {
  id: number;
  name: string;
  email: string;
  nidNumber: string;
}

interface Department {
  id: number;
  name: string;
}

interface Evidence {
  id: number;
  fileName: string;
}

interface Feedback {
  rating: number;
  comment: string;
}

type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  location?: string;
  incidentDate?: string;
  priority?: string;
  resolvedDate?: string;
  userId: number;
  user?: User;
  departmentId?: number;
  department?: Department;
  evidences?: Evidence[];
  feedback?: Feedback;
}

const formatDate = (date: string | undefined): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

export function AdminDashboardPage() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['pendingUsers'],
        queryFn: admin.getPendingUsers,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30, // Changed from cacheTime to gcTime
      },
      {
        queryKey: ['adminComplaints'],
        queryFn: admin.getAllComplaints,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      }
    ]
  })

  const [pendingUsersQuery, complaintsQuery] = results
  const { data: pendingUsers, refetch: refetchUsers } = pendingUsersQuery
  const { data: allComplaints, isLoading: complaintsLoading } = complaintsQuery

  const handleUserApproval = async (userId: number, approved: boolean) => {
    try {
      if (approved) {
        await admin.approveUser(userId)
        toast.success('User approved successfully')
      } else {
        await admin.rejectUser(userId)
        toast.success('User rejected successfully')
      }
      refetchUsers()
    } catch (error) {
      toast.error('Failed to process user approval')
    }
  }

  const getStatusColor = (status: ComplaintStatus): string => {
    const colors: Record<ComplaintStatus, string> = {
      'PENDING': 'bg-yellow-500',
      'IN_PROGRESS': 'bg-blue-500',
      'RESOLVED': 'bg-green-500',
      'REJECTED': 'bg-red-500'
    };
    return colors[status];
  };

  if (complaintsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="pending-users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending-users">Pending Users</TabsTrigger>
            <TabsTrigger value="all-complaints">All Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-users">
            <div className="grid gap-4">
              {!pendingUsers?.length ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No pending approvals
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingUsers.map((user: User) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">NID:</span> {user.nidNumber}</p>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleUserApproval(user.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleUserApproval(user.id, false)}
                            variant="destructive"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-complaints">
            <div className="grid gap-4">
              {!allComplaints?.length ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No complaints filed yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                allComplaints.map((complaint: Complaint) => (
                  <Card key={complaint.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{complaint.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            ID: {complaint.id}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {complaint.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h4 className="font-medium mb-2">Complainant Details</h4>
                            <p className="text-sm">Name: {complaint.user?.name || 'Unknown'}</p>
                            <p className="text-sm">Email: {complaint.user?.email || 'N/A'}</p>
                            <p className="text-sm">NID: {complaint.user?.nidNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Incident Details</h4>
                            <p className="text-sm">Location: {complaint.location || 'N/A'}</p>
                            <p className="text-sm">Date: {formatDate(complaint.incidentDate)}</p>
                            <p className="text-sm">Priority: {complaint.priority || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Processing Details</h4>
                          <p className="text-sm">Department: {complaint.department?.name || 'Unassigned'}</p>
                          <p className="text-sm">Filed on: {formatDate(complaint.createdAt)}</p>
                          {complaint.resolvedDate && (
                            <p className="text-sm">Resolved on: {formatDate(complaint.resolvedDate)}</p>
                          )}
                        </div>

                        {complaint.feedback && (
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Feedback</h4>
                            <p className="text-sm">Rating: {complaint.feedback.rating}/5</p>
                            <p className="text-sm text-muted-foreground">{complaint.feedback.comment}</p>
                          </div>
                        )}

                        {complaint.evidences && complaint.evidences.length > 0 && (
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Evidence Files</h4>
                            <div className="flex gap-2">
                              {complaint.evidences.map((evidence, index) => (
                                <a
                                  key={index}
                                  href={`/api/evidences/${evidence.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Evidence {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}