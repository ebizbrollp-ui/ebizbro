"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { FaEye, FaEyeSlash, FaTrash, FaUpload } from "react-icons/fa";
import { hasAccess, getDoc } from "../utils/appLogic";
import { auth } from "@/app/lib/firebase";

import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

// ✅ ADDED
import { uploadFile } from "../utils/uploadFile";

export default function DocumentsPage() {
  const { userData, setUserData } = useUserData();

  const [showITRPassword, setShowITRPassword] = useState(false);
  const [showGSTPassword, setShowGSTPassword] = useState(false);

  if (!userData) return <div className="p-10">Loading...</div>;

  const hasITR = hasAccess(userData, "itr");
  const hasGST = hasAccess(userData, "gst");

  const userId = userData.id;

  // ================= FILE HANDLERS =================

  const handleUpload = async (key: string, file: File) => {
    // ✅ FIXED: Firebase upload instead of blob URL
    const url = await uploadFile(file, userId, key);

    if (!url) return;

    const updatedDocs = {
      ...userData.documents,
      [key]: [url],
    };

    setUserData((prev: any) => ({
      ...prev,
      documents: updatedDocs,
    }));

    await updateDoc(doc(db, "users", userId), {
      documents: updatedDocs,
    });
  };

  const handleDelete = async (key: string) => {
    const updatedDocs = {
      ...userData.documents,
      [key]: [],
    };

    setUserData((prev: any) => ({
      ...prev,
      documents: updatedDocs,
    }));

    await updateDoc(doc(db, "users", userId), {
      documents: updatedDocs,
    });
  };

  // ================= TILE =================

  const Tile = ({ title, keyName }: any) => {
    const files = getDoc(userData, keyName);
    const uploaded = files.length > 0;

    return (
      <div className="border rounded-xl p-4 flex flex-col gap-2 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="font-medium">{title}</span>
          {uploaded ? (
            <span className="text-green-600 text-xs">Uploaded</span>
          ) : (
            <span className="text-red-500 text-xs">Not Uploaded</span>
          )}
        </div>

        <div className="flex gap-3 items-center text-sm">
          {uploaded ? (
            <>
              <a href={files[0]} target="_blank">
                <FaEye className="cursor-pointer text-gray-600" />
              </a>
              <FaTrash
                className="cursor-pointer text-red-500"
                onClick={() => handleDelete(keyName)}
              />
            </>
          ) : (
            <label className="cursor-pointer">
              <FaUpload className="text-blue-500" />
              <input
                type="file"
                hidden
                onChange={(e) =>
                  e.target.files &&
                  handleUpload(keyName, e.target.files[0])
                }
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  // ================= ACTION REQUIRED =================

  const actionItems = [];

  if (!getDoc(userData, "form16").length) {
    actionItems.push("Form 16 Missing");
  }

  if (!getDoc(userData, "invoices").length) {
    actionItems.push("GST Invoice Pending");
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen ml-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <Header title="My Documents & Details"/>

        <div className="p-10 pr-24 grid grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="col-span-2 space-y-6">

            {/* PERSONAL */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Personal Details</h3>
              <p>Name: {
                  userData?.name && userData.name !== "User"
                    ? userData.name
                    : auth.currentUser?.displayName || "User"
                }
              </p>
              <p>PAN: {userData.pan || "Not Provided"}</p>
            </div>


            {/* ================= ITR ================= */}
            <div className="relative">
              {!hasITR && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Income Tax Service Not Purchased
                  </p>
                </div>
              )}

              <div className={`${!hasITR ? "opacity-40 pointer-events-none" : ""} bg-white p-5 rounded-xl shadow space-y-4`}>
                <h2 className="font-semibold text-blue-700">Income Tax</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Tile title="PAN Card" keyName="panCard" />
                  <Tile title="Form 16" keyName="form16" />
                  <Tile title="Bank Statement" keyName="bankStatement" />
                  <Tile title="Investment Proof" keyName="investment" />
                </div>

                <div className="flex gap-3">
                  <a href="https://wa.me/919875426592?text=Request AIS/TIS" target="_blank"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                    Request AIS/TIS
                  </a>

                  <a href="https://wa.me/919875426592?text=Request Form 26AS" target="_blank"
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">
                    Request Form 26AS
                  </a>
                </div>
              </div>
            </div>

            {/* ================= GST ================= */}
            <div className="relative">
              {!hasGST && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    GST Service Not Purchased
                  </p>
                </div>
              )}

              <div className={`${!hasGST ? "opacity-40 pointer-events-none" : ""} bg-white p-5 rounded-xl shadow space-y-4`}>
                <h2 className="font-semibold text-green-700">GST</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Tile title="GST Certificate" keyName="gstCert" />
                  <Tile title="Invoices" keyName="invoices" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="Year" className="p-2 border rounded" />
                  <select className="p-2 border rounded">
                    <option>Return Type</option>
                    <option>GSTR-1</option>
                    <option>GSTR-3B</option>
                    <option>GSTR-9</option>
                  </select>
                  <input placeholder="Month" className="p-2 border rounded" />
                </div>

                <a href="https://wa.me/919875426592?text=Request GST Filing" target="_blank"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm inline-block">
                  Request Returns
                </a>
              </div>
            </div>
          </div>
              
          {/* RIGHT PANEL (UNCHANGED) */}
          <div className="space-y-6">

            {/* ITR LOGIN */}
            <div className="relative">
              {!hasITR && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                  <p className="text-sm font-semibold text-gray-700">Locked</p>
                </div>
              )}

              <div className={`${!hasITR ? "opacity-40 pointer-events-none" : ""} bg-white p-5 rounded-xl shadow`}>
                <h3 className="font-semibold text-blue-700 mb-3">Income Tax Portal</h3>
                <p className="text-sm">User ID: {userData.itrId || "-"}</p>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm">
                    Password: {showITRPassword ? userData.itrPassword : "••••••"}
                  </p>
                  <button onClick={() => setShowITRPassword(!showITRPassword)}>
                    {showITRPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* GST LOGIN */}
            <div className="relative">
              {!hasGST && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                  <p className="text-sm font-semibold text-gray-700">Locked</p>
                </div>
              )}

              <div className={`${!hasGST ? "opacity-40 pointer-events-none" : ""} bg-white p-5 rounded-xl shadow`}>
                <h3 className="font-semibold text-green-700 mb-3">GST Portal</h3>
                <p className="text-sm">User ID: {userData.gstId || "-"}</p>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm">
                    Password: {showGSTPassword ? userData.gstPassword : "••••••"}
                  </p>
                  <button onClick={() => setShowGSTPassword(!showGSTPassword)}>
                    {showGSTPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION REQUIRED */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Action Required</h3>

              {actionItems.length > 0 ? (
                actionItems.map((item, i) => (
                  <p key={i} className="text-red-500">{item}</p>
                ))
              ) : (
                <p className="text-green-600">All good ✅</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}