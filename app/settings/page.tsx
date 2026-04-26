"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { userData, setUserData } = useUserData();
  const router = useRouter();

  if (!userData) return <div className="p-6">Loading...</div>;

  const [form, setForm] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    pan: userData.pan || "",
    gst: userData.gstId || "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
  });

  // ================= SAVE =================
  const handleSave = () => {
    setUserData((prev: any) => ({
      ...prev,
      ...form,
      preferences: notifications,
    }));

    alert("Settings updated successfully");
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      
      <Sidebar />

      <div className="flex-1 ml-[260px]">
        <Header title="Settings" />

        <div className="p-6 space-y-6">

          {/* ================= PROFILE ================= */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Profile</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Full Name"
                className="p-2 border rounded"
              />

              <input
                value={form.email}
                disabled
                className="p-2 border rounded bg-gray-100"
              />

              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Phone Number"
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* ================= BUSINESS ================= */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Business Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={form.pan}
                onChange={(e) =>
                  setForm({ ...form, pan: e.target.value })
                }
                placeholder="PAN Number"
                className="p-2 border rounded"
              />

              <input
                value={form.gst}
                onChange={(e) =>
                  setForm({ ...form, gst: e.target.value })
                }
                placeholder="GSTIN"
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* ================= PREFERENCES ================= */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Preferences</h3>

            <div className="flex flex-col gap-3">

              <label className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      email: !notifications.email,
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span>WhatsApp Updates</span>
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      whatsapp: !notifications.whatsapp,
                    })
                  }
                />
              </label>

            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-between items-center">

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

          {/* ================= DANGER ZONE ================= */}
          <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
            <h3 className="font-semibold text-red-600 mb-2">
              Danger Zone
            </h3>

            <button className="text-red-600 text-sm">
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}