import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { auth } from "@/services/api"
import { toast } from "sonner"

interface UserData {
  name: string;
  email: string;
  password: string;
  nidNumber: string;
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    nidNumber: "",
  })
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    nidFront: null,
    nidBack: null,
    selfieFront: null,
    selfieLeft: null,
    selfieRight: null,
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = event.target;
    if (fileList && fileList[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate all required files are present
      const requiredFiles = ['nidFront', 'nidBack', 'selfieFront', 'selfieLeft', 'selfieRight'];
      const missingFiles = requiredFiles.filter(key => !files[key]);
      
      if (missingFiles.length > 0) {
        toast.error(`Missing required files: ${missingFiles.join(', ')}`);
        return;
      }

      // Filter out null values and create files object
      const fileData = Object.entries(files).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {} as { [key: string]: File });

      await auth.register(userData, fileData);
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex justify-center py-8">
        <Card className="w-full max-w-2xl p-6">
          <h1 className="text-2xl font-bold mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">NID Number</label>
                <Input
                  name="nidNumber"
                  value={userData.nidNumber}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    nidNumber: e.target.value
                  }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">NID Front</label>
                <Input
                  type="file"
                  name="nidFront"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">NID Back</label>
                <Input
                  type="file"
                  name="nidBack"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Selfie Front</label>
                <Input
                  type="file"
                  name="selfieFront"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Selfie Left</label>
                <Input
                  type="file"
                  name="selfieLeft"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Selfie Right</label>
                <Input
                  type="file"
                  name="selfieRight"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/login')}>
                Already have an account?
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}