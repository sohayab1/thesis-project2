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
  slug?: string;
  url?: string;
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
    url: "https://www.newsbangla24.com/investigation/152543/Terrible-deception-in-the-name-of-development",
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
    url: "https://www.thedailystar.net/news/bangladesh/crime-justice/news/fraudsters-sneak-nid-server-again-3548116",
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
    url: "https://daraz.com.bd/helpcenter/safe-shopping",
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
    url: "https://www.securitywatchdog.org.uk/latest-news/reported-increase-in-work-visa-scams-in-bangladesh-nationals/",
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
    url: "https://www.bbc.com/news/magazine-37735368",
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
    url: "https://www.thedailystar.net/tech-startup/news/facebook-page-scam-hackers-target-bangladeshi-pages-agencies-3384571",
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
    url: "https://xtncognitivesecurity.com/sim-swap-attack-the-silent-threat/",
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
    url: "https://razorpay.com/learn/fake-qr-code-scams/",
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
  {
    id: 1,
    title:
      "প্রতারণার নতুন কৌশল: অনুসন্ধানে যা পেল পুলিশ | Online Fraud | BD Police | Chattogram 24 | Channel 24",
    youtubeId: "z8I5WbFHtxc",
    categories: ["Phishing", "E-commerce", "Social Media"],
    description:
      "Channel 24 report on evolving online fraud tactics in Bangladesh and what police found—useful for spotting red flags and knowing where to report.",
  },
  {
    id: 2,
    title:
      "আয়ের প্রলোভন দেখিয়ে অনলাইনে প্রতারণা | Online Fraud | Protidiner Bangladesh",
    youtubeId: "wfoMPhZvb_s",
    categories: ["Jobs & Finance", "Social Media", "Phishing"],
    description:
      "News segment from Protidiner Bangladesh about scams that lure victims with ‘earn money online’ promises—useful for spotting red flags and staying safe.",
  },
  {
    id: 3,
    title:
      "ইনফোস্টিলার ম্যালওয়্যার দিয়ে ইতিহাসের সবচেয়ে ভয়াবহ সাইবার হামলা | Cyber Attack | Tech Giant",
    youtubeId: "pX1Y0BDnz04",
    categories: ["Malware & Ransomware", "Phishing"],
    description:
      "Bangla explainer/report on info-stealer malware and a major cyber attack—useful awareness plus basic mitigation steps for Bangladesh users.",
  },
  {
    id: 4,
    title:
      "বিদেশি স্ক্যামারদের সাথে হাত মিলিয়ে প্রতারণা! | Scammer | Bangladesh | Somoy TV",
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
      <mark
        key={i}
        className="bg-gradient-to-r from-amber-200 to-yellow-200 px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** -----------------------------
 * Component (AboutPage-like format)
 * ----------------------------*/
export function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<"relevance" | "az">("relevance");

  const normalizedQuery = query.trim().toLowerCase();

  const fraudResults = useMemo(() => {
    let rows = FRAUD_TYPES.filter(
      (f) => category === "All" || f.category === category
    );

    if (normalizedQuery) {
      rows = rows
        .map((f) => {
          const inTitle = f.title.toLowerCase().includes(normalizedQuery);
          const inSummary = f.summary.toLowerCase().includes(normalizedQuery);
          const inKeywords =
            f.keywords?.some((k) =>
              k.toLowerCase().includes(normalizedQuery)
            ) || false;
          const score =
            (inTitle ? 3 : 0) + (inSummary ? 2 : 0) + (inKeywords ? 1 : 0);
          return { f, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) =>
          sort === "az"
            ? a.f.title.localeCompare(b.f.title)
            : b.score - a.score
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
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-grid-slate-200/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        <div className="container relative mx-auto px-4 py-12">
          {/* Header (gradient, like AboutPage) */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-indigo-100 to-fuchsia-100 p-10 ring-1 ring-indigo-200/50 shadow-lg">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              Fraud Types in Bangladesh
            </h1>
            <p className="mt-4 max-w-3xl text-gray-700 text-lg leading-relaxed">
              Learn common scams and online threats targeting people and small businesses in Bangladesh. Search by keyword, filter by category, and watch short videos to stay safe.
            </p>

          </header>

          {/* Search & Filters (styled like AboutPage) */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="🔍 Search fraud types or videos… (e.g., bKash, SIM swap, loan app)"
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
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 transition-all"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="az">Sort: A–Z</option>
            </select>
          </div>

          {/* Summary line */}
          <div className="mt-6 text-sm text-gray-600 italic">
            Showing {fraudResults.length} fraud type{fraudResults.length === 1 ? "" : "s"} and {videoResults.length} video{videoResults.length === 1 ? "" : "s"}{category !== "All" ? ` in ${category}` : ""}.
          </div>

          {/* Fraud Types (styled cards like Quick Answers) */}
          <section className="mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                Fraud Types
              </h2>
            </div>

            {fraudResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fraudResults.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700">
                        {item.category}
                      </span>
                      <time className="text-xs text-gray-500">
                        Updated {new Date(item.lastUpdated).toLocaleDateString()}
                      </time>
                    </div>

                    <h3 className="text-lg font-semibold leading-snug mb-2 text-gray-900">
                      {highlight(item.title, query)}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {highlight(item.summary, query)}
                    </p>

                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-1 text-rose-700">Red flags</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 marker:text-rose-500">
                        {item.redFlags.map((f, idx) => (
                          <li key={idx}>{highlight(f, query)}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-emerald-700">What to do</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 marker:text-emerald-500">
                        {item.whatToDo.map((f, idx) => (
                          <li key={idx}>{highlight(f, query)}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg px-1 transition-colors"
                        >
                          Learn more →
                        </a>
                      ) : item.slug ? (
                        <Link
                          to={`/fraud-types/${item.slug}`}
                          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg px-1 transition-colors"
                        >
                          Learn more →
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">More info soon</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-16">
                <p className="text-xl font-semibold">No matching fraud types</p>
                <p className="text-sm mt-1">Try a broader keyword or another category.</p>
              </div>
            )}
          </section>

          {/* Videos Section (mirrors card style) */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Videos
            </h2>
            {videoResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoResults.map((v) => (
                  <article
                    key={v.id}
                    className="group rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-1">
                        {v.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[11px] inline-flex items-center rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 px-2 py-0.5 ring-1 ring-black/5 text-gray-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-2 text-gray-900">
                      {highlight(v.title, query)}
                    </h3>
                    {v.description && (
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {highlight(v.description, query)}
                      </p>
                    )}
                    <div className="relative rounded-lg overflow-hidden border border-indigo-100 aspect-video shadow-sm">
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
              <div className="text-center text-gray-600 py-16">
                <p className="text-xl font-semibold">No videos found</p>
                <p className="text-sm mt-1">Try different keywords or category.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
