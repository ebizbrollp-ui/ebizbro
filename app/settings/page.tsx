"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function SettingsPage() {
  const { userData, setUserData } = useUserData();
  const router = useRouter();

  if (!userData) return <div className="p-6">Loading...</div>;

  const user = auth.currentUser;
  const isGoogleUser = user?.providerData[0]?.providerId === "google.com";

  const [form, setForm] = useState({
    name: userData.name || "",
    phone: userData.phone || "",
    pan: userData.pan || "",
    gst: userData.gstId || "",
  });

  const [editing, setEditing] = useState<any>({});

  const [notifications, setNotifications] = useState({
    email: userData?.preferences?.email ?? true,
    whatsapp: userData?.preferences?.whatsapp ?? true,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  // ================= SAVE =================
  const handleSave = async () => {
    await updateDoc(doc(db, "users", userData.uid), {
      ...form,
      preferences: notifications,
    });

    setUserData((prev: any) => ({
      ...prev,
      ...form,
      preferences: notifications,
    }));

    alert("✅ Saved successfully");
  };

  // ================= PASSWORD CHANGE =================
  const handlePasswordChange = async () => {
    if (!user || isGoogleUser) return;

    try {
      const cred = EmailAuthProvider.credential(
        user.email!,
        passwords.old
      );

      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, passwords.new);

      alert("✅ Password updated");
      setShowPasswordModal(false);
    } catch {
      alert("❌ Incorrect old password or error");
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async () => {
    try {
      if (!user?.email) {
        alert("No email found");
        return;
      }

      await sendPasswordResetEmail(auth, user.email);
      alert("📩 Password reset email sent.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header title="Settings" />

        <div className="p-6 space-y-6">

          {/* ================= PROFILE ================= */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-4">Profile Information</h3>

            <div className="grid grid-cols-2 gap-4">

              {/* NAME */}
              <div className="relative">
                <label className="text-xs text-gray-500">Full Name</label>

                <input
                  disabled={!editing.name}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`w-full mt-1 p-2 pr-10 border rounded transition-all
                    ${
                      editing.name
                        ? "bg-white border-blue-500 ring-2 ring-blue-100 outline-none"
                        : "bg-gray-100 cursor-not-allowed text-gray-600"
                    }`}
                />

                <Pencil
                  size={16}
                  onClick={() =>
                    setEditing({ ...editing, name: !editing.name })
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 mt-3 cursor-pointer transition
                    ${
                      editing.name
                        ? "text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                  value={userData.email}
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                />
              </div>

              {/* PHONE */}
              <div className="relative">
                <label className="text-xs text-gray-500">Phone</label>

                <input
                  disabled={!editing.phone}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className={`w-full mt-1 p-2 pr-10 border rounded transition-all
                    ${
                      editing.phone
                        ? "bg-white border-blue-500 ring-2 ring-blue-100 outline-none"
                        : "bg-gray-100 cursor-not-allowed text-gray-600"
                    }`}
                />

                <Pencil
                  size={16}
                  onClick={() =>
                    setEditing({ ...editing, phone: !editing.phone })
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 mt-3 cursor-pointer transition
                    ${
                      editing.phone
                        ? "text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                />
              </div>

            </div>
          </div>

          {/* ================= BUSINESS ================= */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-4">Business Details</h3>

            <div className="grid grid-cols-2 gap-4">

              {["pan", "gst"].map((field) => (
                <div key={field} className="relative">
                  <label className="text-xs text-gray-500">
                    {field === "pan" ? "PAN" : "GSTIN"}
                  </label>

                  <input
                    disabled={!editing[field]}
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className={`w-full mt-1 p-2 pr-10 border rounded transition-all
                      ${
                        editing[field]
                          ? "bg-white border-blue-500 ring-2 ring-blue-100 outline-none"
                          : "bg-gray-100 cursor-not-allowed text-gray-600"
                      }`}
                  />

                  <Pencil
                    size={16}
                    onClick={() =>
                      setEditing({ ...editing, [field]: !editing[field] })
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 mt-3 cursor-pointer transition
                      ${
                        editing[field]
                          ? "text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  />
                </div>
              ))}

            </div>
          </div>

          {/* ================= NOTIFICATIONS ================= */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-4">Notifications</h3>

            <div className="flex flex-col gap-3">
              <label className="flex justify-between">
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

              <label className="flex justify-between">
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

          {/* ================= SECURITY ================= */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-4">Security</h3>

            {isGoogleUser ? (
              <p className="text-gray-500 text-sm">
                Logged in with your Google Account
              </p>
            ) : (
              <div className="flex justify-between">
                <span>Password: ••••••••</span>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-blue-600 text-sm"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              onClick={() => {
                signOut(auth);
                router.push("/login");
              }}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

        </div>
      </div>

      {/* ================= PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-3">

            <h3 className="font-semibold">Change Password</h3>

            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setPasswords({ ...passwords, old: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />

            <button
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 text-left"
            >
              Forgot Password?
            </button>

            <div className="flex justify-between">
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>

              <button
                onClick={handlePasswordChange}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}