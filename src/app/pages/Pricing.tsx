import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getApiUrl } from "../lib/api";

const pricingPlans = [
  {
    id: "standard",
    name: "eCA Assisted - Standard",
    icon: "💳",
    description:
      "Includes salary income from one employer, single house property income & income from other sources.",
    basePrice: "₹2999",
    price: "₹ 2314",
    features: [
      "Salary income from one employer",
      "Single house property income",
      "Income from other sources",
      "Expert eCA support",
      "100% refund guarantee",
    ],
  },
  {
    id: "multiple-form-16",
    name: "eCA Assisted - Multiple Form 16",
    icon: "💼",
    description:
      "Everything in Standard plus salary income from multiple employers.",
    basePrice: "₹3429",
    price: "₹ 2743",
    features: [
      "All features of Standard plan",
      "Salary income from multiple employers",
      "Multiple Form 16 support",
      "Expert eCA support",
      "Priority processing",
    ],
  },
  {
    id: "business-income",
    name: "eCA Assisted - Business Income",
    icon: "📊",
    description:
      "Everything in Multiple Form 16 plus income from multiple house property and income u/s 44AD & 44ADA.",
    basePrice: "₹5160",
    price: "₹ 4128",
    features: [
      "All features of Multiple Form 16",
      "Multiple house property income",
      "Business income u/s 44AD & 44ADA",
      "Comprehensive tax planning",
      "Dedicated expert support",
    ],
  },
  {
    id: "capital-gain",
    name: "eCA Assisted - Capital Gain",
    icon: "📈",
    description:
      "Everything in Business Income plus capital gain income and relief u/s 89.",
    basePrice: "₹7939",
    price: "₹ 6351",
    features: [
      "All features of Business Income",
      "Capital gain income calculation",
      "Relief under section 89",
      "Investment advisory",
      "Tax saving strategies",
    ],
  },
  {
    id: "nri",
    name: "eCA Assisted - NRI",
    icon: "🌍",
    description: "Provides maximum tax benefit on your Indian income.",
    basePrice: "₹11910",
    price: "₹ 9528",
    features: [
      "NRI-specific tax filing",
      "Maximum tax benefits",
      "Double taxation relief",
      "Foreign income reporting",
      "Expert NRI tax consultant",
    ],
  },
  {
    id: "foreign",
    name: "eCA Assisted - Foreign",
    icon: "🔍",
    description:
      "Covers all your foreign income and provides the maximum benefit under DTAA.",
    basePrice: "₹15880",
    price: "₹ 12704",
    features: [
      "Foreign income reporting",
      "Maximum benefit under DTAA",
      "Schedule FA filing",
      "Comprehensive tax planning",
      "Premium expert support",
    ],
  },
];

const loadRazorpayScript = (src: string) =>
  new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const convertRupeesToPaise = (price: string) =>
  Number(price.replace(/[^\d]/g, "")) * 100;

const fetchCsrfToken = async (apiUrl: string) => {
  const response = await fetch(`${apiUrl}/api/csrf-token`, {
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to retrieve CSRF token.");
  }

  return data.csrfToken;
};

export function Pricing() {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = getApiUrl();

  const handleBuyNow = async (plan: (typeof pricingPlans)[number]) => {
    setPaymentLoading(true);
    setError(null);

    const priceInPaise = convertRupeesToPaise(plan.price);
    const scriptLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!scriptLoaded) {
      setError("Unable to load payment gateway. Please try again.");
      setPaymentLoading(false);
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken(API_URL);

      const createOrderResponse = await fetch(
        `${API_URL}/api/payments/create-order`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            planId: plan.id,
            planName: plan.name,
            amount: priceInPaise,
          }),
        },
      );

      const data = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        setError(data.error || "Failed to create payment order.");
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "A.R. Wealth & Tax Co.",
        description: plan.name,
        order_id: data.order.id,
        handler: async (response: any) => {
          const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyResult = await verifyResponse.json();
          if (!verifyResponse.ok) {
            setError(verifyResult.error || "Payment verification failed.");
          } else {
            window.alert("Payment successful! Your order has been confirmed.");
          }
          setPaymentLoading(false);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          planId: plan.id,
          planName: plan.name,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setError(error.message || "Unable to initiate payment.");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            Income Tax Return Filing Pricing Plans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100"
          >
            Select The{" "}
            <span className="underline decoration-2">Product That's Right</span>{" "}
            For You
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="text-5xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6 min-h-[60px]">
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Base Price:</span>
                  <span className="text-lg text-gray-400 line-through">
                    {plan.basePrice}
                  </span>
                </div>
                <div className="text-4xl font-semibold text-gray-900 mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-500">+ Taxes</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyNow(plan)}
                disabled={paymentLoading}
                className="w-full bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paymentLoading ? "Processing..." : "Buy Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold text-center mb-12"
          >
            Why Choose A.R. Wealth & Tax Co.?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                100% Accurate Filing
              </h3>
              <p className="text-gray-600">
                Our expert eCAs ensure your returns are filed accurately with
                maximum refund
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Quick & Easy Process
              </h3>
              <p className="text-gray-600">
                File your ITR in just 4 minutes with our simple and intuitive
                platform
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Secure & Confidential
              </h3>
              <p className="text-gray-600">
                Your data is encrypted and protected with bank-level security
                standards
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-semibold mb-4">
            Not Sure Which Plan to Choose?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our tax experts can help you select the best plan for your needs
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors"
          >
            Talk to an Expert
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
