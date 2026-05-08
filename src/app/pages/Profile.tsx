import { Edit2, Save, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getApiUrl } from "../lib/api";

export function Profile() {
  const API_URL = getApiUrl();
  const [profile, setProfile] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setEditData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setProfile(editData);
        setIsEditingProfile(false);
        setIsEditingBilling(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar / Avatar Card */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-teal-400 rounded-full flex items-center justify-center text-white text-4xl font-semibold mx-auto mb-4 shadow-lg shadow-green-200">
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : "U"}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500 mb-6">{profile.email}</p>
            <button className="w-full py-3 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-green-600 rounded-xl font-medium transition-all shadow-sm border border-gray-200">
              Change Password
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Logins
            </h3>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
              <span className="text-gray-500">Today, Just now</span>
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                Chrome (Mac)
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* My Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-sm text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditData(profile);
                    }}
                    className="text-sm text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-gray-500 font-medium">Full Name</div>
                <div className="md:col-span-2">
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800 text-lg">
                      {profile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-gray-500 font-medium">Email Address</div>
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-800 text-lg opacity-70">
                    {profile.email}
                  </span>
                  <span className="ml-3 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Read Only
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-gray-500 font-medium">Mobile No.</div>
                <div className="md:col-span-2">
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editData.mobile_no || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, mobile_no: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+91-"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800 text-lg">
                      {profile.mobile_no || ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-gray-500 font-medium">
                  WhatsApp Updates
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  {isEditingProfile ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editData.whatsapp_subscribed}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            whatsapp_subscribed: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-700">
                        Subscribe for alerts
                      </span>
                    </label>
                  ) : (
                    <span
                      className={`font-semibold text-sm px-3 py-1 rounded-full ${profile.whatsapp_subscribed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {profile.whatsapp_subscribed
                        ? "Subscribed"
                        : "Not Subscribed"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800">Billing info</h2>
              {!isEditingBilling ? (
                <button
                  onClick={() => setIsEditingBilling(true)}
                  className="text-sm text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Billing
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingBilling(false);
                      setEditData(profile);
                    }}
                    className="text-sm text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
              <div>
                <span className="text-gray-500 block mb-2 font-medium">
                  Company Name
                </span>
                {isEditingBilling ? (
                  <input
                    type="text"
                    value={editData.company_name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, company_name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Acme Corp"
                  />
                ) : (
                  <span className="font-semibold text-gray-800 text-lg">
                    {profile.company_name || ""}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block mb-2 font-medium">
                  State
                </span>
                {isEditingBilling ? (
                  <input
                    type="text"
                    value={editData.state || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, state: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Maharashtra"
                  />
                ) : (
                  <span className="font-semibold text-gray-800 text-lg">
                    {profile.state || ""}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block mb-2 font-medium">
                  Billing Mobile No.
                </span>
                {isEditingBilling ? (
                  <input
                    type="text"
                    value={editData.billing_mobile || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        billing_mobile: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+91-"
                  />
                ) : (
                  <span className="font-semibold text-gray-800 text-lg">
                    {profile.billing_mobile || ""}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block mb-2 font-medium">
                  Billing Email
                </span>
                {isEditingBilling ? (
                  <input
                    type="email"
                    value={editData.billing_email || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        billing_email: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="billing@example.com"
                  />
                ) : (
                  <span className="font-semibold text-gray-800 text-lg">
                    {profile.billing_email || ""}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
