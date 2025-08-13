import { useQuery } from "@tanstack/react-query"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { users } from "@/services/api"
import { toast } from "sonner"

interface UserProfile {
  id: number;
  name: string;
  email: string;
  nidNumber: string;
  role: string;
  approved: boolean;
  departmentId?: number;
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: users.getProfile
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Loading profile...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-lg">{profile?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-lg">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">NID Number</label>
                <p className="text-lg">{profile?.nidNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-lg capitalize">{profile?.role?.toLowerCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-lg">{profile?.approved ? 'Approved' : 'Pending Approval'}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}