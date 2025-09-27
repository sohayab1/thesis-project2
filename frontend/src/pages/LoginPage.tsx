import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

import image4 from '@/assets/image-6.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await login(formData.get('email') as string, formData.get('password') as string);
      toast.success('Login successful');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
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
                "Together we can make the digital world safer for everyone."
              </p>
              <footer className="text-sm">Cybercrime Prevention Unit</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                LOGIN
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to sign in to your account (আপনার অ্যাকাউন্টে প্রবেশ করতে আপনার শংসাপত্রগুলি লিখুন)
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}