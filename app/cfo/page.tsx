"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { hasAccess } from "../utils/appLogic";
import { useEffect, useState } from "react";

export default function CFOPage() {
  const { userData } = useUserData();

  const [requested, setRequested] = useState(false);

  if (!userData) return <div className="p-6">Loading...</div>;

  const isAccessible = hasAccess(userData, "cfo");

  const cfo = userData?.cfo || {};
  const notices = Array.isArray(userData?.notices)
    ? userData.notices
    : [];

  const KEY = `req_cfo_${userData.id}`;
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

    const message = `Hi, I want Virtual CFO assistance.

Name: ${userData.name}
Email: ${userData.email}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    localStorage.setItem(KEY, Date.now().toString());
    setRequested(true);

    alert("✅ Request sent. We will respond within 24 hours.");
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      
      <Sidebar />

      <div className="flex-1 ml-[260px]">
        <Header title="Virtual CFO Dashboard" />

        <div className="relative p-6 space-y-6">

          {!isAccessible && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-xl">
              <div className="text-center space-y-4 p-6">

                <h2 className="text-xl font-semibold text-gray-800">
                  🔒 Virtual CFO Locked
                </h2>

                <p className="text-gray-600 text-sm">
                  Purchase Virtual CFO service to unlock your complete business dashboard
                </p>

                <a
                  href="https://wa.me/919875426592?text=I want to purchase Virtual CFO service"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full"
                >
                  Purchase via WhatsApp
                </a>

              </div>
            </div>
          )}

          <div
            className={`space-y-6 ${
              !isAccessible ? "pointer-events-none blur-sm select-none" : ""
            }`}
          >

            {/* BUSINESS HEALTH SCORE */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">

              <div>
                <h2 className="text-lg opacity-80">
                  Your Business Health Score
                </h2>

                <p className="text-4xl font-bold mt-2">
                  {cfo.score ?? "--"}
                </p>

                <p className="text-sm opacity-80 mt-1">
                  Based on compliance & financial indicators
                </p>
              </div>

              <div className="flex flex-col gap-2">

                {cfo.excelUrl ? (
                  <a
                    href={cfo.excelUrl}
                    target="_blank"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Download Report
                  </a>
                ) : (
                  <button className="bg-white/30 px-4 py-2 rounded-lg text-sm">
                    Not Available
                  </button>
                )}

              </div>

            </div>

            {/* SCORE BREAKDOWN */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Score Breakdown
              </h3>

              {Array.isArray(cfo.breakdown) && cfo.breakdown.length > 0 ? (
                cfo.breakdown.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between border-b py-2 text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="text-red-500">
                      {item.deduction}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No data available
                </p>
              )}
            </div>

            {/* COMPLIANCE */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Your Compliance Overview
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div className="border p-4 rounded-lg">
                  <p className="font-medium">Income Tax</p>
                  <p className="text-sm text-gray-500">
                    Status: {userData?.itr?.status || "Not Started"}
                  </p>
                </div>

                <div className="border p-4 rounded-lg">
                  <p className="font-medium">GST</p>
                  <p className="text-sm text-gray-500">
                    Status: {userData?.gst?.status || "Not Started"}
                  </p>
                </div>

                <div className="border p-4 rounded-lg">
                  <p className="font-medium">Notices</p>
                  <p className="text-sm text-gray-500">
                    {notices.length} Active Notices
                  </p>
                </div>

                <div className="border p-4 rounded-lg">
                  <p className="font-medium">Legal</p>
                  <p className="text-sm text-gray-500">
                    Compliance Active
                  </p>
                </div>

              </div>
            </div>

            {/* REPORTS (unchanged) */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Financial Reports
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {["P&L Statement", "Balance Sheet", "Cash Flow"].map(
                  (report) => (
                    <div
                      key={report}
                      className="border p-4 rounded-lg flex justify-between items-center"
                    >
                      <span>{report}</span>

                      <a
                        href={`https://wa.me/919875426592?text=I want ${report}`}
                        target="_blank"
                        className="text-blue-600 text-sm"
                      >
                        Request
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Actions
              </h3>

              <div className="flex gap-4">

                <button
                  onClick={handleRequest}
                  disabled={requested}
                  className={`px-4 py-2 rounded-lg text-white ${
                    requested ? "bg-gray-400" : "bg-green-500"
                  }`}
                >
                  {requested ? "Requested" : "Talk to CFO"}
                </button>

                <a
                  href="https://wa.me/919875426592?text=I have a business query"
                  target="_blank"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Ask a Question
                </a>

              </div>
            </div>

            {/* ALERTS */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-3">
                Alerts & Recommendations
              </h3>

              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  {userData?.gst?.status !== "Filed"
                    ? "⚠ GST filing pending"
                    : "✅ GST up to date"}
                </li>

                <li>
                  {notices.length > 0
                    ? "📌 Notice requires attention"
                    : "✅ No active notices"}
                </li>

                <li>📊 Improve compliance score</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}