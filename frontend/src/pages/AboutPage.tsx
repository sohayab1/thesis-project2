import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type AboutItem = {
  id: number;
  title: string;
  text: string;
  category: "About" | "How to Use" | "Goal" | "Safety" | "Evidence" | "FAQ";
  to?: string; // optional internal link
};

const ABOUT_ITEMS: AboutItem[] = [
  {
    id: 1,
    title: "What we do",
    text:
      "We help Bangladesh users report cyber incidents, preserve evidence, and find the right authority. We publish local advisories and step-by-step guidance.",
    category: "About",
  },
  {
    id: 2,
    title: "Who it’s for",
    text:
      "Everyday internet users, students, parents, and small businesses using social media, mobile wallets, or e-commerce in Bangladesh.",
    category: "About",
  },
  {
    id: 3,
    title: "Start: check advisories",
    text:
      "Visit the News page for current scams and safety tips before you act on suspicious messages.",
    category: "How to Use",
    to: "/news",
  },
  {
    id: 4,
    title: "Report an incident",
    text:
      "Go to Report Incident, describe what happened, attach screenshots, transaction IDs, and links.",
    category: "How to Use",
    to: "/report-incident",
  },
  {
    id: 5,
    title: "Follow recommended steps",
    text:
      "After submission, you’ll see tailored next steps: preserving evidence, account security, and where to file official complaints.",
    category: "How to Use",
    to: "/resources",
  },
  {
    id: 6,
    title: "Our goal for Bangladesh",
    text:
      "Reduce cybercrime harm through clear reporting, verified local guidance (EN/BN), and practical prevention for families, students, and SMEs.",
    category: "Goal",
  },
  {
    id: 7,
    title: "Safety basics",
    text:
      "Never share OTP, PIN, or recovery codes. Legitimate services won’t ask. Prefer authenticator apps over SMS when available.",
    category: "Safety",
  },
  {
    id: 8,
    title: "Evidence checklist",
    text:
      "Save screenshots, chat logs, phone numbers, URLs, transaction IDs, dates, and device info. Do not delete conversations.",
    category: "Evidence",
  },
  {
    id: 9,
    title: "FAQ: Where to report officially?",
    text:
      "Use nearby police station or specialized cyber units. Keep your evidence ready before filing. We’ll guide you to the right channel.",
    category: "FAQ",
    to: "/faq",
  },
  {
    id: 10,
    title: "FAQ: Account got hacked — what now?",
    text:
      "Change passwords, enable 2FA, revoke unknown sessions, and start platform recovery from official help centers only.",
    category: "FAQ",
    to: "/faq",
  },
];

const CATEGORIES = ["All", "About", "How to Use", "Goal", "Safety", "Evidence", "FAQ"] as const;

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

export function AboutPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [sortOrder, setSortOrder] = useState<"relevance" | "az">("relevance");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = ABOUT_ITEMS.filter((it) => category === "All" || it.category === category);

    // simple relevance: title match > text match
    if (q) {
      rows = rows
        .map((it) => {
          const inTitle = it.title.toLowerCase().includes(q);
          const inText = it.text.toLowerCase().includes(q);
          const score = (inTitle ? 2 : 0) + (inText ? 1 : 0);
          return { it, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) =>
          sortOrder === "az"
            ? a.it.title.localeCompare(b.it.title)
            : b.score - a.score
        )
        .map((x) => x.it);
    } else if (sortOrder === "az") {
      rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    }

    return rows;
  }, [query, category, sortOrder]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="max-w-3xl">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-3 text-gray-600">
            A community-first platform to report, track, and learn about cybercrime risks in Bangladesh.
            We focus on practical help, clear guidance, and verified information so you can stay safe online.
          </p>
        </header>

        {/* Search & Filters (like News) */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search About this website…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="az">Sort: A–Z</option>
          </select>
        </div>

        {/* Quick Answers (searchable) */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-2xl font-semibold">Quick Answers</h2>
            <p className="text-sm text-gray-600">
              Showing {results.length} {results.length === 1 ? "result" : "results"}
              {category !== "All" ? ` in ${category}` : ""}.
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug mb-2">
                    {highlight(item.title, query)}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {highlight(item.text, query)}
                  </p>
                  {item.to ? (
                    <Link to={item.to} className="text-sm font-medium hover:underline">
                      Go →
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400">Info</span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p className="text-lg font-medium">No matches found</p>
              <p className="text-sm mt-1">Try a broader keyword or switch category.</p>
            </div>
          )}
        </section>

        {/* Original About Sections (unchanged for browsing) */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">What We Do</h2>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              We help victims and at-risk users document incidents, preserve evidence, and find the right
              channel for reporting. We also publish safety advisories, step-by-step guides, and Bangladesh-specific resources.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Who It’s For</h2>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              Everyday internet users, students, parents, small businesses, and anyone who uses mobile wallets,
              social media, or e-commerce platforms in Bangladesh.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">How We Help</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Report an incident and organize your evidence</li>
              <li>Get clear do’s/don’ts for scams & breaches</li>
              <li>Learn recovery steps for accounts & payments</li>
              <li>Read Bangladesh-focused advisories and news</li>
            </ul>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">How to Use This Website</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-3">
                <li>
                  <strong>Check Advisories:</strong> Visit{" "}
                  <Link to="/news" className="underline">News</Link> for recent scams and safety tips.
                </li>
                <li>
                  <strong>Report an Incident:</strong> Go to{" "}
                  <Link to="/report-incident" className="underline">Report Incident</Link>, describe what happened,
                  and attach screenshots, transaction IDs, and links.
                </li>
                <li>
                  <strong>Follow Guidance:</strong> After submitting, you’ll see recommended next steps,
                  including preserving evidence and where to file an official complaint.
                </li>
                <li>
                  <strong>Learn & Prevent:</strong> Explore{" "}
                  <Link to="/resources" className="underline">Resources</Link> for 2FA, account recovery, and wallet safety.
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Quick Report</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link to="/login" className="inline-flex items-center rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90">
                  Report Incident
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Tip: Never share OTP, PIN, or recovery codes.
              </p>
            </div>
          </div>
        </section>

        {/* Goal */}
        <section className="mt-12 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-2xl font-semibold">Our Goal for the People of Bangladesh</h2>
          <p className="mt-3 text-gray-700 text-sm leading-relaxed">
            We aim to reduce cybercrime harm by making reporting simpler, guidance clearer, and learning easier—
            in Bangla and English. From mobile wallet scams to deepfakes, we provide verified, local context so
            families, students, and small businesses can stay safe online.
          </p>
          <ul className="mt-4 list-disc pl-5 text-gray-700 text-sm space-y-2">
            <li>Promote safe digital habits across schools and households</li>
            <li>Help victims document and report incidents effectively</li>
            <li>Publish timely advisories for emerging scams in Bangladesh</li>
            <li>Encourage responsible sharing and counter misinformation</li>
          </ul>
        </section>

        {/* Safety & Evidence */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Evidence & Safety Checklist</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              { title: "Preserve Proof", text: "Save screenshots, chat logs, phone numbers, URLs, transaction IDs, and dates." },
              { title: "Secure Accounts", text: "Change passwords, enable 2FA, and check sessions/devices right away." },
              { title: "Report Quickly", text: "Use official channels; don’t engage scammers further after evidence is saved." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Need help now?</h3>
              <p className="text-sm text-gray-700">
                Start a report, read the FAQ, or message us. We’ll point you to the right steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90">
                Start a Report
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            For emergencies or threats to life/safety, call 999 immediately.
          </p>
        </section>
      </div>
    </Layout>
  );
}
