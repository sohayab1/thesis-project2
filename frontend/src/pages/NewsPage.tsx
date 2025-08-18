import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  date: string;        // ISO string
  category: "Scams" | "Law & Policy" | "Awareness" | "Enforcement" | "Advisory";
  source?: string;     // e.g., "CID Press Note"
  externalUrl?: string;
  slug?: string;       // internal route like /news/:slug
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

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Latest News</h1>
            <p className="text-gray-600 mt-2">
              Updates, advisories, and safety tips for internet users in Bangladesh.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search news…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Report an Incident
          </Link>
        </div>

        {/* Results meta */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
          {category !== "All" ? ` in ${category}` : ""}.
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    item.category === "Scams"
                      ? "bg-red-50 text-red-700"
                      : item.category === "Advisory"
                      ? "bg-blue-50 text-blue-700"
                      : item.category === "Awareness"
                      ? "bg-amber-50 text-amber-800"
                      : item.category === "Law & Policy"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-emerald-50 text-emerald-700",
                  ].join(" ")}
                >
                  {item.category}
                </span>
                <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
              </div>

              <h2 className="text-lg font-semibold leading-snug mb-2">{item.title}</h2>
              <p className="text-gray-700 text-sm mb-4">{item.summary}</p>

              <div className="flex items-center justify-between">
                {item.slug ? (
                  <Link
                    to={`/news/${item.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                ) : item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium hover:underline"
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-16">
            <p className="text-lg font-medium">No news found</p>
            <p className="text-sm mt-1">Try a different keyword or category.</p>
          </div>
        )}

        {/* Bangladesh-focused footer note */}
        <div className="mt-12 rounded-2xl border bg-gray-50 p-6">
          <h3 className="font-semibold mb-2">Bangladesh Safety Note</h3>
          <p className="text-sm text-gray-700">
            For urgent threats, contact your nearest police station or appropriate authorities.
            When reporting online crimes, keep evidence like SMS, transaction IDs, screenshots,
            account handles, and URLs. Do not share your OTP or account PIN with anyone.
          </p>
        </div>
      </div>
    </Layout>
  );
}
