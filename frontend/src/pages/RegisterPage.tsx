import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { auth } from "@/services/api"
import { toast } from "sonner"
import { GalleryVerticalEnd } from "lucide-react"

import image4 from '@/assets/image-8.png';


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
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Hero section */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <GalleryVerticalEnd className="mr-2 h-6 w-6" />
            CyberCrime Reporting
          </div>
          <img
            src={image4}
            alt="Cybercrime"
            className="relative z-20 mt-10 rounded-lg"
          />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Join our community in making the digital world safer. Your registration helps us combat cybercrime more effectively."
              </p>
              <footer className="text-sm">Cybercrime Prevention Unit</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to register for a new account (নতুন অ্যাকাউন্টের জন্য নিবন্ধন করতে আপনার বিবরণ লিখুন)
              </p>
            </div>

            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Full Name</label>
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

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Email</label>
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

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Password</label>
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

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">NID Number (13 to 17 Digit)</label>
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

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">NID Front / Birth Certificate</label>
                    <Input
                      type="file"
                      name="nidFront"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">NID Back / Birth Certificate</label>
                    <Input
                      type="file"
                      name="nidBack"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Selfie Front</label>
                    <Input
                      type="file"
                      name="selfieFront"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Selfie Left</label>
                    <Input
                      type="file"
                      name="selfieLeft"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Selfie Right</label>
                    <Input
                      type="file"
                      name="selfieRight"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/login')}>
                    Already have an account?
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}