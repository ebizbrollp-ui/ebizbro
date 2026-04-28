"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { FaEye, FaTrash } from "react-icons/fa";
import { hasAccess, getDoc } from "../utils/appLogic";
import { useEffect, useState } from "react";

export default function GSTPage() {
  const { userData, setUserData } = useUserData();

  const [requested, setRequested] = useState(false);

  if (!userData) return <div className="p-6">Loading...</div>;

  const isGSTPurchased = hasAccess(userData, "gst");

  const KEY = `req_gst_${userData.id}`;
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

    const message = `Hi, I want to request GST Filing.

Name: ${userData.name}
Email: ${userData.email}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    localStorage.setItem(KEY, Date.now().toString());
    setRequested(true);

    alert("✅ Request sent. File will be delivered within 24 hours.");
  };

  // 🔥 NEW: Doc Request with 24h logic
  const handleDocRequest = (docName: string, docKey: string) => {
    const KEY = `req_gst_doc_${docKey}_${userData.id}`;
    const lastRequest = localStorage.getItem(KEY);

    if (lastRequest) {
      const diff = Date.now() - Number(lastRequest);

      if (diff < 24 * 60 * 60 * 1000) {
        alert(`⏳ You already requested ${docName}. Try again after 24 hours.`);
        return;
      }
    }

    const message = `Hi, I want to request ${docName}.

Name: ${userData.name}
Email: ${userData.email}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    localStorage.setItem(KEY, Date.now().toString());

    alert(`✅ ${docName} request sent.`);
  };

  // ================= FILE HANDLERS =================
  const handleUpload = (key: string, files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);

    setUserData((prev: any) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: [...(prev.documents[key] || []), ...newFiles],
      },
    }));
  };

  const handleDelete = (key: string, index: number) => {
    setUserData((prev: any) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: prev.documents[key].filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const gstr1 = getDoc(userData, "gstr1");
  const gstr3b = getDoc(userData, "gstr3b");

  const totalSales =
    gstr1.length > 0 ? userData.gstData?.sales || 0 : 0;

  const outputTax =
    gstr1.length > 0 ? userData.gstData?.outputTax || 0 : 0;

  const liability =
    gstr3b.length > 0
      ? userData.gstData?.liability || 0
      : "Yet to be filed";

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen ml-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <Header title="My GST Services"/>

        <div className="relative p-10">

          {!isGSTPurchased && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-xl">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">
                  🔒 GST Service Locked
                </h2>

                <p className="text-gray-600 text-sm">
                  Purchase GST or Virtual CFO service to access this dashboard
                </p>

                <a
                  href="https://wa.me/919875426592?text=I want to purchase GST service"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full"
                >
                  Purchase via WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className={`${!isGSTPurchased ? "blur-sm pointer-events-none" : ""}`}>

            <h1 className="text-2xl font-semibold mb-6">
              My GST Dashboard
            </h1>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  GST Filing Status
                </h2>
                <p>
                  Status: <b>{userData.gst?.status || "Not Started"}</b>
                </p>
              </div>

              <button
                onClick={handleRequest}
                disabled={requested}
                className={`px-5 py-2 rounded-lg text-white ${
                  requested ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                {requested ? "Requested" : "Request Filing"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm">Total Sales</p>
                <p className="text-xs text-gray-400">
                  As per last filed GSTR-1
                </p>
                <p className="text-xl font-semibold mt-1">
                  ₹ {totalSales}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm">Output Tax</p>
                <p className="text-xs text-gray-400">
                  As per last filed GSTR-1
                </p>
                <p className="text-xl font-semibold mt-1">
                  ₹ {outputTax}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm">Liability</p>
                <p className="text-xl font-semibold mt-1">
                  {typeof liability === "number"
                    ? `₹ ${liability}`
                    : liability}
                </p>
              </div>
            </div>

            {/* 🔥 FIXED REQUEST BUTTONS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold mb-4">
                Latest Return Filing Acknowledgement (From Ebizbro)
              </h3>

              <div className="grid grid-cols-2 gap-6">

                <div className="border rounded-xl p-4 flex justify-between items-center">
                  <span>GSTR-1 Acknowledgement</span>

                  {gstr1.length > 0 ? (
                    <a className="text-blue-600 text-sm">Download</a>
                  ) : (
                    <button
                      onClick={() => handleDocRequest("GSTR-1 Acknowledgement", "gstr1")}
                      className="text-orange-500 text-sm"
                    >
                      Request
                    </button>
                  )}
                </div>

                <div className="border rounded-xl p-4 flex justify-between items-center">
                  <span>GSTR-3B Acknowledgement</span>

                  {gstr3b.length > 0 ? (
                    <a className="text-blue-600 text-sm">Download</a>
                  ) : (
                    <button
                      onClick={() => handleDocRequest("GSTR-3B Acknowledgement", "gstr3b")}
                      className="text-orange-500 text-sm"
                    >
                      Request
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}