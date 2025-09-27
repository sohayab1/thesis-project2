import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";

export function GoalPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative py-12">
        <div className="container mx-auto px-4">

          {/* Header */}
          <header className="mb-12 text-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-indigo-100 to-fuchsia-100 p-10 ring-1 ring-indigo-200/50 shadow-lg">
            <Target className="mx-auto w-12 h-12 text-indigo-700 mb-4" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
              Our Goal for Bangladesh
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              Our goal is to reduce the impact of cybercrime across Bangladesh by providing 
              clear guidance, practical reporting tools, and verified local advisories. 
              We aim to empower everyday internet users, students, parents, and small businesses 
              with the knowledge and resources they need to stay safe online.
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              We focus on three main objectives:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto space-y-2">
              <li>Provide step-by-step guidance to report cyber incidents correctly.</li>
              <li>Publish trusted, verified safety advisories in both English and Bangla.</li>
              <li>Promote awareness and practical prevention strategies for families, students, and SMEs.</li>
            </ul>
            <div className="mt-6 flex gap-4 justify-center flex-wrap">
              <Link
                to="/about"
                className="inline-flex items-center rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm hover:scale-105 shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 transition-all"
              >
                Back
              </Link>
            </div>
          </header>

          {/* Optional Callout Section */}
          <section className="mt-12 bg-white rounded-3xl shadow-md p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">Why This Matters</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Cybercrime can affect anyone, from students to small businesses. By empowering users 
              with clear information, safe practices, and guidance to report incidents, we help 
              create a safer internet for everyone in Bangladesh.
            </p>
          </section>

        </div>
      </div>
    </Layout>
  );
}
