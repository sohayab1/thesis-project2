import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Shield, FileCheck, HelpCircle, Target, Info, Lightbulb } from "lucide-react";

// --- (keeping your AboutItem and ABOUT_ITEMS the same) ---

type AboutItem = {
  id: number;
  title: string;
  text: string;
  category: "About" | "How to Use" | "Goal" | "Safety" | "Evidence" | "FAQ";
  to?: string;
};

const ABOUT_ITEMS: AboutItem[] = [
  { id: 1, title: "What we do", text: "We help Bangladesh users report cyber incidents, preserve evidence, and find the right authority. We publish local advisories and step-by-step guidance.", category: "About" , to: "/what-we-do"},
  // { id: 2, title: "Who it’s for", text: "Everyday internet users, students, parents, and small businesses using social media, mobile wallets, or e-commerce in Bangladesh.", category: "About" },
  { id: 3, title: "Start: check advisories", text: "Visit the News page for current scams and safety tips before you act on suspicious messages.", category: "How to Use", to: "/news" },
  { id: 4, title: "Report an incident", text: "Go to Report Incident, describe what happened, attach screenshots, transaction IDs, and links.", category: "How to Use", to: "/guide" },
  { id: 5, title: "Follow recommended steps", text: "After submission, you’ll see tailored next steps: preserving evidence, account security, and where to file official complaints.", category: "How to Use", to: "/resources" },
  { id: 6, title: "Our goal for Bangladesh", text: "Reduce cybercrime harm through clear reporting, verified local guidance (EN/BN), and practical prevention for families, students, and SMEs.", category: "Goal" , to: "/goal"},

];

const CATEGORIES = ["All", "About", "How to Use", "Goal", "Safety", "Evidence", "FAQ"] as const;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark
        key={i}
        className="bg-gradient-to-r from-amber-200 to-yellow-200 px-0.5 rounded animate-pulse"
      >
        {part}
      </mark>
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
    if (q) {
      rows = rows
        .map((it) => {
          const inTitle = it.title.toLowerCase().includes(q);
          const inText = it.text.toLowerCase().includes(q);
          const score = (inTitle ? 2 : 0) + (inText ? 1 : 0);
          return { it, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => (sortOrder === "az" ? a.it.title.localeCompare(b.it.title) : b.score - a.score))
        .map((x) => x.it);
    } else if (sortOrder === "az") {
      rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    }
    return rows;
  }, [query, category, sortOrder]);

  const iconForCategory = (cat: string) => {
    switch (cat) {
      case "Safety":
        return <Shield className="w-4 h-4" />;
      case "Evidence":
        return <FileCheck className="w-4 h-4" />;
      case "FAQ":
        return <HelpCircle className="w-4 h-4" />;
      case "Goal":
        return <Target className="w-4 h-4" />;
      case "How to Use":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-grid-slate-200/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        <div className="container relative mx-auto px-4 py-12">

          {/* Header */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-indigo-100 to-fuchsia-100 p-10 ring-1 ring-indigo-200/50 shadow-lg">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              About Us
            </h1>
            <p className="mt-4 max-w-3xl text-gray-700 text-lg leading-relaxed">
              A community-first platform to report, track, and learn about cybercrime risks in Bangladesh. We focus on practical help, clear guidance, and verified information so users stay safe online.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <Link to="/login" className="inline-flex items-center rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm hover:scale-105 shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 transition-all">
                Start a Report
              </Link>
            </div>
          </header>

          {/* Search & Filters */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="🔍 Search About this website…"
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
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 transition-all"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="az">Sort: A–Z</option>
            </select>
          </div>

          {/* Quick Answers */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                Quick Answers
              </h2>
              <p className="text-sm text-gray-600 italic">
                Showing {results.length} {results.length === 1 ? "result" : "results"}
                {category !== "All" ? ` in ${category}` : ""}.
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700">
                        {iconForCategory(item.category)} {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-2 text-gray-900">
                      {highlight(item.title, query)}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {highlight(item.text, query)}
                    </p>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg px-1 transition-colors"
                      >
                        Go →
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Info</span>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-16">
                <p className="text-xl font-semibold">No matches found</p>
                <p className="text-sm mt-1">Try a broader keyword or switch category.</p>
              </div>
            )}
          </section>

          {/* --- The rest of your original sections remain intact --- */}
          {/* They will automatically inherit the background gradients and hover effects added above */}

        </div>
      </div>
    </Layout>
  );
}
