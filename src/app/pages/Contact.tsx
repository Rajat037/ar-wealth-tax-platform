import { MapPin, Phone, Mail, Send, Star, Shield, Award } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getApiUrl } from "../lib/api";

export function Contact() {
  const API_URL = getApiUrl();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    otherDetails: "",
    comments: "",
  });

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

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const csrfToken = await fetchCsrfToken();

      const response = await fetch(`${API_URL}/api/contact`, {
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
        throw new Error(data.error || "Failed to submit the form");
      }

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        otherDetails: "",
        comments: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100"
          >
            We're here to help with all your tax filing needs
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-semibold mb-6">
              Get Instant Tax Help
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter your phone"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Required
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="Tax Return Filing & Advisory">
                    Tax Return Filing & Advisory
                  </option>
                  <option value="Company / Firm Incorporation">
                    Company / Firm Incorporation
                  </option>
                  <option value="Financial & Corporate Advisory">
                    Financial & Corporate Advisory
                  </option>
                  <option value="Auditing & Assurance Services">
                    Auditing & Assurance Services
                  </option>
                  <option value="Other Services">Other Services</option>
                </select>
              </div>

              {formData.service === "Other Services" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden"
                >
                  <label
                    htmlFor="otherDetails"
                    className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                  >
                    Please specify the service you need
                  </label>
                  <input
                    type="text"
                    id="otherDetails"
                    value={formData.otherDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, otherDetails: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="e.g., GST Registration"
                    required
                  />
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comments
                </label>
                <textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium border border-green-200"
                  role="status"
                  aria-live="polite"
                >
                  Thank you! We have received your message and will reach out
                  shortly.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium border border-red-200"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white mb-6">
              <h2 className="text-3xl font-semibold mb-6">
                We are here to help
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-blue-100">Amritsar, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-blue-100">+91 8887759387</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-blue-100">arwealthtaxco@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-[300px]">
              <iframe
                src="https://maps.google.com/maps?q=Amritsar,+India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <div className="text-3xl font-semibold mb-2">4.8 Google</div>
              <p className="text-gray-600">Rating</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <div className="text-3xl font-semibold mb-2">
                Trusted by 1+ Million
              </div>
              <p className="text-gray-600">Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-semibold mb-2">Secure and</div>
              <p className="text-gray-600">Encrypted</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <Award className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <div className="text-3xl font-semibold mb-2">
                Authorized by Income
              </div>
              <p className="text-gray-600">Tax Department</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-indigo-600"
        >
          <h2 className="text-2xl font-semibold mb-4">A.R. Wealth & Tax Co.</h2>
          <p className="text-gray-700 mb-4">
            Amritsar, Punjab,
            <br />
            India
          </p>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">4.7</span>
            <span className="text-gray-600">(2,473)</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
