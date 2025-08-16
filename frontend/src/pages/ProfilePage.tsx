import { useAuth } from '@/hooks/useAuth';
import { Layout } from "@/components/layout/Layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate()

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">NID Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.nidNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.approved ? 'Approved' : 'Pending Approval'}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </Layout>
  )
}