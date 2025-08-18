import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

/** -----------------------------
 * Types
 * ----------------------------*/
type FraudType = {
  id: number;
  title: string;
  category:
    | "Mobile Wallet"
    | "Phishing"
    | "Social Media"
    | "E-commerce"
    | "Jobs & Finance"
    | "Identity & SIM"
    | "Malware & Ransomware";
  summary: string;
  redFlags: string[];
  whatToDo: string[];
  keywords?: string[];
  lastUpdated: string; // ISO date
  slug?: string; // internal route if you add detail pages later
};

type VideoItem = {
  id: number;
  title: string;
  youtubeId: string; // e.g., "abcdEFGH"
  categories: FraudType["category"][];
  description?: string;
};

/** -----------------------------
 * Sample Data (Bangladesh context)
 * Replace/extend as needed
 * ----------------------------*/
const FRAUD_TYPES: FraudType[] = [
  {
    id: 1,
    title: "bKash/Nagad OTP & Agent Impersonation",
    category: "Mobile Wallet",
    summary:
      "Fraudsters pose as support agents and ask for OTP/PIN to 'verify' or 'reverse' a transaction.",
    redFlags: [
      "Unexpected call/SMS asking for OTP or PIN",
      "Threats of account closure if you don't share codes",
      "Number not matching official helpline",
    ],
    whatToDo: [
      "Never share OTP/PIN/recovery codes",
      "Call official support from the app/website to verify",
      "Enable 2FA and set strong PIN; report suspicious calls",
    ],
    keywords: ["bkash", "nagad", "rocket", "OTP", "pin", "wallet"],
    lastUpdated: "2025-07-20",
    slug: "mfs-otp-agent-impersonation",
  },
  {
    id: 2,
    title: "Fake Government Portal / NID Phishing",
    category: "Phishing",
    summary:
      "Cloned portals collect NID, phone numbers, and passwords via look-alike links.",
    redFlags: [
      "Misspelled domain names",
      "No HTTPS or invalid certificate",
      "Promises of grants/benefits for immediate signup",
    ],
    whatToDo: [
      "Type official URLs manually or use bookmarks",
      "Check HTTPS padlock and domain spelling carefully",
      "Report suspicious sites and do not enter credentials",
    ],
    keywords: ["govt", "nid", "portal", "subsidy", "grant", "clone site"],
    lastUpdated: "2025-06-30",
    slug: "fake-govt-portal-nid-phishing",
  },
  {
    id: 3,
    title: "Festival Offer / E-commerce ‘Too Good to Be True’",
    category: "E-commerce",
    summary:
      "Fake shops or pages run steep discounts during Eid/Pohela Boishakh and never deliver.",
    redFlags: [
      "No verified seller badge or history",
      "Only prepayment, no cash-on-delivery",
      "Stock photos and newly created pages",
    ],
    whatToDo: [
      "Prefer COD; verify seller ratings and history",
      "Keep proof of order and payment",
      "Use platform dispute channels promptly",
    ],
    keywords: ["sale", "daraz", "facebook shop", "discount", "eid offer"],
    lastUpdated: "2025-04-08",
    slug: "festival-offer-ecommerce-scam",
  },
  {
    id: 4,
    title: "Job/Visa Processing & Advance Fee Scam",
    category: "Jobs & Finance",
    summary:
      "Fraudsters promise high-pay jobs or visas and demand ‘processing’ fees upfront.",
    redFlags: [
      "Unverified recruiters on social media",
      "No official email domain; only messaging apps",
      "Pressure to pay quickly to ‘secure a slot’",
    ],
    whatToDo: [
      "Verify companies via official websites",
      "Never pay upfront fees for jobs",
      "Use legitimate job portals and embassy resources",
    ],
    keywords: ["recruitment", "abroad", "work visa", "processing fee"],
    lastUpdated: "2025-06-18",
    slug: "job-visa-advance-fee",
  },
  {
    id: 5,
    title: "Romance/Intimate Video Blackmail",
    category: "Social Media",
    summary:
      "Scammers befriend victims, obtain compromising material, then extort money.",
    redFlags: [
      "Requests to move chats to private apps",
      "Fast intimacy and push for video calls",
      "Threats to leak content to friends/family",
    ],
    whatToDo: [
      "Stop contact; preserve evidence (IDs, chats, screenshots)",
      "Do not pay; payments rarely stop blackmail",
      "Report to platform and file an official complaint",
    ],
    keywords: ["sextortion", "imo", "whatsapp", "blackmail", "leak"],
    lastUpdated: "2025-05-29",
    slug: "romance-intimate-blackmail",
  },
  {
    id: 6,
    title: "Loan App Harassment & Data Misuse",
    category: "Jobs & Finance",
    summary:
      "Predatory apps give quick loans, then harass contacts and threaten public shaming.",
    redFlags: [
      "Excessive permissions (contacts, gallery, SMS)",
      "Hidden fees and impossible repayment terms",
      "Demands to message your contacts",
    ],
    whatToDo: [
      "Avoid side-loaded or unknown loan apps",
      "Revoke app permissions; collect evidence",
      "Complain to regulators and platform stores",
    ],
    keywords: ["loan", "microcredit", "play store", "permissions"],
    lastUpdated: "2025-05-12",
    slug: "loan-app-harassment",
  },
  {
    id: 7,
    title: "Facebook ‘Copyright Violation’ Page Phishing",
    category: "Phishing",
    summary:
      "Fake ‘Meta’ messages claim policy violations and ask you to log in via phishing pages.",
    redFlags: [
      "Links to non-Meta domains",
      "Generic threats and urgent deadlines",
      "DMs from pages with low followers/history",
    ],
    whatToDo: [
      "Use facebook.com/settings/security to review alerts",
      "Enable 2FA; never log in via third-party links",
      "Report the message/page to Meta",
    ],
    keywords: ["meta", "copyright", "page disabled", "appeal", "facebook"],
    lastUpdated: "2025-07-01",
    slug: "facebook-copyright-phish",
  },
  {
    id: 8,
    title: "SIM Swap / Reissue Takeover",
    category: "Identity & SIM",
    summary:
      "Fraudsters transfer your number to a new SIM to intercept OTPs and take account control.",
    redFlags: [
      "Sudden loss of network",
      "Unrecognized SIM replacement messages",
      "OTP requests for services you didn’t initiate",
    ],
    whatToDo: [
      "Contact operator immediately; lock SIM reissue",
      "Enable 2FA using app-based authenticators",
      "Update recovery emails/phones to secure ones",
    ],
    keywords: ["sim swap", "operator", "otp", "reissue", "port out"],
    lastUpdated: "2025-04-22",
    slug: "sim-swap",
  },
  {
    id: 9,
    title: "QR/Payment Request & Card Skimming",
    category: "E-commerce",
    summary:
      "Malicious QR codes and tampered POS/ATMs steal payment info or trigger unintended transfers.",
    redFlags: [
      "Unverified QR codes sent by strangers",
      "Damaged/loose ATM card slots, hidden cameras",
      "Merchants pushing QR for refunds",
    ],
    whatToDo: [
      "Verify recipients and amounts before paying",
      "Inspect ATMs; cover keypad; use trusted locations",
      "Set low card limits and enable alerts",
    ],
    keywords: ["qr", "pos", "atm", "skimmer", "refund"],
    lastUpdated: "2025-05-05",
    slug: "qr-scam-card-skimming",
  },
  {
    id: 10,
    title: "Ransomware & Malicious Attachments",
    category: "Malware & Ransomware",
    summary:
      "Emails or downloads install malware that encrypts files and demands payment.",
    redFlags: [
      "Unexpected attachments (ZIP/EXE) or macros",
      "Prompts to disable antivirus or open as admin",
      "Software cracks and pirated installers",
    ],
    whatToDo: [
      "Keep backups offline; patch OS/software",
      "Scan files; don’t enable macros for unknown docs",
      "Isolate infected device; seek professional help",
    ],
    keywords: ["virus", "malware", "crypto", "locker", "trojan"],
    lastUpdated: "2025-06-10",
    slug: "ransomware",
  },
];

