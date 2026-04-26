"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useUserData } from "../context/UserDataContext";
import { FaEye } from "react-icons/fa";
import { hasAccess } from "../utils/appLogic";

export default function NoticesPage() {
  const { userData } = useUserData();

  if (!userData) return <div className="p-6">Loading...</div>;

  // ✅ CENTRAL ACCESS CONTROL (VCFO INCLUDED)
  const isAccessible = hasAccess(userData, "legal");

  // ✅ SAFE DATA FETCH (important fix)
  const notices = Array.isArray(userData?.notices)
    ? userData.notices
    : [];

  // ================= STATUS LOGIC =================
  const getStatus = (notice: any) => {
    if (notice.reply) return "Responded";

    if (!notice.dueDate) return "Pending";

    const today = new Date();
    const due = new Date(notice.dueDate);

    if (today > due) return "Overdue";

    return "Pending";
  };

  const overdueNotices = notices.filter(
    (n: any) => getStatus(n) === "Overdue"
  );

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-[260px]">
        <Header title="My Notices & Replies" />

        <div className="relative p-6 space-y-6">

          {/* 🔒 LOCK OVERLAY */}
          {!isAccessible && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-xl">
              <div className="text-center space-y-4 p-6">

                <h2 className="text-xl font-semibold text-gray-800">
                  🔒 Notices Access Locked
                </h2>

                <p className="text-gray-600 text-sm">
                  Purchase Legal or Virtual CFO service to access this section
                </p>

                <a
                  href="https://wa.me/919875426592?text=I want to purchase Legal service"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full"
                >
                  Purchase via WhatsApp
                </a>

              </div>
            </div>
          )}

          {/* ACTUAL CONTENT */}
          <div
            className={`space-y-6 ${
              !isAccessible ? "pointer-events-none blur-sm select-none" : ""
            }`}
          >

            {/* 🔥 OVERDUE ALERT */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow">
              <h3 className="font-semibold text-red-700">
                ⚠ Overdue Notices
              </h3>

              {overdueNotices.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  No overdue notices
                </p>
              ) : (
                overdueNotices.map((n: any, i: number) => (
                  <p key={i} className="text-sm text-red-600 mt-1">
                    {n.title}
                  </p>
                ))
              )}
            </div>

            {/* HEADER CARD */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold">
                Notices Received
              </h2>
              <p className="text-sm text-gray-500">
                View and respond to notices issued by departments
              </p>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Notice</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {notices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">
                        No notices received
                      </td>
                    </tr>
                  ) : (
                    notices.map((notice: any, i: number) => {
                      const status = getStatus(notice);

                      return (
                        <tr key={i} className="border-t">

                          <td className="p-3">{notice.title || "-"}</td>
                          <td className="p-3">{notice.department || "-"}</td>
                          <td className="p-3">{notice.date || "-"}</td>
                          <td className="p-3">
                            {notice.dueDate || "-"}
                          </td>

                          {/* STATUS */}
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : status === "Responded"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="p-3 flex items-center gap-3">

                            {/* VIEW NOTICE */}
                            {notice.file && (
                              <a
                                href={notice.file}
                                target="_blank"
                                className="text-blue-600"
                              >
                                <FaEye />
                              </a>
                            )}

                            {/* REPLY */}
                            {notice.reply ? (
                              <div className="flex gap-2 text-xs">
                                <a
                                  href={notice.reply}
                                  target="_blank"
                                  className="text-green-600 font-medium"
                                >
                                  View
                                </a>

                                <a
                                  href={notice.reply}
                                  download
                                  className="text-blue-600 font-medium"
                                >
                                  Download
                                </a>
                              </div>
                            ) : (
                              <span className="text-red-500 text-xs font-medium">
                                Pending
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}