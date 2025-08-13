import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type AuthMode = "login" | "register";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const reporterType = location.state?.reporterType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }

      toast.success(`Successfully ${mode === "login" ? "logged in" : "registered"}!`);
      
      if (reporterType) {
        navigate('/complaints/new', { state: { reporterType } });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(mode === "login" ? "Invalid credentials" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-[400px] p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login" 
                ? "Enter your credentials to continue" 
                : "Fill in your details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : mode === "login" ? "Login" : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}