const VIDEOS: VideoItem[] = [
  // Replace youtubeId with your own curated videos
  {
    id: 1,
    title: "প্রতারণার নতুন কৌশল: অনুসন্ধানে যা পেল পুলিশ | Online Fraud | BD Police | Chattogram 24 | Channel 24",
    youtubeId: "z8I5WbFHtxc",
    categories: ["Phishing", "E-commerce", "Social Media"],
    description:
        "Channel 24 report on evolving online fraud tactics in Bangladesh and what police found—useful for spotting red flags and knowing where to report.",
 },
  {
    id: 2,
    title: "আয়ের প্রলোভন দেখিয়ে অনলাইনে প্রতারণা | Online Fraud | Protidiner Bangladesh",
    youtubeId: "wfoMPhZvb_s",
    categories: ["Jobs & Finance", "Social Media", "Phishing"],
    description:
        "News segment from Protidiner Bangladesh about scams that lure victims with ‘earn money online’ promises—useful for spotting red flags and staying safe.",
 },
  {
    id: 3,
    title: "ইনফোস্টিলার ম্যালওয়্যার দিয়ে ইতিহাসের সবচেয়ে ভয়াবহ সাইবার হামলা | Cyber Attack | Tech Giant",
    youtubeId: "pX1Y0BDnz04",
    categories: ["Malware & Ransomware", "Phishing"],
    description:
        "Bangla explainer/report on info-stealer malware and a major cyber attack—useful awareness plus basic mitigation steps for Bangladesh users.",
 },
  {
    id: 4,
    title: "বিদেশি স্ক্যামারদের সাথে হাত মিলিয়ে প্রতারণা! | Scammer | Bangladesh | Somoy TV",
    youtubeId: "Cxv9oWdiA2Y",
    categories: ["Phishing", "Social Media", "Jobs & Finance"],
    description:
        "Somoy TV report highlighting how scammers collude (including foreign links) to defraud people in Bangladesh—useful awareness on common red flags.",
 },
];

