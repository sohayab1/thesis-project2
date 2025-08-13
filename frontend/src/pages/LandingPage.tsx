import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

type ReporterType = "victim" | "reporter" | "business" | "witness";

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ReporterType | null>(null);

  const handleStartReport = (type: ReporterType) => {
    if (!user) {
      navigate('/login', { state: { reporterType: type } });
    } else {
      navigate('/complaints/new', { state: { reporterType: type } });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Report Cybercrime Securely
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Help make the digital world safer by reporting cybercrimes. Your report matters.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                Login to Report
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </div>
          )}
        </section>

        {/* Reporter Type Selection */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Please select the option that best describes you:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className={`p-6 cursor-pointer transition ${
                selectedType === 'victim' ? 'border-primary' : ''
              }`}
              onClick={() => handleStartReport('victim')}
            >
              <h3 className="font-semibold mb-2">I am a victim</h3>
              <p className="text-sm text-muted-foreground">
                Report a cybercrime that directly affected you
              </p>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition ${
                selectedType === 'reporter' ? 'border-primary' : ''
              }`}
              onClick={() => handleStartReport('reporter')}
            >
              <h3 className="font-semibold mb-2">Reporting for a victim</h3>
              <p className="text-sm text-muted-foreground">
                Report on behalf of someone else
              </p>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition ${
                selectedType === 'business' ? 'border-primary' : ''
              }`}
              onClick={() => handleStartReport('business')}
            >
              <h3 className="font-semibold mb-2">A business</h3>
              <p className="text-sm text-muted-foreground">
                Report a cybercrime affecting your business
              </p>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition ${
                selectedType === 'witness' ? 'border-primary' : ''
              }`}
              onClick={() => handleStartReport('witness')}
            >
              <h3 className="font-semibold mb-2">A witness</h3>
              <p className="text-sm text-muted-foreground">
                Report a cybercrime you've witnessed
              </p>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}