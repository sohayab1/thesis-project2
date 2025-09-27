import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { AlertTriangle, Newspaper, ShieldCheck, Info, Gavel } from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: "Scams" | "Law & Policy" | "Awareness" | "Enforcement" | "Advisory";
  source?: string;
  externalUrl?: string;
  slug?: string;
};

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Mobile Wallet Impersonation Messages Circulating",
    summary:
      "Reports of fake SMS/WhatsApp messages claiming to be from bKash/Nagad agents asking for OTP or PIN. Never share verification codes; legitimate operators will not ask.",
    date: "2025-07-28",
    category: "Scams",
    source: "Community reports",
    slug: "mobile-wallet-impersonation-warning",
  },
  {
    id: 2,
    title: "Guidelines for Reporting Cyber Incidents in Bangladesh",
    summary:
      "Not sure where to report? Start with your nearest police station or the specialized cyber unit. Preserve screenshots, transaction IDs, and chat logs before you file.",
    date: "2025-07-20",
    category: "Awareness",
    slug: "how-to-report-cyber-incidents-bd",
  },
  {
    id: 3,
    title: "Phishing Sites Mimicking Government Portals",
    summary:
      "Scammers are cloning public-service pages to harvest NID and phone numbers. Always check the URL spelling and look for HTTPS before submitting information.",
    date: "2025-06-30",
    category: "Advisory",
    source: "Community reports",
    slug: "govt-portal-phishing-clones",
  },
  {
    id: 4,
    title: "Job Offer Scams on Social Platforms",
    summary:
      "Fake recruiters offer high pay with upfront ‘processing fees’. Verify company domain emails, avoid payments, and use official career pages to apply.",
    date: "2025-06-18",
    category: "Scams",
    slug: "job-offer-scams-social-platforms",
  },
  {
    id: 5,
    title: "Deepfake Awareness: Spotting Manipulated Media",
    summary:
      "Rapid rise in AI-edited videos calls for caution. Check lighting inconsistencies, unnatural blinking, and cross-verify from multiple credible sources before sharing.",
    date: "2025-06-05",
    category: "Awareness",
    slug: "deepfake-awareness-checklist",
  },
  {
    id: 6,
    title: "Two-Factor Authentication: Bangladesh-Focused Setup Tips",
    summary:
      "Enable 2FA on email, social media, and mobile wallet apps. Prefer authenticator apps over SMS when available; keep backup codes offline.",
    date: "2025-05-26",
    category: "Advisory",
    slug: "2fa-setup-bangladesh",
  },
  {
    id: 7,
    title: "Staying Safe During Festival Season Online",
    summary:
      "E-commerce scams rise during Eid sales. Verify seller pages, avoid too-good-to-be-true offers, use cash-on-delivery where possible, and keep proof of purchase.",
    date: "2025-04-05",
    category: "Advisory",
    slug: "festival-season-ecommerce-safety",
  },
  {
    id: 8,
    title: "Social Media Account Recovery Essentials",
    summary:
      "Lose access to Facebook/Instagram? Prepare identity proof, last login device, and recovery email/phone. Start recovery from official help centers only.",
    date: "2025-03-22",
    category: "Awareness",
    slug: "social-media-account-recovery-essentials",
  },
];

const CATEGORIES = ["All", "Scams", "Advisory", "Awareness", "Law & Policy", "Enforcement"] as const;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let rows = [...NEWS];
    if (category !== "All") {
      rows = rows.filter((n) => n.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          (n.source ?? "").toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) =>
      sortOrder === "newest"
        ? +new Date(b.date) - +new Date(a.date)
        : +new Date(a.date) - +new Date(b.date)
    );
    return rows;
  }, [category, query, sortOrder]);

  const iconForCategory = (cat: string) => {
    switch (cat) {
      case "Scams":
        return <AlertTriangle className="w-4 h-4" />;
      case "Advisory":
        return <Info className="w-4 h-4" />;
      case "Awareness":
        return <Newspaper className="w-4 h-4" />;
      case "Law & Policy":
        return <Gavel className="w-4 h-4" />;
      case "Enforcement":
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-slate-200/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        <div className="container relative mx-auto px-4 py-12">
          {/* Header */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-100 via-fuchsia-100 to-amber-100 p-10 ring-1 ring-indigo-200/50 shadow-lg">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              Latest News
            </h1>
            <p className="mt-4 max-w-3xl text-gray-700 text-lg leading-relaxed">
              Updates, advisories, and safety tips for internet users in Bangladesh.
            </p>
          </header>

          {/* Search & Filters */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="🔍 Search news…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur px-4 py-2.5 shadow-md focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-offset-2 transition-all"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-fuchsia-300 focus:ring-offset-2 transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 transition-all"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Results */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                News & Advisories
              </h2>
              <p className="text-sm text-gray-600 italic">
                Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
                {category !== "All" ? ` in ${category}` : ""}.
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700">
                        {iconForCategory(item.category)} {item.category}
                      </span>
                      <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
                    </div>

                    <h3 className="text-lg font-semibold leading-snug mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      {item.slug ? (
                        <Link
                          to={`/news/${item.slug}`}
                          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
                        >
                          Read more →
                        </Link>
                      ) : item.externalUrl ? (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
                        >
                          Read more →
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">More info soon</span>
                      )}
                      {item.source && (
                        <span className="text-xs text-gray-500">Source: {item.source}</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-16">
                <p className="text-xl font-semibold">No news found</p>
                <p className="text-sm mt-1">Try a different keyword or category.</p>
              </div>
            )}
          </section>

          {/* Bangladesh Safety Note */}
          <div className="mt-12 rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-sm">
            <h3 className="font-semibold mb-2 text-indigo-800">Bangladesh Safety Note</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              For urgent threats, contact your nearest police station or appropriate authorities.
              When reporting online crimes, keep evidence like SMS, transaction IDs, screenshots,
              account handles, and URLs. Do not share your OTP or account PIN with anyone.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
