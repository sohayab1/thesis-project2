import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">CyberCrime Reporting</div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="container py-24 space-y-8 md:space-y-12">
          <div className="max-w-[64rem] space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Report Cybercrimes
              <br />
              <span className="text-primary">Safely & Securely</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A secure platform to report cyber crimes and track their resolution. We ensure your privacy and safety throughout the process.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" onClick={() => navigate('/register')}>
                Report a Crime
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-20 space-y-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="relative p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-bold">CyberCrime Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Making our digital space safer, one report at a time.
            </p>
          </div>
          {footerLinks.map((section, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Button variant="link" className="h-auto p-0">
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🔒",
    title: "Secure Reporting",
    description: "Submit reports securely with end-to-end encryption and anonymous reporting options.",
  },
  {
    icon: "📱",
    title: "Real-time Updates",
    description: "Track your case progress and receive instant updates on developments.",
  },
  {
    icon: "👥",
    title: "Expert Support",
    description: "Get assistance from cybercrime experts and law enforcement professionals.",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Security", "How it works", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Blog", "Documentation", "Help Center", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookie Policy"],
  },
];