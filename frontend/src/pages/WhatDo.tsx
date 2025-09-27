import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

export function WhatDo() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative py-12">
        <div className="container mx-auto px-4">

          {/* Header */}
          <header className="mb-12 text-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-indigo-100 to-fuchsia-100 p-10 ring-1 ring-indigo-200/50 shadow-lg">
            <Info className="mx-auto w-12 h-12 text-indigo-700 mb-4" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
              What We Do
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              We help internet users in Bangladesh report cyber incidents safely, preserve important evidence, 
              and connect with the right authorities. Our platform also publishes up-to-date advisories 
              and step-by-step guidance to stay safe online.
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              Whether you are a student, parent, or small business owner, our goal is to provide practical tools 
              and verified guidance to protect yourself from scams, phishing, fraud, and other cyber threats.
            </p>
            <div className="mt-6 flex gap-4 justify-center flex-wrap">
              <Link
                to="/about"
                className="inline-flex items-center rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm hover:scale-105 shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 transition-all"
              >
                Back
              </Link>
            </div>
          </header>

          {/* Optional Highlights Section */}
          <section className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Report Safely</h2>
              <p className="text-gray-700 leading-relaxed">
                Submit details of suspicious messages, scams, or cyber incidents securely through our platform.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Preserve Evidence</h2>
              <p className="text-gray-700 leading-relaxed">
                Keep screenshots, chat logs, URLs, transaction IDs, and device info safe to support proper investigations.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Stay Informed</h2>
              <p className="text-gray-700 leading-relaxed">
                Get verified news, safety advisories, and step-by-step guidance to prevent online threats.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Connect With Authorities</h2>
              <p className="text-gray-700 leading-relaxed">
                We guide you to the correct authorities and police units in Bangladesh for proper reporting.
              </p>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
