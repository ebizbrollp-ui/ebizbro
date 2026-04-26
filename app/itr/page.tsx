"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { hasAccess, getDoc } from "../utils/appLogic";
import { useEffect, useState } from "react";

export default function ITRPage() {
  const { userData } = useUserData();

  const [requested, setRequested] = useState(false);

  if (!userData) return <div className="p-6">Loading...</div>;

  const isITRPurchased = hasAccess(userData, "itr");

  const KEY = `req_itr_${userData.id}`;
  const PHONE = "919875426592";

  useEffect(() => {
    const saved = localStorage.getItem(KEY);

    if (saved) {
      const diff = Date.now() - Number(saved);

      if (diff < 24 * 60 * 60 * 1000) {
        setRequested(true);
      } else {
        localStorage.removeItem(KEY);
      }
    }
  }, []);

  const handleRequest = () => {
    const lastRequest = localStorage.getItem(KEY);

    if (lastRequest) {
      const diff = Date.now() - Number(lastRequest);

      if (diff < 24 * 60 * 60 * 1000) {
        alert("⏳ You have already requested. Try again after 24 hours.");
        return;
      }
    }

    const message = `Hi, I want to request ITR Computation.

Name: ${userData.name}
Email: ${userData.email}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    localStorage.setItem(KEY, Date.now().toString());
    setRequested(true);

    alert("✅ Request sent. File will be delivered within 24 hours.");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen ml-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <Header title="My Income Tax Return"/>

        <div className="relative p-10">

          {/* 🔒 LOCK */}
          {!isITRPurchased && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-xl">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">
                  🔒 ITR Service Locked
                </h2>
                <p className="text-gray-600 text-sm">
                  Purchase Taxation or Virtual CFO service to access this dashboard
                </p>
                <a
                  href="https://wa.me/919875426592?text=I want to purchase Taxation service"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full"
                >
                  Purchase via WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className={`${!isITRPurchased ? "blur-sm pointer-events-none" : ""}`}>

            <h1 className="text-2xl font-semibold mb-6">
              My Income Tax Return
            </h1>

            {/* ================= STATUS CARD ================= */}
            <div className="bg-white rounded-2xl p-6 shadow mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">ITR Filing Status</h2>
                <p>Status: <b>{userData?.itrStatus || "Not Filed"}</b></p>
                <p className="text-sm text-gray-500">
                  Due Date: {userData?.itrDueDate || "31-07-2026"}
                </p>
              </div>

              <button
                onClick={handleRequest}
                disabled={requested}
                className={`px-5 py-2 rounded-lg text-white ${
                  requested ? "bg-gray-400" : "bg-blue-600"
                }`}
              >
                {requested ? "Requested" : "Request Computation"}
              </button>
            </div>

            {/* ================= TAX CARDS ================= */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-gray-500">TDS (From 26AS)</p>
                <p className="text-xl font-semibold">
                  ₹{userData?.tax?.tds || 0}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-gray-500">Advance Tax</p>
                <p className="text-xl font-semibold">
                  ₹{userData?.tax?.advanceTax || 0}
                </p>
              </div>
            </div>

            {/* ================= UPLOAD DOCUMENTS ================= */}
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
              <h2 className="font-semibold mb-4">
                Upload Your Documents
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "PAN Card", key: "pan" },
                  { name: "Form 16", key: "form16" },
                  { name: "Bank Statement", key: "bankStatement" },
                  { name: "Investment Proof", key: "investmentProof" },
                  { name: "Others", key: "others" },
                ].map((doc) => {
                  const files = getDoc(userData, doc.key);

                  return (
                    <div key={doc.key} className="border rounded-xl p-4">
                      <div className="flex justify-between">
                        <span>{doc.name}</span>
                        <label className="text-blue-600 text-sm cursor-pointer">
                          Upload
                          <input type="file" className="hidden" multiple />
                        </label>
                      </div>

                      <p className={`text-sm mt-1 ${
                        files.length ? "text-green-600" : "text-gray-400"
                      }`}>
                        {files.length ? `${files.length} uploaded` : "Not uploaded"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= EBIZBRO DOCS ================= */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-4">
                Documents from Ebizbro
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "AIS", key: "ais" },
                  { name: "TIS", key: "tis" },
                  { name: "Form 26AS", key: "form26as" },
                ].map((doc) => {
                  const files = getDoc(userData, doc.key);

                  return (
                    <div
                      key={doc.key}
                      className="border rounded-xl p-4 flex justify-between items-center"
                    >
                      <span>{doc.name}</span>

                      {files.length > 0 ? (
                        <a
                          href={files[0]}
                          target="_blank"
                          className="text-blue-600 text-sm"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-orange-500 text-sm">
                          Request
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}