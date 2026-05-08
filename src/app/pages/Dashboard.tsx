import {
  UserCircle,
  FileText,
  PiggyBank,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../lib/api";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "ca" | "self" | "saving" | "compliance"
  >("ca");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = getApiUrl();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          credentials: "include",
        });
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/login";
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hi {profile?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back to your tax dashboard.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 text-center md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setActiveTab("ca")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === "ca" ? "border-green-500 bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"}`}
          >
            <UserCircle
              className={`w-8 h-8 mb-2 ${activeTab === "ca" ? "text-green-600" : "text-gray-400"}`}
            />
            <span
              className={`font-semibold text-sm ${activeTab === "ca" ? "text-green-700" : "text-gray-600"}`}
            >
              CA Assisted Filing
            </span>
          </button>

          <button
            onClick={() => setActiveTab("self")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === "self" ? "border-green-500 bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"}`}
          >
            <FileText
              className={`w-8 h-8 mb-2 ${activeTab === "self" ? "text-green-600" : "text-gray-400"}`}
            />
            <span
              className={`font-semibold text-sm ${activeTab === "self" ? "text-green-700" : "text-gray-600"}`}
            >
              Self Filing
            </span>
          </button>

          <button
            onClick={() => setActiveTab("saving")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === "saving" ? "border-green-500 bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"}`}
          >
            <PiggyBank
              className={`w-8 h-8 mb-2 ${activeTab === "saving" ? "text-green-600" : "text-gray-400"}`}
            />
            <span
              className={`font-semibold text-sm ${activeTab === "saving" ? "text-green-700" : "text-gray-600"}`}
            >
              Tax Saving
            </span>
          </button>

          <button
            onClick={() => setActiveTab("compliance")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === "compliance" ? "border-green-500 bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"}`}
          >
            <ShieldCheck
              className={`w-8 h-8 mb-2 ${activeTab === "compliance" ? "text-green-600" : "text-gray-400"}`}
            />
            <span
              className={`font-semibold text-sm ${activeTab === "compliance" ? "text-green-700" : "text-gray-600"}`}
            >
              Compliance
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          {activeTab === "ca" && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    Need Expert Assistance?
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Recommended
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our certified eCAs are ready to help you optimize your tax
                  returns securely and accurately. Assign a dedicated CA to your
                  profile today.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 text-sm text-gray-500 mb-6">
                  <div>
                    <strong className="text-gray-700">Name:</strong>{" "}
                    {profile?.name}
                  </div>
                  <div>
                    <strong className="text-gray-700">Financial Year:</strong>{" "}
                    2025-26
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Link
                  to="/contact"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  <MessageSquare className="w-5 h-5" /> Contact Your eCA
                </Link>
              </div>
            </div>
          )}

          {activeTab === "self" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Self Filing Guide (India)
              </h3>
              <p className="text-gray-600 mb-6">
                Ready to file your own income tax return? Follow these standard
                procedures to quickly and accurately file your returns via the
                official portal.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Gather Your Documents
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Ensure you have your PAN, Aadhar, Form 16 (from employer),
                      bank statements, and investment proofs (80C, 80D, etc.)
                      ready before starting.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Login to the e-Filing Portal
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Visit the official Income Tax e-Filing website using your
                      PAN as the User ID to log securely into your dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Select Appropriate ITR Form & File
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Choose the correct form (e.g., ITR-1 for salaried
                      individuals). The portal auto-fills most data using your
                      AIS and 26AS. Review, update any missing details, and
                      submit.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      e-Verify Your Return
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Once submitted, you MUST e-Verify your return within 30
                      days using an Aadhar OTP or Net Banking for the process to
                      be complete.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <a
                  href="https://eportal.incometax.gov.in/iec/foservices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  <ExternalLink className="w-5 h-5" /> Go to IT e-Filing Portal
                </a>
              </div>
            </div>
          )}

          {(activeTab === "saving" || activeTab === "compliance") && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Feature Coming Soon
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We are currently building this section to provide you with
                comprehensive insights. Check back soon!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