const CATEGORIES: ReadonlyArray<FraudType["category"] | "All"> = [
  "All",
  "Mobile Wallet",
  "Phishing",
  "Social Media",
  "E-commerce",
  "Jobs & Finance",
  "Identity & SIM",
  "Malware & Ransomware",
];

/** -----------------------------
 * Helpers
 * ----------------------------*/
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** -----------------------------
 * Component
 * ----------------------------*/
export function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<"relevance" | "az">("relevance");

  const normalizedQuery = query.trim().toLowerCase();

  const fraudResults = useMemo(() => {
    let rows = FRAUD_TYPES.filter(
      (f) => category === "All" || f.category === category
    );

    // score by title + summary + keywords
    if (normalizedQuery) {
      rows = rows
        .map((f) => {
          const inTitle = f.title.toLowerCase().includes(normalizedQuery);
          const inSummary = f.summary.toLowerCase().includes(normalizedQuery);
          const inKeywords =
            f.keywords?.some((k) => k.toLowerCase().includes(normalizedQuery)) || false;
          const score = (inTitle ? 3 : 0) + (inSummary ? 2 : 0) + (inKeywords ? 1 : 0);
          return { f, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) =>
          sort === "az" ? a.f.title.localeCompare(b.f.title) : b.score - a.score
        )
        .map((x) => x.f);
    } else if (sort === "az") {
      rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    }

    return rows;
  }, [category, normalizedQuery, sort]);

  const videoResults = useMemo(() => {
    let rows = VIDEOS.filter(
      (v) => category === "All" || v.categories.includes(category as any)
    );

    if (normalizedQuery) {
      rows = rows.filter(
        (v) =>
          v.title.toLowerCase().includes(normalizedQuery) ||
          (v.description ?? "").toLowerCase().includes(normalizedQuery)
      );
    }

    if (sort === "az") {
      rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    }

    return rows;
  }, [category, normalizedQuery, sort]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold">Fraud Types in Bangladesh</h1>
          <p className="mt-3 text-gray-600">
            Learn common scams and online threats targeting people and small businesses in Bangladesh.
            Search by keyword, filter by category, and watch short videos to stay safe.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search fraud types or videos… (e.g., bKash, SIM swap, loan app)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-96 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="az">Sort: A–Z</option>
          </select>
        </div>

        {/* Quick category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={[
                "text-sm rounded-full px-3 py-1 border transition",
                category === c ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Meta */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {fraudResults.length} fraud type{fraudResults.length === 1 ? "" : "s"} and{" "}
          {videoResults.length} video{videoResults.length === 1 ? "" : "s"}
          {category !== "All" ? ` in ${category}` : ""}.
        </div>

        {/* Fraud Types Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Fraud Types</h2>
          {fraudResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fraudResults.map((item) => (
                <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium">
                      {item.category}
                    </span>
                    <time className="text-xs text-gray-500">
                      Updated {new Date(item.lastUpdated).toLocaleDateString()}
                    </time>
                  </div>

                  <h3 className="text-lg font-semibold leading-snug mb-2">
                    {highlight(item.title, query)}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {highlight(item.summary, query)}
                  </p>

                  {/* Red flags */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-1">Red flags</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {item.redFlags.map((f, idx) => (
                        <li key={idx}>{highlight(f, query)}</li>
                      ))}
                    </ul>
                  </div>

                  {/* What to do */}
                  <div>
                    <h4 className="text-sm font-semibold mb-1">What to do</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {item.whatToDo.map((f, idx) => (
                        <li key={idx}>{highlight(f, query)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {item.slug ? (
                      <Link to={`/fraud-types/${item.slug}`} className="text-sm font-medium hover:underline">
                        Learn more →
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">More info soon</span>
                    )}
                    <Link
                      to="/report-incident"
                      className="text-xs inline-flex items-center rounded-full border px-3 py-1 hover:bg-gray-50"
                    >
                      Report Incident
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p className="text-lg font-medium">No matching fraud types</p>
              <p className="text-sm mt-1">Try a broader keyword or another category.</p>
            </div>
          )}
        </section>

        {/* Videos Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Videos</h2>
          {videoResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoResults.map((v) => (
                <article key={v.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {v.categories.map((c) => (
                        <span key={c} className="text-[11px] inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug mb-2">
                    {highlight(v.title, query)}
                  </h3>
                  {v.description && (
                    <p className="text-sm text-gray-700 mb-3">{highlight(v.description, query)}</p>
                  )}
                  <div className="relative rounded-lg overflow-hidden border aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p className="text-lg font-medium">No videos found</p>
              <p className="text-sm mt-1">Try different keywords or category.</p>
            </div>
          )}
        </section>

        {/* Helpful CTAs */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Need help now?</h3>
              <p className="text-sm text-gray-700">
                If you've been targeted, preserve evidence and file a report. Our resource center explains next steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/report-incident" className="inline-flex items-center rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90">
                Report Incident
              </Link>
              <Link to="/resources" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
                Safety Resources
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            For emergencies or threats to life/safety, call <strong>999</strong> immediately.
          </p>
        </section>
      </div>
    </Layout>
  );
}
