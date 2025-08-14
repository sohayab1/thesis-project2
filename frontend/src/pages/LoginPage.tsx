import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Layout } from "@/components/layout/Layout"
import { toast } from "sonner"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
      toast.success('Login successful')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Login to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}