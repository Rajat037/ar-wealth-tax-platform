import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getApiUrl } from "../lib/api";

export function Login() {
  const API_URL = getApiUrl();
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const csrfToken = await fetchCsrfToken();
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      setStatus("success");
      await checkAuth();

      // Redirect to homepage after short delay
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
                className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 font-medium">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
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
                  id="login-status"
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
                  id="login-status"
                >
                  Login successful! Redirecting...
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-indigo-600 flex items-center justify-center gap-2 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none mt-4"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-500 px-1 py-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-indigo-600 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform"
              >
                Sign up instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
