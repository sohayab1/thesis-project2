import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { admin } from "@/services/api";
import { ImageViewer } from "@/components/ImageViewer";
import { UserRole } from '@/types/enums';
import type { ComplaintDto, UserDto } from '@/types/dto';
import { User } from "@/types/user";
import { Complaint } from "@/types/complaint";

export function AdminDashboardPage() {
  const { data: allComplaints = [], isLoading: complaintsLoading } = useQuery<ComplaintDto[]>({
    queryKey: ['adminComplaints'],
    queryFn: admin.getAllComplaints,
    retry: 1
  });

  const queryClient = useQueryClient();
  const [pendingUsers, setPendingUsers] = useState<UserDto[]>([]);
  const [activeTab, setActiveTab] = useState('pending-users');
  const [loading, setLoading] = useState(false);

  const { data: fetchedPendingUsers = [], refetch: refetchPendingUsers } = useQuery<UserDto[]>({
      queryKey: ['pendingUsers'],
      queryFn: admin.getPendingUsers,
      retry: false,
  });

  useEffect(() => {
      if (fetchedPendingUsers) {
          setPendingUsers(fetchedPendingUsers);
      }
  }, [fetchedPendingUsers]);

  const handleUserApproval = async (userId: number, approved: boolean) => {
      try {
          setLoading(true);
          if (approved) {
              await admin.approveUser(userId);
              toast.success('User approved successfully');
              setPendingUsers(current => current.filter(user => user.id !== userId));
          } else {
              await admin.rejectUser(userId);
              toast.success('User rejected successfully');
              setPendingUsers(current => current.filter(user => user.id !== userId));
          }
          await queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
      } catch (error: any) {
          console.error('Error:', error);
          toast.error(error.response?.data?.message || 'Failed to process user approval');
      } finally {
          setLoading(false);
      }
  };

  const handleComplaintResolve = async (complaintId: number) => {
      try {
          setLoading(true);
          await admin.resolveComplaint(complaintId);
          toast.success('Complaint resolved successfully');
          // Fix the invalidation
          await queryClient.invalidateQueries({ queryKey: ['adminComplaints'] as const });
      } catch (error) {
          toast.error('Failed to resolve complaint');
      } finally {
          setLoading(false);
      }
  };

  // Show error states
  if (complaintsLoading) {
      return (
          <Layout>
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                      <p className="mt-2">Processing...</p>
                  </div>
              </div>
          </Layout>
      );
  }

  return (
      <Layout>
          <div className="container mx-auto py-6">
              <Tabs defaultValue="pending-users" onValueChange={setActiveTab}>
                  <TabsList>
                      <TabsTrigger value="pending-users">Pending Users</TabsTrigger>
                      <TabsTrigger value="all-complaints">All Complaints</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending-users">
                      {pendingUsers.length === 0 ? (
                          <Card>
                              <CardContent className="py-8 text-center">
                                  <p className="text-muted-foreground">No pending users</p>
                              </CardContent>
                          </Card>
                      ) : (
                          <div className="grid gap-4">
                              {pendingUsers.map((user: User) => (
                                  <Card key={user.id}>
                                      <CardHeader>
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <CardTitle>{user.name}</CardTitle>
                                                  <p className="text-sm text-muted-foreground mt-1">
                                                      Email: {user.email}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                      NID: {user.nidNumber}
                                                  </p>
                                              </div>
                                              <div className="flex space-x-2">
                                                  <Button 
                                                      onClick={() => handleUserApproval(user.id, true)}
                                                      variant="default"
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
                                      </CardHeader>
                                      <CardContent>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              <ImageViewer src={user.nidFrontPath} alt="NID Front" />
                                              <ImageViewer src={user.nidBackPath} alt="NID Back" />
                                              <ImageViewer src={user.selfieFrontPath} alt="Selfie Front" />
                                              <ImageViewer src={user.selfieLeftPath} alt="Selfie Left" />
                                          </div>
                                      </CardContent>
                                  </Card>
                              ))}
                          </div>
                      )}
                  </TabsContent>

                  <TabsContent value="all-complaints">
                      {complaintsLoading ? (
                          <LoadingSpinner />
                      ) : !allComplaints?.length ? (
                          <Card>
                              <CardContent className="py-8 text-center">
                                  <p className="text-muted-foreground">No complaints found</p>
                              </CardContent>
                          </Card>
                      ) : (
                          <div className="grid gap-4">
                              {allComplaints.map((complaint: ComplaintDto) => (
                                  <Card key={complaint.id}>
                                      <CardHeader>
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <CardTitle>{complaint.title}</CardTitle>
                                                  <p className="text-sm text-muted-foreground">
                                                      Filed by: {complaint.user?.name || 'Unknown'}
                                                  </p>
                                              </div>
                                              <div className="flex flex-col items-end space-y-2">
                                                  <Badge>{complaint.status}</Badge>
                                                  {complaint.status !== 'RESOLVED' && (
                                                      <Button 
                                                          size="sm"
                                                          onClick={() => handleComplaintResolve(complaint.id)}
                                                      >
                                                          Mark as Resolved
                                                      </Button>
                                                  )}
                                              </div>
                                          </div>
                                      </CardHeader>
                                      <CardContent>
                                          <div className="space-y-4">
                                              <div>
                                                  <h4 className="font-medium">Description</h4>
                                                  <p>{complaint.description}</p>
                                              </div>

                                              {complaint.suspect && (
                                                  <div>
                                                      <h4 className="font-medium">Suspect Information</h4>
                                                      <p>Name: {complaint.suspect.name}</p>
                                                      <p>Contact: {complaint.suspect.contact}</p>
                                                      <p>Address: {complaint.suspect.address}</p>
                                                  </div>
                                              )}

                                              {complaint.feedback && (
                                                  <div>
                                                      <h4 className="font-medium">Feedback</h4>
                                                      <div className="flex items-center gap-2">
                                                          <p>Rating: {complaint.feedback.rating}/5</p>
                                                          <p>{complaint.feedback.comment}</p>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      </CardContent>
                                  </Card>
                              ))}
                          </div>
                      )}
                  </TabsContent>
              </Tabs>
          </div>
      </Layout>
  );
}

function LoadingSpinner() {
  return (
      <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
  );
}