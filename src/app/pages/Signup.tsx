import {
  Mail,
  Lock,
  User,
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { getApiUrl } from "../lib/api";

export function Signup() {
  const API_URL = getApiUrl();
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCsrfToken = async () => {
    const response = await fetch(`${API_URL}/api/csrf-token`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to retrieve CSRF token.");
    }
    return data.csrfToken;
  };

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const csrfToken = await fetchCsrfToken();
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in with Google");
      }

      setStatus("success");
      await checkAuth();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const csrfToken = await fetchCsrfToken();
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      setStatus("success");
      await checkAuth();

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 sm:p-12 border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative Gradient Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/5 rounded-tr-full pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                Create Account
              </h2>
              <p className="text-gray-500 font-medium">
                Join us to manage your taxes easily.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center"
                  role="alert"
                  aria-live="assertive"
                  id="signup-status"
                >
                  {errorMessage}
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-green-50 text-green-600 text-sm font-medium rounded-lg text-center"
                  role="status"
                  aria-live="polite"
                  id="signup-status"
                >
                  Account created! Redirecting...
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-green-500 flex items-center justify-center gap-2 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none mt-6"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-75 disabled:pointer-events-none"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-500 px-1 py-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-600 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
