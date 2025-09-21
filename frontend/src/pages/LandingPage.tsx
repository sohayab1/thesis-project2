import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
// Import images with their proper extensions
import image1 from '@/assets/image-1.png';  // or .jpg/.jpeg depending on file type
import image2 from '@/assets/image-2.png';
import image3 from '@/assets/image-3.png';
import image4 from '@/assets/image-4.png';

import { 
  ArrowRight, 
  Play, 
  Stars, 
  Shield, 
  Bell, 
  Scale,
  ShieldCheck, 
  Database,
  FileText,
  Lock,
  Users,
  Wand2,
  MonitorSmartphone,
  Globe
} from "lucide-react";

// Reuse the Container and Pill components as is
const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500/10 to-sky-500/10 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
    {children}
  </span>
);

const CustomButton = ({ variant = "primary", className = "", children, onClick, ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all shadow-sm";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost: "bg-white/0 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  };
  return (
    <button 
      className={`${base} ${styles[variant]} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Testimonial = ({ name, title, logo }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-slate-200" />
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-600">{title}</p>
      </div>
      <div className="ml-auto h-6 w-16 rounded bg-slate-200" title={logo} />
    </div>
    <p className="mt-4 text-slate-700">
      "We used this tool to jump‑start small web projects and deliver code along with design. Service quality is outstanding."
    </p>
  </div>
);

const BlogCard = ({ date, title }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="text-xs text-slate-500">{date}</div>
    <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 line-clamp-2 text-sm text-slate-600">Short teaser goes here. Replace with your own article summary.</p>
    <CustomButton variant="ghost" className="mt-4">Read</CustomButton>
  </div>
);

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white py-12">
    <Container>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500" />
            <span className="text-lg font-bold">Cybercrime BD</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            Making the internet safer for everyone through community-driven cybercrime reporting.
          </p>
          <div className="mt-4 flex gap-3 opacity-70">
            {["in", "fb", "x", "ig"].map((s) => (
              <div key={s} className="h-8 w-8 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="/about">About</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="/guidelines">Guidelines</a></li>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/statistics">Statistics</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Cybercrime BD. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <CustomButton variant="ghost" className="!px-3 !py-1 text-xs">
            Accept cookies
          </CustomButton>
          <CustomButton variant="ghost" className="!px-3 !py-1 text-xs">
            Reject
          </CustomButton>
        </div>
      </div>
    </Container>
  </footer>
);

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Wand2,
      title: "Anonymous Reporting",
      desc: "Report cybercrime incidents securely with complete privacy.",
      bullets: ["End-to-end encryption", "No personal data required", "Secure evidence upload"]
    },
    {
      icon: MonitorSmartphone,
      title: "Real-time Updates",
      desc: "Track your case progress and get instant notifications.",
      bullets: ["Case status tracking", "Instant notifications", "Direct communication"]
    },
    {
      icon: Globe,
      title: "Expert Support",
      desc: "Get assistance from cybersecurity professionals.",
      bullets: ["24/7 support", "Professional investigation", "Legal guidance"]
    }
  ];

  const testimonials = [
    { name: "John Doe", title: "Cybersecurity Expert", logo: "CyberTech" },
    { name: "Jane Smith", title: "Digital Forensics", logo: "SecureNet" },
    { name: "Mike Johnson", title: "Law Enforcement", logo: "CyberForce" }
  ];

  const blogPosts = [
    { date: "Aug 15, 2025", title: "How to Stay Safe Online" },
    { date: "Aug 10, 2025", title: "Understanding Cyber Threats" },
    { date: "Aug 05, 2025", title: "The Future of Cybersecurity" }
  ];

  const stats = [
    { value: "24/7", label: "Support Available", sub: "Round the clock" },
    { value: "100%", label: "Secure Platform", sub: "End-to-end encryption" },
    { value: "5000+", label: "Cases Resolved", sub: "And counting" },
    { value: "98%", label: "Success Rate", sub: "In case resolution" }
  ];

  return (
    <div className="font-sans antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500" />
            <span className="text-lg font-bold tracking-tight">Cybercrime BD</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
            <a className="hover:text-slate-900" href="#features">Features</a>
            {/* <a className="hover:text-slate-900" href="/about">About</a> */}
            <Link className="hover:text-slate-900" to="/about">About</Link>
            {/* <a className="hover:text-slate-900" href="/news">News</a> */}
            <Link className="hover:text-slate-900" to="/news">News</Link>
            {/* <a className="hover:text-slate-900" href="/contact">Contact</a> */}
            <Link className="hover:text-slate-900" to="/contact">Contact</Link>
            {!isAuthenticated ? (
              <>
                <CustomButton variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </CustomButton>
                <CustomButton onClick={() => navigate('/register')}>
                  Report Now <ArrowRight className="h-4 w-4" />
                </CustomButton>
              </>
            ) : (
              <CustomButton onClick={() => navigate('/dashboard')}>
                Dashboard <ArrowRight className="h-4 w-4" />
              </CustomButton>
            )}
          </nav>
        </Container>
      </header>

      {/* Hero Section - Add image-1 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <Container className="relative grid grid-cols-1 items-center gap-10 py-20 md:grid-cols-2">
          <div className="space-y-6">
            <Pill>Cybercrime Reporting Platform</Pill>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
            >
              Make the Internet Safer Together
            </motion.h1>
            <p className="text-slate-600">
              Report cyber incidents securely and help us create a safer digital environment.
              Your voice matters in the fight against cybercrime.
            </p>
            <div className="flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <CustomButton onClick={() => navigate('/register')}>
                    Report Now <ArrowRight className="h-4 w-4" />
                  </CustomButton>
                  <CustomButton variant="ghost" onClick={() => navigate('/about')}>
                    Learn More <Play className="h-4 w-4" />
                  </CustomButton>
                </>
              ) : (
                <CustomButton onClick={() => navigate('/dashboard')}>
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </CustomButton>
              )}
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="relative"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <div 
                className="aspect-[16/10] w-full rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${image1})` }}
              />
            </div>
            <div className="pointer-events-none absolute -left-10 -top-10 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          </motion.div>
        </Container>
      </section>

      {/* Features Section - Add image-2 */}
      <section id="features" className="bg-white py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Our Services</Pill>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI‑powered Cybercrime Prevention
            </h2>
            <p className="mt-3 text-slate-600">
              Advanced technology meeting expert investigation for your safety.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="aspect-video w-full rounded-xl bg-cover bg-center"
                   style={{ backgroundImage: `url(${image2})` }} />
            </div>
          </div>
        </Container>
      </section>

      {/* Social Proof Section - Add image-3 */}
      <section className="bg-slate-50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Testimonials</Pill>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Trusted by Experts
            </h2>
            <p className="mt-3 text-slate-600">
              Hear from professionals who trust our platform.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Testimonial key={t.name} {...t} />
            ))}
          </div>
          <div className="mt-10">
            <div className="aspect-video w-full max-w-2xl mx-auto rounded-xl bg-cover bg-center"
                 style={{ backgroundImage: `url(${image3})` }} />
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-extrabold tracking-tight text-indigo-600">{value}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
                {sub && <p className="mt-2 text-xs text-slate-500">{sub}</p>}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section - Add image-4 */}
      <section className="bg-indigo-600 text-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Make the Internet Safer?
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Join our community of vigilant citizens working together to combat cybercrime.
              </p>
              {!isAuthenticated && (
                <div className="mt-8">
                  <CustomButton 
                    onClick={() => navigate('/register')}
                    className="bg-white text-indigo-600 hover:bg-white/90"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </CustomButton>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <img 
                src={image4} 
                alt="Cybersecurity" 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}