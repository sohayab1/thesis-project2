import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { NewsSection } from '@/components/layout/NewsSection';
import { Layout } from '@/components/layout/Layout';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Video IDs from the YouTube URLs
  const videos = [
    { id: 'lY9SgJGr5_g', title: 'Cyber Crime Prevention Video 1' },
    { id: 'ktLslyiM7G4', title: 'Cyber Crime Prevention Video 2' },
    { id: 'mFWXoE_ZUMg', title: 'Cyber Crime Prevention Video 3' },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-grow bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              সাইবার সুরক্ষা বাংলাদেশ
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              
              "ডিজিটাল বিশ্বকে সকলের জন্য নিরাপদ করতে আমাদের সাহায্য করুন। সাইবার অপরাধের ঘটনা রিপোর্ট করুন এবং একটি নিরাপদ অনলাইন পরিবেশ তৈরিতে অবদান রাখুন।"

            </p>
            {!isAuthenticated ? (
              <div className="space-x-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="secondary"
                  size="lg"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="secondary"
                  size="lg"
                >
                  Register
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                size="lg"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </section>

        {/* Featured Videos Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Be aware of cyber crimes and help us to prevent them
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg shadow-lg"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Report With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
                <p className="text-gray-600">
                  Get immediate attention to your reported incidents
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of cybersecurity experts is here to help
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
                <p className="text-gray-600">
                  Your information is protected with advanced security measures
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection />

        {/* Footer */}
        <Footer />
      </div>
    </Layout>
  );
}